'use client';
import Navbar from '@/components/molecules/Home/Navbar';
import { Button } from '@mantine/core';
import React from 'react';
import LoginImage from '@/assets/login-page.png';
import Logo from '@/assets/postbuddy-logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="bg-[#120f1c] overflow-y-hidden md:h-full min-h-screen">
      <Navbar />

      <div className="flex items-center justify-center flex-col h-[80vh]">
        <div className="bg-[#1a142c] p-8 flex flex-col items-center rounded-[3px]">
          <h3 className='text-3xl font-semibold font-Poppins'>404 Page not found</h3>
          <div className="my-4 h-[1px] w-full bg-[#11101d]"></div>
          <Button 
            color="#120f1c" 
            onClick={() => router.push('/')}
          >
            Take me Home
          </Button>
          <div className="relative flex flex-col mt-4 items-center justify-center">
            {/* Background Image */}
            <Image
              src={LoginImage}
              alt="/"
              width={350}
              height={350}
              className="opacity-70 lg:w-[260px] 2xl:w-[300px]"
            />
            {/* Overlay Content */}
            <div className="absolute flex flex-col items-center text-center">
              {/* Logo */}
              <Image
                src={Logo}
                alt="Post Buddy AI Logo"
                width={120} // Adjust size as needed
                height={120}
                className="mb-4 animate-bounce"
              />
              {/* Text */}
              <p className="text-white text-md lg:text-lg md:text-3xl font-semibold leading-snug w-[80%]">
                Supercharge Your Social Engagement in Seconds with
              </p>
              <p className="gradient-text text-xl xl:text-3xl font-semibold">
                Post Buddy AI
              </p>
            </div>
          </div>

          <div className="bg-[#45296b] h-[200px] w-[200px] blur-[100px] absolute left-0 bottom-[10%]"></div>
          <div className="bg-[#00312b] h-[200px] w-[200px] blur-[200px] absolute right-0 top-[10%]"></div>
        </div>
      </div>
    </div>
  );
}
