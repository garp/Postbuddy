/* eslint-disable import/no-unresolved */
import Image from 'next/image';
import React from 'react';
import whitegrid from '@/assets/Vector.svg';
import GetLifeTimeAccess from '@/components/atoms/buttons/GetLifeTimeAccess';
import TryForFree from '@/components/atoms/buttons/TryForFree';
// import vector1 from '@/assets/Vector (Stroke).svg';
// import vector2 from '@/assets/Vector 2 (Stroke).svg';

export default function Description() {
  return (
    <div className="h-[450px] lg:h-[650px] mt-[50px] description relative">
      <div className="relative">
        {/* <div className="absolute top-[75px] lg:top-auto">
          <Image className="flex z-100 opacity-80" src={vector1} width={1400} alt="" />
        </div> */}
        <div className="pt-[25px] lg:absolute w-full top-48 gap-10 flex flex-col items-center z-[999]">
          <div className="flex flex-col items-center md:leading-[64px]">
            <h1 className="text-[26px] md:text-[58px] font-Poppins text-center">
              Boost your productivity.
            </h1>
            <p className="text-[26px] md:text-[58px] font-Poppins text-center">
              Start using{' '}
              <span className="gradient-text font-medium "> PostBuddy </span>
              today.
            </p>
          </div>
          <div className="w-full">
            <p className="text-center text-[12px] md:text-[24px] md:w-[1090px] m-auto px-4">
              Postbuddy uses AI to improve your Social Media Engagement. What
              previously took hours, now takes seconds. Postbuddy is your Social
              Media Sidekick in your browser.
            </p>
          </div>
          <div className="flex md:flex-row flex-col gap-8 justify-center items-center relative">
            <TryForFree />
            <GetLifeTimeAccess />
          </div>
        </div>
      </div>
      {/* <div className="absolute top-[100px] lg:bottom-auto">
        <Image className="flex z-100" src={vector2} width={1400} alt="" />
      </div> */}
      <div className="flex justify-center relative">
        <Image className="opacity-10 absolute " src={whitegrid} alt="" />
      </div>
    </div>
  );
}
