'use client';

import React from 'react'
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import Image from 'next/image';
import { presetInterviews } from '@/constants/presets';
import PresetInterviewCard from '@/components/PresetInterviewCard';
import CompletedInterviews from '@/components/CompletedInterviews';
import './interview/interview-scroll.css';

const page = () => {

  return (
    <>
    <section className='card-cta'>
      <div className='flex flex-col gap-6 max-w-lg'>
        <h2>Get Interview Ready with AI-Powered Practice & Feedback</h2>
        <p className='text-lg'>
          Practice on real interview questions & get instant feedback
        </p>
        <div className="flex flex-wrap items-center gap-2 md:flex-row">
          <Button asChild className='btn-primary max-sm:full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            className='max-sm:full'
          >
            <Link href="/my-interviews">My Interviews</Link>
          </Button>
        </div>
      </div>
      <Image src="/robot.png" alt="robo_dude" width={400} height={400} className='max-sm:hidden'/>
    </section>
    <section className='flex flex-col gap-6 mt-8'>
      <div className="flex justify-between items-center">
        <h2>Your Interviews</h2>
        <Button asChild variant="outline">
          <Link href="/my-interviews">View All My Interviews</Link>
        </Button>
      </div>
      <CompletedInterviews />
    </section>

    <section className='flex flex-col gap-6 mt-8'>
        <div className="flex justify-between items-center">
            <h2>Take an interview</h2>
            <Button asChild variant="outline">
                <Link href="/preset-interviews">View All Preset Interviews</Link>
            </Button>
        </div>
        <div className='interview-scroll-container'>
          <div className='interview-scroll-wrapper'>
            {presetInterviews.slice(0, 8).map((interview) => (
              <div className="interview-card-container" key={interview.id}>
                <PresetInterviewCard interview={interview} />
              </div>
            ))}
          </div>
        </div>
    </section>
    </>
  )
}

export default page