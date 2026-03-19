'use client';
import Navbar from '@/components/molecules/Home/Navbar';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import { RiArrowDropRightLine } from 'react-icons/ri';

const SetupMain = () => {
  const [check, setCheck] = useState([0, 0, 0]);

  const handleCheck = (i: any) => {
    const newCheck = [...check];
    newCheck[i] = 1;
    setCheck(newCheck);
  };
  return (
    <div className="bg-[#110f1b] h-full min-h-screen pb-12 relative text-white pt-2">
      <Navbar />
      <div className="bg-[#AA72FE] h-[200px] w-[400px] blur-[300px] absolute left-0 top-0"></div>
      <div className="bg-[#00312b] h-[200px] w-[200px] blur-[160px] absolute right-0 bottom-0"></div>

      <div className="max-w-4xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold mb-6 text-center text-purple-400">
          Set Up Postbuddy in 3 Simple Steps
        </h3>
        <ul className="flex flex-col gap-4">
          {[
            'Install Postbuddy Chrome Extension',
            'Choose a Plan and Add API Key',
            'Refresh Chrome',
          ].map((step, index) => (
            <li
              key={index}
              className="border-[1px] border-[#d0a2fe] rounded-lg p-6 sm:p-8 gap-6 sm:gap-8"
            >
              <h3 className="flex items-center gap-4 text-xl sm:text-2xl">
                {check[index] ? (
                  <span className="text-green-500">
                    <IoCheckmarkDoneCircleSharp />
                  </span>
                ) : (
                  ''
                )}
                {step}
              </h3>
              <div className="flex flex-col items-center mt-4">
                {index === 0 && (
                  <a
                    href="https://chromewebstore.google.com/detail/postbuddy/ffiheeeepmiobmpefjencmcmfeokkkhm?hl=en-US&utm_source=ext_sidebar"
                    target="_blank"
                    className="w-full sm:w-auto text-center bg-[#1c1a29] px-4 sm:px-8 py-3 sm:py-4 my-4 rounded-md hover:bg-purple-600 transition"
                  >
                    Install Extension
                  </a>
                )}
                {check[0] && index !== 2 && index !== 0 ? (
                  <>
                    <Link
                      href={'/plans'}
                      className="w-full sm:w-auto text-center bg-[#1c1a29] px-12 sm:px-12 py-3 sm:py-4 my-4 rounded-md hover:bg-purple-600 transition"
                    >
                      View Plans
                    </Link>
                  </>
                ) : (
                  ''
                )}
                {!check[index] && (index === 0 || check[index - 1]) ? (
                  <button
                    className="w-full sm:w-auto text-center bg-[#1c1a29] px-6 sm:px-10 gap-2 py-3 sm:py-4 flex items-center justify-center rounded-md hover:bg-purple-500 transition"
                    onClick={() => handleCheck(index)}
                  >
                    {index < 2 ? (
                      <>
                        Next Step
                        <span className="text-xl">
                          <RiArrowDropRightLine />
                        </span>
                      </>
                    ) : (
                      'All Set'
                    )}
                  </button>
                ) : (
                  ''
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SetupMain;
