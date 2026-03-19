'use client';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useGetReleaseNotesDataQuery } from '@/redux/api/services/dashboard';

export default function ReleaseNotes() {
  const { data: Notes } = useGetReleaseNotesDataQuery({});

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-12 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-purple-400">
        Release <span className="text-pink-400">Notes</span>
      </h1>
      <p className="text-gray-400 text-sm md:text-base mb-8 text-center">
        Stay up-to-date with the latest features and improvements in our
        product.
      </p>

      {/* What's New Section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-300">
        + What&apos;s New
      </h2>

      {Notes?.data?.map((note: any, index: number) => (
        <div key={index} className="mb-8">
          <div className="flex flex-wrap items-center mb-2">
            <FaCheckCircle className="text-green-400 mr-2" />
            <span className="text-xs md:text-sm text-gray-400 bg-[#1c1a29] px-3 py-1 rounded-md">
              V {note.version}
            </span>
            <span className="ml-4 text-gray-300 text-xs md:text-sm">
              {note.date}
            </span>
          </div>
          <div className="ml-2 md:ml-4">
            <h3 className="text-base md:text-lg font-semibold mb-1 text-purple-200">
              {note.title}
            </h3>
            {note.features.map((feature: any, index: number) => (
              <div key={index} className="mb-2">
                <span className="text-gray-300 text-sm md:text-base">
                  {'->'} {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
