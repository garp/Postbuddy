'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";

export default function PaymentTransactionDetails({ transactionDetails }: any) {
  const { createdAt, amount, currency, SubscriptionDetails, PlanDetails } = transactionDetails;
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push("/dashboard?tab=configuration");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, router]);
  return (
    <div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <Image src={"https://postbuddy.ai/favicon.ico"} alt="logo" width={50} height={50} />
          <div>
            <h3 className="font-semibold text-gray-800">PostBuddy AI</h3>
            <p className="text-sm text-gray-500">{createdAt ? new Date(createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }) : ""}</p>
          </div>
          <div className="ml-auto">
            <p className="font-bold text-gray-800">{currency === "INR" ? "₹" : "$"}{amount / 100}</p>
          </div>
        </div>

      </div>
      <div className="flex justify-center mb-6">
        <div className="w-40 h-40">
          <DotLottieReact
            src="https://lottie.host/c66cc2ab-52eb-44e5-8073-f20b6c771325/zoKz5FSNkJ.lottie"
            autoplay
          />
        </div>
      </div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your payment was successfully processed</h2>
      </div>

      <div className="mt-4">
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td className="py-2 text-gray-500">Plan:</td>
              <td className="py-2 font-semibold text-right text-gray-800">{PlanDetails?.name}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Payment ID:</td>
              <td className="py-2 font-semibold text-right text-gray-800">{transactionDetails?.gatewayPaymentId}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-2 text-gray-500">Subscription ID:</td>
              <td className="py-2 font-semibold text-right text-gray-800">{SubscriptionDetails?.gatewaySubscriptionId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-6 text-gray-500 text-center">
        Redirecting to the dashboard in <span className="font-bold text-[#5c34aa]">{timeLeft}</span> seconds...
      </div>
    </div>
  );
}

