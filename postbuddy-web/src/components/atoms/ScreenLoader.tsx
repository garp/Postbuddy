import { Loader } from '@mantine/core';
import React from 'react';

export default function ScreenLoader() {
  return (
    <div className="bg-[#1a1830] flex overflow-y-hidden md:h-full min-h-screen justify-center items-center">
      <Loader color="white" size={'lg'} />
    </div>
  );
}
