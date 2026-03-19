'use client';
// import React, { useState } from 'react'
import Title from '../../atoms/Title';
import Demo from './Demo';
// import Banner from './Banner'

export default function Hero() {
  // const [show, setShow] = useState(false)

  return (
    <div className="mt-24">
      <Title />
      <div className="relative">
        {/* <div onClick={() => setShow(!show)} className="flex items-center justify-center w-full">
          <Banner />
        </div> */}
        <div>
          <Demo />
        </div>
      </div>
    </div>
  );
}
