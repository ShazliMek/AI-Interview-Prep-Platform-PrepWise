'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IVoiceRecording } from '@/lib/models/mongodb-schemas';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MyInterviewsPage = () => {
  const { data, error, isLoading } = useSWR('/api/get-saved-interviews', fetcher);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">My Saved Interviews</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-300 rounded w-28"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">My Saved Interviews</h2>
        <p className="text-red-500">Failed to load interviews. Please try again later.</p>
      </div>
    );
  }

  const interviews: IVoiceRecording[] = data?.interviews || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Saved Interviews</h2>
      {interviews.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">You have no saved interviews yet.</p>
          <Link href="/interview" passHref>
            <Button className="mt-4">Start a New Interview</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => (
            <Card key={interview._id as string}>
              <CardHeader>
                <CardTitle>{interview.interviewRole}</CardTitle>
                <CardDescription>
                  {formatDate(interview.createdAt as unknown as string)} - {interview.interviewType === 'preset' ? 'Preset' : 'Custom'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Duration: {formatTime(interview.rec_length)}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/interview-analysis?interviewId=${interview.interviewId}`} passHref>
                  <Button>View Analysis</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInterviewsPage;
