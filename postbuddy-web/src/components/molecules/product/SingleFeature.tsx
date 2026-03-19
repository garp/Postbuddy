import React from 'react';
import Image from 'next/image';

import { FiDollarSign } from 'react-icons/fi';
import { LuSmile } from 'react-icons/lu';
import { TiWeatherWindyCloudy } from 'react-icons/ti';

import featuresImg2 from '@/assets/features/cross.png';

const SingleFeature = () => {
  return (
    <div className="bg-[#110f1b]">
      <div className="flex flex-col md:flex-row gap-5 items-center justify-center mt-12">
        <div className="flex flex-col w-full md:w-[60%]">
          {/* Section Title */}
          <div className="text-left mb-8">
            <h1 className="text-[30px] font-bold text-white mb-4">
              Flexibly choose between local and popular AI Models of your
              choice.
            </h1>
            <p className="text-[18px] text-white">
              We support local models powered by Ollama, and vendors like
              OpenAI, Claude, Gemini, Straico, OpenRouter, and more.
            </p>
          </div>

          {/* Highlights */}
          <div className="flex flex-col gap-6 text-white px-4">
            {/* Highlight 1 */}
            <div className="flex items-start gap-2">
              <FiDollarSign className="text-[#5f40ab] text-[20px] mt-1" />
              <div>
                <h3 className="text-[20px] font-semibold text-white">
                  Free forever LLM Integration
                </h3>
                <p className="text-[#a79797] text-[15px]">
                  You can integrate Postbuddy with the latest models like Llama
                  3.1, 3, 2, Gemma 2 and more via Ollama.
                </p>
              </div>
            </div>
            {/* Highlight 2 */}
            <div className="flex items-start gap-2">
              <LuSmile className="text-[#5f40ab] text-[20px] mt-1" />

              <div>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  Choose from Paid vendors
                </h3>
                <p className="text-[#a79797] text-[15px]">
                  Choose from GPT-3.5, 4o, o1, or Claude 3.5 Sonnet, or Gemini
                  1.5 or Straico or OpenRouter.
                </p>
              </div>
            </div>
            {/* Highlight 3 */}
            <div className="flex items-start gap-2">
              <TiWeatherWindyCloudy className="text-[#5f40ab] text-[20px] mt-1" />{' '}
              <div>
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                  Extensive guides & videos
                </h3>
                <p className="text-[#a79797] text-[15px]">
                  We have extensive guides and docs to help you through the
                  integration and updates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Section */}
        <div className="w-full md:w-[40%] border-[1px] border-gray-200 rounded-[8px] overflow-hidden p-5">
          <Image
            src={featuresImg2}
            alt="AI Vendors Dropdown"
            width={900}
            height={900}
            className="rounded-[8px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleFeature;
