import librosa
import numpy as np
from transformers import pipeline
import re

# We will lazy-load models to avoid slow server startup
asr_pipeline = None
ser_pipeline = None

def _load_models():
    """Loads and initializes the machine learning models."""
    global asr_pipeline, ser_pipeline
    if asr_pipeline is None:
        print("Loading ASR model (whisper)...")
        asr_pipeline = pipeline("automatic-speech-recognition", model="openai/whisper-base")
    if ser_pipeline is None:
        print("Loading SER model (wav2vec2)...")
        ser_pipeline = pipeline("audio-classification", model="superb/wav2vec2-base-superb-er")

def _analyze_clarity_and_pace(transcript: str, duration_seconds: float):
    """Calculates clarity (filler words) and pace (words per minute)."""
    filler_words = re.findall(r'\b(um|uh|ah|er|like|so|you know)\b', transcript.lower())
    word_count = len(transcript.split())
    
    # Avoid division by zero
    if duration_seconds > 0:
        words_per_minute = (word_count / duration_seconds) * 60
    else:
        words_per_minute = 0
        
    return {
        "filler_word_count": len(filler_words),
        "words_per_minute": round(words_per_minute)
    }

def analyze_audio(audio_path: str):
    """
    Performs a full analysis of the user's audio response.
    
    Args:
        audio_path: The file path to the user's audio recording.
        
    Returns:
        A dictionary containing the full analysis report.
    """
    _load_models() # Ensure models are ready

    # 1. Get audio properties
    y, sr = librosa.load(audio_path, sr=16000) # Whisper and wav2vec2 expect 16kHz
    duration = librosa.get_duration(y=y, sr=sr)

    # 2. Speech-to-Text for transcript
    transcript_result = asr_pipeline(y.copy())
    transcript = transcript_result["text"]

    # 3. Emotion/Tone Analysis
    tone_result = ser_pipeline(y.copy(), top_k=1)
    primary_tone = tone_result[0] if tone_result else {"label": "unknown", "score": 0}

    # 4. Acoustic Analysis (Prosody for Confidence)
    f0, _, _ = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
    valid_f0 = f0[~np.isnan(f0)]
    pitch_std_dev = np.std(valid_f0) if len(valid_f0) > 0 else 0

    # 5. Clarity and Pace from transcript
    clarity_pace_metrics = _analyze_clarity_and_pace(transcript, duration)

    # 6. Combine results
    report = {
        "transcript": transcript,
        "duration_seconds": round(duration, 2),
        "tone": {
            "label": primary_tone["label"],
            "confidence": round(primary_tone["score"], 2)
        },
        "pace": clarity_pace_metrics["words_per_minute"],
        "clarity": {
            "filler_word_count": clarity_pace_metrics["filler_word_count"]
        },
        "confidence_metrics": {
            # Lower pitch deviation can indicate a more stable, confident tone.
            "pitch_stability_score": round(1 / (1 + pitch_std_dev) * 100)
        }
    }
    
    return report
