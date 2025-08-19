'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DisplayTechIcons from './DisplayTechIcons';
import Link from 'next/link';
import { getCompanyLogo } from '@/lib/utils/companyLogos';

interface StandardInterviewCardProps {
  title: string;
  description: string;
  company?: string;
  companyLogo?: string;
  type?: string;
  techstack: string[];
  createdAt: string;
  buttonText: string;
  buttonLink: string;
  score?: string | number;
}

const StandardInterviewCard = ({
  title,
  description,
  company,
  companyLogo,
  techstack,
  createdAt,
  buttonText,
  buttonLink,
  score = '---/100'
}: StandardInterviewCardProps) => {
  
  // Get logo based on company or use default
  const logoSrc = company?.toLowerCase() === 'meta' 
    ? '/covers/facebook.png'
    : companyLogo || (company ? getCompanyLogo(company) : '/default-avatar.png');
    
  return (
    <Card className="w-full max-w-sm rounded-xl border-2 border-gray-800 bg-gray-900 text-white shadow-lg transition-all hover:border-blue-500/50">
      <CardHeader className="flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-2">
          <Image src={logoSrc} alt={`${company ?? 'Company'} logo`} width={50} height={50} className="rounded-full" />
          <p className="text-sm font-medium text-gray-400">{company}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 text-xl font-bold">{title} Interview</CardTitle>
        <p className="mb-4 text-sm text-gray-400 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <Image src="/calendar.svg" alt="date" width={16} height={16} />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/star.svg" alt="score" width={16} height={16} />
            <span>{score}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <DisplayTechIcons techStack={techstack} />
        <Link href={buttonLink} passHref>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StandardInterviewCard;
