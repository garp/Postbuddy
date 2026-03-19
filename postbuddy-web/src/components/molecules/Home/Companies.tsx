import React from 'react';
import iconBG from '@/assets/socialIcons/iconBG.svg';
import Twitter from '@/assets/companies/X.svg';
import Linkedin from '@/assets/companies/linkedin.svg';
import Github from '@/assets/companies/Github.svg';
import Discord from '@/assets/companies/Discord.svg';
import Insta from '@/assets/companies/insta.svg';
import Border from '@/assets/companies/Border.svg';
import Image from 'next/image';

export default function Companies() {
  return (
    <div className='flex flex-col w-full items-center justify-center px-4'>
      <h2 className='text-md w-full max-w-[85%] md:text-xl text-center mb-4'>
        Trusted by the best companies & agencies around the World
      </h2>
      <div className='w-full flex justify-center'>
        <ul className='flex flex-wrap justify-center gap-4 md:gap-8'>
          {[Github, Discord, Twitter, Linkedin, Insta].map((icon, index) => (
            <li
              key={index}
              className='com-icon p-2 md:p-4 relative flex items-center justify-center'
              style={{ backgroundImage: `url(${iconBG})` }}
            >
              <Image src={Border} alt='border' width={80} height={80} className='md:w-[150px] md:h-[150px]' />
              <Image src={icon} alt='icon' width={40} height={40} className='absolute md:w-[80px] md:h-[80px]' />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
