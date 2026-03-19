'use client';
import React, { useState, useRef } from 'react';
import { accordionData } from '@/constants';
import lineBg from '@/assets/Line copy.svg';
import Image from 'next/image';
import { IoIosArrowDown } from 'react-icons/io';

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div
      className="w-full mx-auto my-12 relative items-center justify-center xl:flex xl:flex-col"
      id="faqs"
    >
      <div className="bg-[#AA72FE] h-[200px] w-[400px] blur-[220px] absolute left-0 top-0 flex justify-center items-center"></div>
      <Image className="absolute opacity-80" src={lineBg} alt="" />
      <h1 className="text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>
      <div className="space-y-4 max-w-[1200px] sm:pl-24 relative px-2">
        {accordionData.map((item, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg overflow-hidden sm:w-[90%]"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full flex items-center justify-between px-6 py-4 text-lg font-medium text-left text-white transition-colors`}
            >
              {item.title}
              <span
                className={`transition-transform ${
                  activeIndex === index ? 'rotate-180' : ''
                } duration-500 ease-in-out text-xl`}
              >
                <IoIosArrowDown />
              </span>
            </button>
            <div
              ref={(el) => {
                contentRefs.current[index] = el;
              }}
              className="overflow-hidden transition-[height] duration-500 ease-in-out"
              style={{
                height:
                  activeIndex === index
                    ? contentRefs.current[index]?.scrollHeight + 'px'
                    : '0px',
              }}
            >
              <div className="p-6 text-gray-300">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
