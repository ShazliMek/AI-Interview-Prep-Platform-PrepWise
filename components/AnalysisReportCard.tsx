'use client';

import React from 'react';
import CircularProgress from './ui/circular-progress';
import { Button } from './ui/button';

interface AnalysisReportCardProps {
  analysis: {
    clarity: { filler_word_count: number };
    confidence_metrics: { pitch_stability_score: number };
    pace: number;
    // Add other metrics as needed
  };
  onEndInterview: () => void;
}

const AnalysisReportCard: React.FC<AnalysisReportCardProps> = ({ analysis, onEndInterview }) => {
  // Simple scoring logic (can be improved)
  const clarityScore = Math.max(0, 100 - analysis.clarity.filler_word_count * 10);
  const confidenceScore = analysis.confidence_metrics.pitch_stability_score;
  const paceScore = Math.max(0, 100 - Math.abs(analysis.pace - 150)); // Ideal pace is ~150 wpm

  const overallScore = (clarityScore + confidenceScore + paceScore) / 3;

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Post-Interview Analysis</h2>
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <CircularProgress value={clarityScore} />
          <p className="mt-2 font-semibold">Clarity</p>
        </div>
        <div>
          <CircularProgress value={confidenceScore} />
          <p className="mt-2 font-semibold">Confidence</p>
        </div>
        <div>
          <CircularProgress value={paceScore} />
          <p className="mt-2 font-semibold">Pace</p>
        </div>
      </div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold">Overall Score: <span className="text-blue-500">{overallScore.toFixed(1)}/100</span></h3>
      </div>
      <Button onClick={onEndInterview} className="w-full">
        End Interview
      </Button>
    </div>
  );
};

export default AnalysisReportCard;

