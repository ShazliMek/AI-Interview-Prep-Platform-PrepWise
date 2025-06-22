'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useState, useEffect, Suspense } from 'react';
import AnalysisCard from '@/components/shared/AnalysisCard';

// Define the fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    return res.json().then(errorBody => {
      throw new Error(errorBody.error || 'Failed to fetch');
    });
  }
  return res.json();
});

function InterviewAnalysisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interviewId');

  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'completed' | 'error'>('idle');
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    interviewId ? `/api/get-interview-details?interviewId=${interviewId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    if (data) {
      if (data.analysisReport) {
        setAnalysisReport(data.analysisReport);
        setAnalysisState('completed');
      }
      setIsSaved(data.isSaved || false);
    }
  }, [data]);

  const handleStartAnalysis = async () => {
    if (!data?.recordingUrl) {
      alert('Recording URL not found. Cannot start analysis.');
      return;
    }
    setAnalysisState('loading');
    try {
      const response = await fetch('/api/analyze-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId, recordingUrl: data.recordingUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }
      const report = await response.json();
      setAnalysisReport(report.analysisReport);
      setAnalysisState('completed');
      mutate();
    } catch (err: any) {
      console.error('Analysis Error:', err);
      alert(`Analysis failed: ${err.message}`);
      setAnalysisState('error');
    }
  };

  const handleDeleteInterview = async () => {
    if (!confirm('Are you sure you want to delete this interview?')) return;
    try {
      const response = await fetch(`/api/delete-interview?interviewId=${interviewId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete interview.');
      alert('Interview deleted successfully.');
      router.push('/');
    } catch (err: any) {
      alert(`Error deleting interview: ${err.message}`);
    }
  };

  const handleSaveInterview = async () => {
    if (isSaving || isSaved) return;
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-interview-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save interview');
      }
      setIsSaved(true);
      alert('Interview saved successfully!');
    } catch (err: any) {
      console.error('Save Interview Error:', err);
      alert(`Failed to save interview: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const getAnalysisButtonText = () => {
    if (analysisState === 'loading') return 'Analyzing...';
    if (analysisState === 'completed') return 'Redo Analysis';
    if (analysisState === 'error') return 'Try Analysis Again';
    return 'Start Analysis';
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><p>Loading interview data...</p></div>;
  if (error) return <div className="flex items-center justify-center h-screen"><p className="text-red-500">Error: {error.message}</p></div>;
  if (!data) return <div className="flex items-center justify-center h-screen"><p>No interview data found.</p></div>;

  return (
    <div className="container mx-auto p-4 md:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Interview Analysis</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Interview Recording</h2>
        {data.recordingUrl ? (
          <audio controls src={`/api/get-recording?filePath=${encodeURIComponent(data.recordingUrl)}`} className="w-full">
            Your browser does not support the audio element.
          </audio>
        ) : <p>Recording not available.</p>}
        <p className="text-sm text-gray-400 mt-2">Duration: {data.duration || 'N/A'} seconds</p>
      </div>

      {analysisState !== 'completed' && (
        <div className="mb-6">
          <button
            onClick={handleStartAnalysis}
            disabled={analysisState === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition-colors duration-300"
          >
            {getAnalysisButtonText()}
          </button>
        </div>
      )}
      
      {analysisState === 'loading' && <div className="text-center p-4">Analyzing... Please wait.</div>}
      
      {analysisState === 'completed' && analysisReport && (
        <div className="mt-6">
          <AnalysisCard report={analysisReport} />
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button
              onClick={handleSaveInterview}
              disabled={isSaving || isSaved}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isSaved ? 'Saved to My Interviews' : isSaving ? 'Saving...' : 'Save to My Interviews'}
            </button>
            <button
              onClick={handleStartAnalysis} // Redo analysis
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Redo Analysis
            </button>
            <button
              onClick={handleDeleteInterview}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Delete Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewAnalysisPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><p>Loading page...</p></div>}> 
      <InterviewAnalysisContent />
    </Suspense>
  );
}
