'use client';

import LogoTester from '@/components/LogoTester';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface DebugInterview {
  id: string;
  role: string;
  company: string;
  companyLogo: string;
  createdAt: string;
  debug?: {
    normalizedCompany: string;
    expectedLogo: string;
    actualLogo: string;
    isLogoCorrect: boolean;
  };
}

export default function LogoDebugPage() {
  const [interviews, setInterviews] = useState<DebugInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [fixStatus, setFixStatus] = useState<{message: string, success?: boolean} | null>(null);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-completed-interviews');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setInterviews(data.interviews);
        }
      }
    } catch (error) {
      console.error('Error fetching debug data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fixMetaLogos = async () => {
    setFixStatus({ message: 'Fixing Meta logos...' });
    try {
      const response = await fetch('/api/fix-meta-logos');
      const data = await response.json();
      
      if (data.success) {
        setFixStatus({ message: data.message, success: true });
        // Refresh the data
        fetchDebugData();
      } else {
        setFixStatus({ message: data.error || 'Fix failed', success: false });
      }
    } catch (error) {
      console.error('Error fixing Meta logos:', error);
      setFixStatus({ message: 'Error executing fix', success: false });
    }
  };

  useEffect(() => {
    fetchDebugData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Logo Debug Page</h1>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Logo Tester Tool</h2>
        <LogoTester />
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Tools</h2>
        <div className="flex flex-col space-y-4 mb-4">
          <div>
            <Button 
              onClick={fixMetaLogos}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Fix Meta Logos
            </Button>
            {fixStatus && (
              <div className={`mt-2 p-2 rounded ${
                fixStatus.success ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
              }`}>
                {fixStatus.message}
              </div>
            )}
          </div>
          <div>
            <Button 
              onClick={fetchDebugData}
              variant="outline"
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Completed Interviews</h2>
        {loading ? (
          <p>Loading interview data...</p>
        ) : interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div 
                key={interview.id} 
                className="bg-gray-900 p-4 rounded-lg text-white"
              >
                <div className="flex items-center mb-4">
                  <Image 
                    src={interview.companyLogo} 
                    alt={`${interview.company} logo`} 
                    width={48}
                    height={48}
                    className="rounded-full mr-4"
                    onError={() => {
                      // Handle error in Next.js Image component
                      console.error(`Failed to load logo: ${interview.companyLogo}`);
                    }}
                  />
                  <div>
                    <h3 className="font-bold">{interview.role} at {interview.company}</h3>
                    <p className="text-sm text-gray-400">{new Date(interview.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-3 rounded text-sm">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Company:</span> {interview.company}
                    </div>
                    <div>
                      <span className="text-gray-400">Normalized:</span> {interview.debug?.normalizedCompany}
                    </div>
                    <div>
                      <span className="text-gray-400">Current Logo:</span> {interview.companyLogo}
                    </div>
                    <div>
                      <span className="text-gray-400">Expected Logo:</span> {interview.debug?.expectedLogo}
                    </div>
                    <div className="md:col-span-2">
                      <span className={interview.debug?.isLogoCorrect ? "text-green-500" : "text-red-500"}>
                        {interview.debug?.isLogoCorrect ? "✅ Logo correct" : "❌ Logo mismatch"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No completed interviews found.</p>
        )}
      </div>
    </div>
  );
}
