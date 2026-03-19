import FeatureRequest from '@/components/molecules/FeatureRequest';
import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';
import React from 'react';

export default function page() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Feature Request</title>
      </head>
      <div className="bg-[#110f1b] pt-4 text-white relative">
        <Navbar />
        <FeatureRequest />
        <Footer />
      </div>
    </>
  );
}
