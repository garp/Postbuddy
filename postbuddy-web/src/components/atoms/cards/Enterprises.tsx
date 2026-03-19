/* eslint-disable import/no-unresolved */
import React from 'react';
import greentick from '@/assets/tick/ic_outline-done (2).svg';

import Image from 'next/image';

export default function Enterprises({ active, setActive }: any) {
  return (
    <div className="relative">
      <div className="bg-[#1b3344] -top-4 -left-4 h-32 w-28 rounded-full blur-3xl absolute"></div>
      <div className="bg-[#81FFDB]  h-[100px] w-[180px] -bottom-4 -right-4 rounded-full absolute blur-[160px]"></div>
      <div
        onClick={() => setActive(3)}
        className={`cursor-pointer  xl:w-[280px] 2xl:w-[373px] xl:h-[480px] 2xl:h-[540px] border-2 rounded-2xl p-4 card-background ${active === 3 ? 'border-[#b396ff]' : ''}`}
      >
        <h1 className="text-[35px] font-Poppins pl-4">Enterprises</h1>
        <p className="text-[12px] font-Poppins pl-4">
          Unlimited access to all features, billed monthy
        </p>
        <div className="w-[90%] h-[1px] my-2 m-auto bg-white"></div>
        <p className="my-4 gap-1 flex items-center pl-2">
          {/* <span className="xl:text-xl 2xl:text-3xl">&#8377;</span> */}
          <span className="xl:text-xl 2xl:text-2xl cursor-pointer  pl-[20px] gradient-text  hover:underline">
            contact us
          </span>
        </p>
        <div className="flex flex-col justify-between h-full text-xs 2xl:text-[16px]">
          <ul>
            <li className="flex items-center gap-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              6 Free Comments / Day
            </li>
            <li className="flex items-center leading-7 gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Supported on all social Media Platform
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Limited Customisation Options
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Chat Support
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              AI Personalities
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Gamifications & Leaderboard
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Custom Actions
            </li>
            <li className="flex items-center gap-4 my-4 pl-4">
              <span>
                <Image src={greentick} alt="" width={20} />
              </span>
              Full Customisation Suite
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
