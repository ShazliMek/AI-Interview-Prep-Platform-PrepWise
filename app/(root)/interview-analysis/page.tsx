'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import AnalysisReportCard from '@/components/AnalysisReportCard'; // Corrected import path

// Define the type for the analysis result
interface AnalysisResult {
  clarity: { filler_word_count: number };
  confidence_metrics: { pitch_stability_score: number };
  pace: number;
  // Add other expected properties from your backend analysis
}

const InterviewAnalysisPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        sendForAnalysis(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendForAnalysis = async (audioBlob: Blob) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.wav');

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze-interview-response/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const analysis = await response.json();
      console.log('Analysis Complete:', analysis);
      setAnalysisResult(analysis); // <--- THIS IS THE FIX
    } catch (error) {
      console.error('Error sending audio for analysis:', error);
      alert('An error occurred during analysis. See the console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndInterview = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="container mx-auto p-4">
      {analysisResult ? (
        <AnalysisReportCard analysis={analysisResult} onEndInterview={handleEndInterview} />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <h1 className="text-2xl font-bold mb-4">AI Interview Practice</h1>
          <p className="mb-4 text-lg">
            {isRecording ? 'Recording in progress...' : 'Click the button to start recording your answer.'}
          </p>
          <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isProcessing}
            className={`px-8 py-4 text-lg rounded-full transition-colors ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {isProcessing && <p className="mt-4">Processing your audio, please wait...</p>}
        </div>
      )}
    </div>
  );
};

export default InterviewAnalysisPage;
