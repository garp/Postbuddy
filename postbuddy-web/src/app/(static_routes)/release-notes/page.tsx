import React from 'react';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';
import ReleaseNotes from '@/components/molecules/ReleaseNotes';

export const metadata = {
  title: 'Release Notes | PostBuddy AI',
  description:
    'Stay informed about the latest updates, features, and improvements in PostBuddy AI. Check out our Release Notes to see how we’re enhancing your social media experience.',
  keywords:
    'Release Notes, PostBuddy AI updates, new features, product improvements, PostBuddy enhancements, latest updates, social media tools updates, PostBuddy release information, version updates',
};

function ReleaseNotesPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Release Notes</title>
      </head>
      <div>
        <div className="bg-[#110f1b] pt-4 text-white relative">
          <Navbar />
          <ReleaseNotes />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ReleaseNotesPage;
