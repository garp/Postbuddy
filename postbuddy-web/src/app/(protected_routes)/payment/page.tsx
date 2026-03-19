"use client";

import React from "react";
import PaymentSuccess from "@/components/molecules/Payment/PaymentSuccess";
import PaymentFailure from "@/components/molecules/Payment/PaymentFailure";
import { usePaymentStatusQuery } from "@/redux/api/services/payment";
import SpinLoader from "@/components/atoms/SpinLoader";
import Head from "next/head";

import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const { data, isLoading } = usePaymentStatusQuery({ gatewayPaymentId: paymentId });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>PostBuddy AI - Payment</title>
        </Head>
        <div className="bg-[#110f1b] min-h-screen flex items-center justify-center w-screen font-Poppins px-6">
          <div className="bg-[#f6f6f6] max-w-md w-full rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Checking Payment Status, Please Wait...</h1>
            <SpinLoader />
          </div>
        </div>
      </>
    );
  }

  const transactionDetails = data?.data;
  if (transactionDetails?.status === "success") {
    return <PaymentSuccess transactionDetails={transactionDetails} checkingStatus={isLoading} />;
  } else {
    return <PaymentFailure />;
  }
}
