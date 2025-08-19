'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DisplayTechIcons from './DisplayTechIcons';
import { getCompanyLogo } from '@/lib/utils/companyLogos';

interface CompletedInterviewProps {
  id: string;
  role: string;
  type: string;
  company: string;
  techstack: string[];
  level: string;
  createdAt: string;
  companyLogo: string;
  description: string;
}

export default function CompletedInterviews() {
  const [interviews, setInterviews] = useState<CompletedInterviewProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompletedInterviews() {
      try {
        const response = await fetch('/api/get-completed-interviews');
        if (!response.ok) {
          throw new Error('Failed to fetch completed interviews');
        }
        
        const data = await response.json();
        if (data.success && data.interviews) {
          // Sort by created date to get most recent first
          const sortedInterviews = [...data.interviews].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setInterviews(sortedInterviews);
        } else {
          setInterviews([]);
        }
      } catch (error) {
        console.error('Error fetching completed interviews:', error);
        setError('Failed to load your interviews');
      } finally {
        setLoading(false);
      }
    }

    fetchCompletedInterviews();
  }, []);

  if (loading) {
    return <div className="py-4 text-center">Loading your interviews...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  if (interviews.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500">
        You have not completed any interviews yet. Start an interview to see it here!
      </div>
    );
  }

  return (
    <div className="interview-scroll-container">
      <div className="interview-scroll-wrapper">
        {/* Filter out duplicate interviews based on company, role, level combination */}
        {interviews
          .filter((interview, index, self) => 
            index === self.findIndex((i) => 
              i.company === interview.company && 
              i.role === interview.role && 
              i.level === interview.level
            )
          )
          .map((interview) => (
            <div className="interview-card-container" key={interview.id}>
              <Card className="w-full max-w-sm rounded-xl border-2 border-gray-800 bg-gray-900 text-white shadow-lg transition-all hover:border-blue-500/50">
      <CardHeader className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Image 
            src={interview.company?.toLowerCase() === 'meta' 
              ? '/covers/facebook.png'
              : interview.companyLogo || (interview.company ? getCompanyLogo(interview.company) : '/default-avatar.png')} 
            alt={`${interview.company} logo`} 
            width={50} 
            height={50} 
            className="rounded-full" 
            onError={(e) => {
              const imgElement = e.currentTarget as HTMLImageElement;
              imgElement.src = '/default-avatar.png';
            }}
          />
          <p className="text-sm font-medium text-gray-400">{interview.company}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{interview.role} Interview</CardTitle>
        <p className="mb-4 text-sm text-gray-400 line-clamp-2">{interview.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Image src="/calendar.svg" alt="date" width={16} height={16} />
            <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/star.svg" alt="score" width={16} height={16} />
            <span>---/100</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <DisplayTechIcons techStack={interview.techstack} />
        <Link href={`/interview?presetId=${interview.id}`} passHref>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">Start Interview</Button>
        </Link>
      </CardFooter>
    </Card>
            </div>
          ))}
      </div>
    </div>
  );
}
