'use client';
import Script from 'next/script';
import { getAuth } from '@/utils/helper';
import { useParams } from 'next/navigation';
import { useCheckoutMutation } from '../../../../redux/api/services/payment';
import { useGetPlanQuery } from '@/redux/api/services/plansApi';
import Card from '@/components/molecules/plans/card';
import Navbar from '@/components/molecules/Home/Navbar';
import toast from 'react-hot-toast';

export default function SubscriptionId() {
  const params = useParams();
  const { id } = params;
  const { email, fullName } = getAuth() || {};

  const { data, error, isLoading } = useGetPlanQuery(id);
  const [checkout, { isLoading: checkoutLoader }] = useCheckoutMutation();

  const handlePayment = async () => {
    if(!email && !fullName) {
      toast.error('Please login to proceed')
      return;
    }
    const res = await checkout({ planId: id });
    let SubscriptionId = res?.data?.data;
    let options = {};
    if (SubscriptionId.entity === 'order') {
      if (!res?.data?.data?.id) {
        console.error('Order ID is missing for lifetime plan');
        return;
      }
      options = {
        key: process.env.NEXT_PUBLIC_RAYZOR_KEY,
        amount: res?.data?.data?.amount / 100,
        currency: res?.data?.data?.currency,
        name: 'PostBuddy',
        description: 'Transaction for lifetime plan',
        image: 'https://postbuddy.ai/favicon.ico',
        order_id: res?.data?.data?.id,
        callback_url: '/dashboard',
        prefill: {
          name: fullName,
          email: email,
          contact: '+919876543210',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#281b4a',
        },
      };
    } else {
      options = {
        key: process.env.NEXT_PUBLIC_RAYZOR_KEY,
        subscription_id: SubscriptionId,
        name: 'Post Buddy',
        description: 'Transaction for Monthly plan',
        image: 'https://postbuddy.ai/favicon.ico',
        callback_url: '/dashboard',
        prefill: {
          name: fullName,
          email: email,
          contact: '+919876543210',
        },
        notes: {
          note_key_1: 'Tea. Earl Grey. Hot',
          note_key_2: 'Make it so.',
        },
        theme: {
          color: '#281b4a',
        },
      };
    }

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className=" bg-[#110f1b] h-screen overflow-x-hidden w-screen">
      <Navbar />
      <h1 className="text-2xl font-bold text-center my-6">Checkout</h1>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">Failed to load plan details.</p>
      ) : (
        <div className="flex justify-center mb-6">
          <Card
            _id={data?.data?._id}
            price={data?.data?.price / 100}
            features={data?.data?.features || []}
            name={data?.data?.name}
            type={data?.data?.type}
            checkout={true}
            origin={data?.data?.type}
            razorpayDetails={data?.data?.razorpayDetails}
            loading={checkoutLoader}
            function={handlePayment}
          />
        </div>
      )}

      <div className="flex justify-center"></div>
      <div></div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Razorpay script loaded')}
      />
    </div>
  );
}
