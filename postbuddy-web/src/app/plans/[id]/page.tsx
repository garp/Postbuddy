'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For navigation

export default function Success() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); 
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, countdown * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [countdown, router]); 

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-lg font-semibold text-green-500 mb-4">
        Your transaction is successful!
      </p>
      <p className="text-gray-600">
        You will be redirected to the homepage in <span className="font-bold">{countdown}</span> seconds...
      </p>
    </div>
  );
}
