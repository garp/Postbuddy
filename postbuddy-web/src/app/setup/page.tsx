import React from 'react';
import SetupMain from './SetupMain';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Set Up PostBuddy AI | Simple Steps to Get Started',
  description:
    'Easily set up PostBuddy AI in just 3 simple steps. Install the Chrome Extension, choose a plan, and add your API key to start optimizing your social media management.',
  keywords:
    'Set up PostBuddy AI, PostBuddy setup guide, PostBuddy Chrome extension, social media management setup, PostBuddy API key, install PostBuddy, PostBuddy plans, PostBuddy onboarding, easy setup steps',
};

export default function Page() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Setup</title>
      </head>
      <div className='overflow-x-hidden'>
        <SetupMain />
        <Footer />
      </div>
    </>
  );
}
