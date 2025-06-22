"use client";

import React, { useState, useEffect } from 'react'
import {getTechLogos} from "@/lib/utils";
import Image from "next/image";
import {cn} from "@/lib/utils";

const DisplayTechIcons = ({techStack}: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<Array<{tech: string, url: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTechIcons = async () => {
      try {
        const icons = await getTechLogos(techStack);
        setTechIcons(icons);
      } catch (error) {
        console.error('Failed to load tech icons:', error);
        // Fallback to default tech icon
        setTechIcons(techStack.map(tech => ({ tech, url: '/tech.svg' })));
      } finally {
        setLoading(false);
      }
    };

    loadTechIcons();
  }, [techStack]);

  if (loading) {
    return (
      <div className='flex flex-row'>
        {[1, 2, 3].map((index) => (
          <div key={index} className={cn('relative group bg-dark-300 rounded-full p-2 flex-center', index >= 1 && '-ml-3')}>
            <div className='size-5 bg-gray-400 rounded animate-pulse'></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='flex flex-row'>
      {techIcons.slice(0,3).map(({tech, url}, index) => (
        <div key={tech} className={cn('relative group bg-dark-300 rounded-full p-2 flex-center', index >= 1 && '-ml-3')}>
          <span className='tech-tooltip'>{tech}</span>
          <Image src={url} alt={tech} width={100} height={100} className='size-5'/>
        </div>
      ))}
    </div>
  )
}

export default DisplayTechIcons