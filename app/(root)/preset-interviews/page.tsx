import React from 'react';
import { getAllPresetInterviews } from '@/constants/presets';
import PresetInterviewCard from '@/components/PresetInterviewCard';

const PresetInterviewsPage = () => {
  const interviews = getAllPresetInterviews();

  return (
    <section className='flex flex-col gap-6 mt-8'>
      <h2 className='text-3xl font-bold'>All Preset Interviews</h2>
      <div className='interview-scroll-container'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {interviews.map((interview) => (
            <div className="interview-card-container" key={interview.id}>
              <PresetInterviewCard interview={interview} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PresetInterviewsPage;
