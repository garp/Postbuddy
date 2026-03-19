"use client";

import React from "react";
import Image from "next/image";
import SpinLoader from "@/components/atoms/SpinLoader";
import PaymentTransactionDetails from "@/components/molecules/Payment/PaymentTransactionDetails";
import Head from "next/head";

export default function PaymentSuccess({ transactionDetails, checkingStatus }: any) {
  return (
    <>
      <Head>
        <title>PostBuddy AI - Payment Success</title>
      </Head>
      <div className="bg-[#110f1b] min-h-screen flex items-center justify-center w-screen font-Poppins px-6">
        <div className="bg-[#f6f6f6] max-w-md w-full rounded-lg shadow-lg p-8">
          {checkingStatus ? (
            <div className="flex flex-col justify-center items-center">
              <Image src={"https://postbuddy.ai/favicon.ico"} alt="logo" width={100} height={100} />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Checking Payment Status</h2>
              <SpinLoader />
            </div>
          ) : (
            <>
              <PaymentTransactionDetails transactionDetails={transactionDetails} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
