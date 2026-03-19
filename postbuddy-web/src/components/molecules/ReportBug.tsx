import React from 'react';
import ContactUs from './ContactUs';

export default function ReportBug() {
  return (
    <div>
      <div className="bg-[#AA72FE] h-[200px] w-[300px] blur-[300px] absolute left-0 top-0"></div>
      <div className="bg-[#00312b] h-[200px] w-[200px] blur-[160px] absolute right-0 bottom-0"></div>

      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="gradient-text text-4xl font-bold text-center text-[#d06eff] mb-4">
          Report a Bug
        </p>
        <p className="text-center text-xs md:text-md lg:text-lg xl:text-xl text-white max-w-xl mb-8">
          Help us get better by reporting any bugs or issues you encounter. Your
          feedback makes a difference!
        </p>

        <ContactUs />
      </div>
    </div>
  );
}
