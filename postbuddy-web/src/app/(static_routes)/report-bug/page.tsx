import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';
import ReportBug from '@/components/molecules/ReportBug';
import React from 'react';

export default function page() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Report Bugs</title>
      </head>
      <div className="bg-[#110f1b] pt-4 text-white relative">
        <Navbar />
        <ReportBug />
        <Footer />
      </div>
    </>
  );
}
