import librosa
import numpy as np
from transformers import pipeline
import re
from pydub import AudioSegment
from pydub.utils import make_chunks
import os
from collections import Counter
import torch

# We will lazy-load models to avoid slow server startup
asr_pipeline = None
ser_pipeline = None
sentiment_pipeline = None

def _load_models():
    """Loads and initializes the machine learning models."""
    global asr_pipeline, ser_pipeline, sentiment_pipeline
    if asr_pipeline is None:
        print("Loading ASR model (whisper)...")
        asr_pipeline = pipeline("automatic-speech-recognition", model="openai/whisper-base", device=0 if torch.cuda.is_available() else -1)
    if ser_pipeline is None:
        print("Loading SER model (wav2vec2)...")
        ser_pipeline = pipeline("audio-classification", model="superb/wav2vec2-base-superb-er", device=0 if torch.cuda.is_available() else -1)
    if sentiment_pipeline is None:
        print("Loading Sentiment Analysis model...")
        sentiment_pipeline = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment", device=0 if torch.cuda.is_available() else -1)

def _analyze_pauses(y, sr, top_db=20):
    """Analyzes pauses in the audio."""
    non_silent_intervals = librosa.effects.split(y, top_db=top_db)
    pauses = []
    last_end = 0
    for start, end in non_silent_intervals:
        pause_duration = (start - last_end) / sr
        if pause_duration > 0.5: # Consider pauses longer than 0.5s
            pauses.append(pause_duration)
        last_end = end
    return {
        "pause_count": len(pauses),
        "total_pause_duration": round(sum(pauses), 2)
    }

def analyze_audio(audio_path: str):
    """
    Performs a full analysis of the user's audio response by chunking.
    """
    _load_models()

    audio = AudioSegment.from_file(audio_path)
    # Ensure audio is mono for analysis
    audio = audio.set_channels(1)
    # Set frame rate for compatibility with models
    audio = audio.set_frame_rate(16000)

    chunk_length_ms = 30000  # 30 seconds
    overlap_ms = 2000 # 2 seconds overlap
    chunks = make_chunks(audio, chunk_length_ms)

    full_transcript = ""
    emotion_labels = []
    chunk_reports = []

    for i, chunk in enumerate(chunks):
        chunk_path = f"temp_chunk_{i}.wav"
        chunk.export(chunk_path, format="wav")

        y, sr = librosa.load(chunk_path, sr=16000)
        duration = librosa.get_duration(y=y, sr=sr)

        # Speech-to-Text
        transcript_result = asr_pipeline(y.copy())
        transcript = transcript_result["text"]
        full_transcript += transcript + " "

        # Emotion/Tone Analysis
        tone_result = ser_pipeline(y.copy(), top_k=1)
        if tone_result:
            emotion_labels.append(tone_result[0]['label'])

        # Pace for this chunk
        word_count = len(transcript.split())
        words_per_minute = (word_count / duration) * 60 if duration > 0 else 0
        
        chunk_reports.append({
            'words_per_minute': words_per_minute
        })

        os.remove(chunk_path)

    # Overall metrics from aggregated data
    y_full, sr_full = librosa.load(audio_path, sr=16000)
    total_duration = librosa.get_duration(y=y_full, sr=sr_full)
    total_word_count = len(full_transcript.split())
    overall_wpm = (total_word_count / total_duration) * 60 if total_duration > 0 else 0

    # Filler word analysis
    filler_words_list = re.findall(r'\b(um|uh|ah|er|like|so|you know)\b', full_transcript.lower())
    filler_word_counts = Counter(filler_words_list)

    # Sentiment of the whole transcript
    sentiment_result = sentiment_pipeline(full_transcript[:512]) # Truncate for model limit
    sentiment = sentiment_result[0]

    # Pause analysis on full audio
    pause_metrics = _analyze_pauses(y_full, sr_full)

    # Pitch analysis on full audio
    f0, _, _ = librosa.pyin(y_full, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    valid_f0 = f0[~np.isnan(f0)]
    pitch_std_dev = np.std(valid_f0) if len(valid_f0) > 0 else 0

    # Speech Rate Variability
    wpm_values = [r['words_per_minute'] for r in chunk_reports]
    wpm_std_dev = np.std(wpm_values) if len(wpm_values) > 1 else 0

    report = {
        "transcript": full_transcript.strip(),
        "duration_seconds": round(total_duration, 2),
        "sentiment": {
            "label": sentiment['label'],
            "confidence": round(sentiment['score'], 2)
        },
        "pace": {
            "average_wpm": round(overall_wpm),
            "wpm_variability": round(wpm_std_dev, 2)
        },
        "clarity": {
            "filler_word_count": len(filler_words_list),
            "filler_word_details": dict(filler_word_counts)
        },
        "pauses": pause_metrics,
        "confidence_metrics": {
            "pitch_stability_score": round(1 / (1 + pitch_std_dev) * 100)
        },
        "emotion_summary": dict(Counter(emotion_labels))
    }
    
    return report
