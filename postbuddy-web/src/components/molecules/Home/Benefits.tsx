import Image from 'next/image';
import React from 'react';
import graphIcon from '@/assets/benefits/Group.svg';
import starIcon from '@/assets/benefits/engagement.svg';
import botIcon from '@/assets/benefits/fluent_bot-sparkle-24-regular (1).svg';
import cloudIcon from '@/assets/benefits/hugeicons_ai-brain-04.svg';
import grid from '@/assets/Vector.svg';

export default function Benefits() {
  const benefits = [
    {
      icon: cloudIcon,
      title: 'Time Efficiency',
      description:
        'Allows users to set tone, style, and length preferences (e.g. professional, casual, humorous) tailored for specific audiences.',
    },
    {
      icon: botIcon,
      title: 'Consistency',
      description:
        'Generates captions optimized for each social media platform (e.g., Instagram hashtags, LinkedIn formality, TikTok trends).',
    },
    {
      icon: botIcon,
      title: 'Improved Decision Making',
      description:
        'Helps create captions optimized for decision-making based on platform trends and engagement.',
    },
    {
      icon: graphIcon,
      title: 'Improved Customization',
      description:
        'Allows advanced customization for creating unique, targeted, and appealing content.',
    },
    {
      icon: starIcon,
      title: 'Enhanced Engagement',
      description:
        'Offers batch processing for bulk caption and description creation in seconds.',
    },
    {
      icon: graphIcon,
      title: 'Improved Content Reach',
      description:
        'Incorporates trending hashtags, phrases, and styles in real-time to increase visibility and engagement.',
    },
    
  ];

  return (
    <div className="py-16 text-white relative sm:h-[625px]">
      <Image
        className="absolute left-[50%] -translate-x-[50%] opacity-10 -top-12"
        src={grid}
        alt=""
        width={1200}
      />
      <div className="w-full flex flex-col mx-auto relative lg:px-[25px] 2xl:flex 2xl:px-[200px] 2xl:items-center 2xl:justify-center">
        <h1 className="text-[28px] sm:text-[40px] font-Poppins font-semibold text-center mb-12">
          Benefits of <span className="gradient-text">PostBuddy</span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full m-auto justify-center items-center relative">
        <div className="bg-[#aa72fe] w-[184px] h-[230px] blur-[160px] absolute left-[50%] -translate-x-[50%]"></div>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-center gap-4 sm:items-start text-center p-6 rounded-xl transition-all"
            >
              <Image
              className='p-1'
                src={benefit.icon}
                alt={benefit.title}
              />
              <div className="flex flex-col text-start">
                <h2 className="text-lg sm:text-xl font-bold mb-2">{benefit.title}</h2>
                <p className="text-[10px] sm:text-sm w-[80%]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
