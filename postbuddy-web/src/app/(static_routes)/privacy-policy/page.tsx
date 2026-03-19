import React from 'react';
import { privacyPolicy } from '@/constants/privacyPolicy';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Privacy Policy | PostBuddy AI',
  description:
    'Learn about how PostBuddy AI handles your data with transparency and security. Our Privacy Policy outlines our commitment to protecting your personal information and ensuring your trust.',
  keywords:
    'Privacy Policy, PostBuddy AI Privacy, data protection, personal information security, PostBuddy data handling, privacy practices, user data security, data transparency, PostBuddy terms, user trust',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Privacy Policy</title>
      </head>
      <div className="bg-[#110f1b] pt-4">
        <Navbar />
        <div className="min-h-screen text-white relative py-4">
          {/* Gradient Background */}
          <div className="bg-[#AA72Ff] h-[200px] w-[400px] blur-[420px] absolute left-0 top-[40%]"></div>
          <div className="bg-[#00312b] h-[200px] w-[400px] blur-[220px] absolute right-0 top-[40%]"></div>

          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-sm mb-8 text-start">
              Last updated: {privacyPolicy.lastUpdated}
            </p>

            <ul className="list-decimal pl-6 space-y-8">
              {privacyPolicy?.sections.map((item, index) => (
                <li key={index} className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{item.content}</p>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-purple-400 font-semibold">
              Thank you for choosing PostBuddy!
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
