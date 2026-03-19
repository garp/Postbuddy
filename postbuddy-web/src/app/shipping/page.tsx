import React from 'react';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Shipping and Delivery Policy | PostBuddy AI',
  description:
    'Learn about PostBuddy AI’s shipping and delivery policy, including service access details, delivery timelines, and support for seamless onboarding.',
  keywords:
    'PostBuddy AI shipping policy, delivery policy, service access PostBuddy, PostBuddy delivery timeline, PostBuddy login credentials, delivery confirmation, PostBuddy technical support, onboarding support',
};

function ShippingCancellationPage() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Shipping</title>
      </head>
      <div>
        <div className="bg-[#110f1b] h-full pt-4 text-white relative">
          <Navbar />
          {/* Gradient Background Effect */}
          <div className="bg-[#AA72FE] h-[200px] w-[400px] blur-[300px] absolute left-0 top-[40%]"></div>
          <div className="bg-[#00312b] h-[200px] w-[400px] blur-[220px] absolute right-0 top-[40%]"></div>

          <div className="max-w-4xl mx-auto mt-12 pb-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
              Shipping and Delivery Policy
            </h1>
            <p className="text-gray-400 text-sm mb-8 text-start">
              Last updated: January 2025
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Access and Delivery Policy
              </h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Thank you for choosing Postbuddy.ai! We aim to provide you with a
                seamless experience. Below are the details of our service access
                and delivery process:
              </p>

              <h3 className="text-xl font-semibold mb-2 text-purple-200">
                Service Access:
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Postbuddy.ai is an online service delivered through email. Once
                your payment is confirmed, you will receive an email with login
                credentials and instructions to access the service.
              </p>

              <h3 className="text-xl font-semibold mb-2 text-purple-200">
                Delivery Timeline:
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Access credentials are typically delivered within 1-2 business
                hours. Orders placed outside business hours will be processed on
                the next business day.
              </p>

              <h3 className="text-xl font-semibold mb-2 text-purple-200">
                Access Confirmation:
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                You will receive a confirmation email with all necessary details
                to start using Postbuddy.ai. Please check your spam/junk folder if
                you do not receive the email within the specified timeframe.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Technical Support
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-purple-200">
                Assistance with Access:
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you face any issues accessing the service, please reach out to
                our support team immediately.
              </p>

              <h3 className="text-xl font-semibold mb-2 text-purple-200">
                Contact Us:
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Email: support@postbuddy.ai
                <br />
                Phone: +91-XXXXXXXXXX
              </p>
            </div>

            <p className="mt-8 text-center text-purple-400 font-semibold">
              Thank you for choosing Postbuddy.ai!
            </p>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default ShippingCancellationPage;
