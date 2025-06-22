"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DisplayTechIcons from './DisplayTechIcons';
import { type PresetInterview } from '@/constants/presets';
import Link from 'next/link';

const PresetInterviewCard = ({ interview }: { interview: PresetInterview }) => {
  return (
    <Card className="w-full max-w-sm rounded-xl border-2 border-gray-800 bg-gray-900 text-white shadow-lg transition-all hover:border-blue-500/50">
      <CardHeader className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Image 
            src={interview.companyLogo} 
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
        <CardTitle className="mb-2 text-xl font-bold">
          {interview.role} Interview
        </CardTitle>
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
    
  );
};

export default PresetInterviewCard;