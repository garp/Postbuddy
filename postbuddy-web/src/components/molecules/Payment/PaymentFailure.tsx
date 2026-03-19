"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function PaymentFailure() {
  const router = useRouter();

  const handleContactClick = () => {
    router.push("/contactus");
  };

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>PostBuddy AI - Payment Failure</title>
      </Head>
      <div className="bg-[#110f1b] min-h-screen flex items-center justify-center w-screen font-Poppins px-6">
        <div className="bg-[#f6f6f6] max-w-md w-full rounded-lg shadow-lg p-8">
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Image src={"https://postbuddy.ai/favicon.ico"} alt="logo" width={50} height={50} />
              <div>
                <h3 className="font-semibold text-gray-800">PostBuddy AI</h3>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "2-digit" }).replace(/(\d+)\s+(\w+),\s+(\d+)/, "$1-$2, $3")}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-40 h-40">
              <DotLottieReact
                src="https://lottie.host/f68ada5a-1af5-4d5b-b4cd-fc9f1027dd32/iX7hux6Qpe.lottie"
                // loop
                autoplay
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your payment failed to process</h2>
            <p className="text-gray-500 text-sm mb-4">
              There was an issue processing your payment. Please check your payment details and try again or use a different payment method.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactClick}
                className="px-6 py-2 text-[#5c34aa] border border-[#5c34aa] rounded-md hover:bg-[#5c34aa] hover:text-white transition-colors"
              >
                Contact Us
              </button>
              <button
                onClick={handleDashboardClick}
                className="px-6 py-2 bg-[#5c34aa] text-white rounded-md hover:bg-[#4a2b88] transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
