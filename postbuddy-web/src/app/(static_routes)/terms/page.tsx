import React from 'react';
import { terms } from '@/constants/terms';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Terms of Service | PostBuddy AI',
  description:
    'Review the Terms of Service for PostBuddy AI. Understand the terms and conditions for using our platform and services.',
  keywords:
    'PostBuddy AI Terms of Service, PostBuddy terms, service agreement, terms and conditions, PostBuddy platform, PostBuddy policies, user agreement, legal terms, PostBuddy usage guidelines',
};

function TermsPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Terms & Conditions</title>
      </head>
      <div>
        <div className="bg-[#110f1b] h-full pt-4 text-white relative">
          <Navbar />
          {/* Gradient Background Effect */}
          <div className="bg-[#AA72FE] h-[200px] w-[400px] blur-[300px] absolute left-0 top-[40%]"></div>
          <div className="bg-[#00312b] h-[200px] w-[400px] blur-[220px] absolute right-0 top-[40%]"></div>

          <div className="max-w-4xl mx-auto mt-12">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
              Terms of Service
            </h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Last updated: {terms.lastUpdated}
            </p>

            <p className="mb-6 text-gray-300">
              Subject to these Terms of Service (this &quot;Agreement&quot;),
              PostBudddy.ai (&quot;PostBudddy&quot;, &quot;we&quot;,
              &quot;us&quot;, and/or &quot;our&quot;) provides access to
              PostBudddy&apos;s cloud platform as a service (collectively, the
              &quot;Services&quot;). By using or accessing the Services, you
              acknowledge that you have read, understand, and agree to be bound by
              this Agreement. If you are entering into this Agreement on behalf of
              a company, business, or other legal entity, you represent that you
              have the authority to bind such entity to this Agreement, in which
              case the term &quot;you&quot; shall refer to such entity. If you do
              not have such authority, or if you do not agree with this Agreement,
              you must not accept this Agreement and may not use the Services.
            </p>

            {terms?.sections.map((item, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                  {item.title}
                </h2>
                <p className="text-gray-300 leading-relaxed">{item.content}</p>
              </div>
            ))}

            <p className="mt-8 text-center text-purple-400 font-semibold pb-8">
              Thank you for choosing PostBuddy!
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TermsPage;
