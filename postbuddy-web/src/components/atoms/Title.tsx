/* eslint-disable import/no-unresolved */
import Image from 'next/image';
import React from 'react';
import vector from '@/assets/Vector (Stroke).svg';
import vector2 from '@/assets/Vector 2 (Stroke).svg';
import TryForFree from './buttons/TryForFree';
import GetLifeTimeAccess from './buttons/GetLifeTimeAccess';

export default function Title() {
  return (
    <div className="relative h-[300px] md:h-[500px]">
      <div className="flex flex-col my-8 gap-4 relative">
        <h1 className="text-xl md:text-6xl font-medium flex m-auto w-[80%] md:w-[50%] text-center text-white">
          Supercharge Your Social Engagement in Seconds with
        </h1>
        <h2 className="gradient-text text-xl md:text-6xl text-center m-auto font-bold font-Poppins my-4">
          Post Buddy Ai
        </h2>
      </div>
      <div className="top-8 -left-4 rotate-[2deg] absolute lg:top-16 lg:-left-8">
        <Image
          className="select-none opacity-[80%] "
          src={vector}
          width={1400}
          alt=""
        />
      </div>
      <div className="absolute top-12 -right-4 rotate-[2deg] lg:top-20 lg:-right-24">
        <Image
          className="select-none opacity-1"
          src={vector2}
          width={1400}
          alt=""
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center relative">
        <TryForFree />
        <GetLifeTimeAccess />
      </div>
      <div className='relative flex justify-center'>
        <div className="flex justify-center top-12 absolute">
          <div className="h-24 w-[500px] bg-[#8949ff] hero-bg-blur rounded-full mt-12 "></div>
        </div>
      </div>
    </div>
  );
}
