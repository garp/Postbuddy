import React from 'react';
import Navbar from '@/components/molecules/Home/Navbar';
import { refundPolicy } from '@/constants';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Refund Policy | PostBuddy AI',
  description:
    'Understand PostBuddy AI’s Refund Policy, including our free trial terms, no-refund policy, and why we maintain this approach to provide high-quality services.',
  keywords:
    'PostBuddy AI refund policy, free trial PostBuddy, no refunds policy, PostBuddy free trial, refund terms, PostBuddy support, no refund explanation',
};

function RefundPolicyPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Refund</title>
      </head>
      <div>
        <div className="bg-[#110f1b] h-full pt-4 text-white relatifve pb-8">
          <Navbar />
          <div className="max-w-4xl mx-auto mt-12">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
              {refundPolicy.title}
            </h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              {refundPolicy.content[0].description}
            </p>

            {refundPolicy.content.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                  {section.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {section.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default RefundPolicyPage;
