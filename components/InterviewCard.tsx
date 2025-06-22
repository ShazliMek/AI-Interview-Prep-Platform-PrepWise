import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs';
import StandardInterviewCard from './StandardInterviewCard';

interface InterviewCardProps {
  interviewId: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

interface Feedback {
  finalAssessment?: string;
  totalScore?: number;
  createdAt?: string;
}

const InterviewCard = ({interviewId, role, type, techstack, createdAt}: InterviewCardProps) => {
    const feedback = null as Feedback | null;
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');
    
    return (
      <StandardInterviewCard
        id={interviewId}
        title={role}
        description={feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
        companyLogo={getRandomInterviewCover()}
        type={normalizedType}
        techstack={techstack}
        createdAt={formattedDate}
        buttonText={feedback ? 'Check Feedback' : 'Start Interview'}
        buttonLink={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}
        score={feedback?.totalScore || '---/100'}
      />
    );
}

export default InterviewCard