'use client';
import Link from 'next/link';
import { Loader } from '@mantine/core';
import { getAuth } from '@/utils/helper';
import toast from 'react-hot-toast';
import { useCheckoutMutation, useCreateTransactionMutation } from '@/redux/api/services/payment';
import Script from 'next/script';
import TitleFeed from '@/components/atoms/cards/TitleFeed';
import { useRouter } from 'next/navigation';
import { useGetActiveSubscriptionQuery, useDeleteCreatedSubscriptionMutation } from '@/redux/api/services/subscription';
import { useGetUserQuery } from '@/redux/api/services/authApi';

interface Props {
  _id: string;
  price: number | string;
  features: string[];
  name: string;
  type: string;
  checkout: boolean;
  origin: string;
  razorpayDetails: object;
  loading?: boolean;
  function?: Function;
}

export default function Card(props: Props) {
  const { email, fullName } = getAuth() || {};
  const [checkout, { isLoading: checkoutLoader }] = useCheckoutMutation();
  const [createTransaction] = useCreateTransactionMutation();
  const [deleteCreatedSubscription] = useDeleteCreatedSubscriptionMutation();
  const router = useRouter();

  const { data } = useGetActiveSubscriptionQuery(
    getAuth()?._id,
    { skip: !getAuth()?._id }
  );
  const { data: userData } = useGetUserQuery({}, { skip: !getAuth()?._id });

  const activePlan = data?.data?.[0]?.planDetails;

  const handlePayment = async () => {
    if (!email && !fullName) {
      toast.error('Redirecting to Login...');
      localStorage.setItem('redirectUrl', '/plans');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      return;
    }

    // Check if user is trying to subscribe to a plan they already have
    if (activePlan?.[0]?._id === props._id) {
      toast.error(`You are already on the ${props.name} plan`);
      return;
    }

    // If user has Lifetime plan, they shouldn't downgrade to Premium
    if (props.name === 'Premium' && activePlan?.[0]?.name === 'Lifetime') {
      toast.error('You already have a Lifetime plan which includes all Premium features');
      return;
    }

    const res = await checkout({ planId: props._id });
    let SubscriptionId = res?.data?.data;
    console.log(SubscriptionId);
    let options = {};
    let queryFilter 
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
        callback_url: '/payment',
        prefill: {
          name: userData?.data?.fullName || fullName,
          email: userData?.data?.email || email,
          contact: userData?.data?.phone || '',
        },
        handler: async function (response: any) {
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature
          };
          await createTransaction(paymentDetails);
          window.location.href = `/payment?payment_id=${response.razorpay_payment_id}&subscription_id=sub_lifetime`;
        },
        modal: {
          ondismiss: function () {
            queryFilter = `gatewayOrderId=${res?.data?.data?.id}`;
            deleteCreatedSubscription(queryFilter);
          }
        },
        notes: {
          userId: userData?.data?._id || getAuth()?._id,
        },
        theme: {
          color: '#281b4a',
        },
      };
    }
    // Monthly plan 
    else {
      options = {
        key: process.env.NEXT_PUBLIC_RAYZOR_KEY,
        subscription_id: SubscriptionId,
        name: 'Post Buddy',
        description: 'Transaction for Monthly plan',
        image: 'https://postbuddy.ai/favicon.ico',
        callback_url: '/payment',
        prefill: {
          name: userData?.data?.fullName || fullName,
          email: userData?.data?.email || email,
          contact: userData?.data?.phone || '',
        },
        handler: async function (response: any) {
          const paymentDetails = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature
          };
          await createTransaction(paymentDetails);
          console.log('Payment success:', paymentDetails);
          window.location.href = `/payment?payment_id=${response.razorpay_payment_id}&subscription_id=${response.razorpay_subscription_id}`;
        },
        modal: {
          ondismiss: function () {
            queryFilter = `gatewaySubscriptionId=${SubscriptionId}`;
            deleteCreatedSubscription(queryFilter);
          }
        },
        notes: {
          gatewaySubscriptionId: SubscriptionId,
          userId: userData?.data?._id || getAuth()?._id,
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
    <div
      className={`relative transition duration-300 ${props.name === 'Lifetime' ? 'transform hover:scale-105' : ''}`}
    >
      {activePlan?.[0]?._id == props?._id ? (
        <div className="absolute -top-4 right-0 left-0 mx-auto w-max bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-full z-10">
          Current Plan
        </div>
      ) : (
        <div></div>
      )}
      <div
        className={`bg-[#${props.name === 'Basic' ? 'ff6f2721' : props.name !== 'Premium' ? 'bb27ff21' : '32ff2721'}] w-[150px] h-[200px] top-0 left-0 rounded-full absolute blur-3xl`}
      ></div>
      <div
        className={`bg-[#${props.name === 'Basic' ? 'fea172' : props.name !== 'Premium' ? '371e78' : '371e78'}] h-[100px] w-[180px] bottom-0 right-0 rounded-full absolute blur-[160px]`}
      ></div>

      <div className="border-2 rounded-2xl p-4 pb-5 card-background h-[450px] relative w-[340px] lg:w-[380px]">
        <div className="flex gap-2 items-center">
          <h3 className="text-[35px] font-Poppins pl-4 flex">{props.name}</h3>
          <span>
            <TitleFeed name={props.name} />
          </span>
        </div>
        <p className="text-[12px] font-Poppins pl-4">
          {props.name === 'Basic'
            ? 'Get started for free, forever.'
            : props.name !== 'Premium'
              ? 'Unlimited access to all features, forever.'
              : 'Unlimited access to all features, billed monthly.'}
        </p>
        <div className="w-[90%] h-[1px] my-2 m-auto bg-white"></div>

        <p className="my-4 gap-1 flex items-center pl-2">
          <span className="xl:text-xl 2xl:text-3xl">
            {props.origin === 'india' ? '₹' : '$'}
          </span>
          <span className="xl:text-3xl 2xl:text-6xl">{props.price}</span>
        </p>
        <ul className="space-y-2 mb-6 flex-grow">
          {props.features.map((feature: string, index: number) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${feature.startsWith('✓')
                ? 'text-green-400'
                : feature.startsWith('✗')
                  ? 'text-red-400'
                  : 'text-gray-300'
                }`}
            >
              • {feature}
            </li>
          ))}
        </ul>

        {
          <div className="absolute w-auto bottom-5 left-[50%] -translate-x-[50%]">
            {props.price === 0 ? (
              <Link
                href={`/dashboard`}
                className="inline-block py-2 px-4 rounded-[4px] font-medium text-center bg-blue-500 hover:bg-blue-600 text-white duration-300"
              >
                Get Started
              </Link>
            ) : checkoutLoader ? (
              <div className="w-32 h-[40px] py-2 px-4 rounded-[4px] flex bg-[#a971ee] hover:bg-[#8d5ec7] text-white duration-300 items-center justify-center">
                <Loader color="white" size="sm" />
              </div>
            ) : (
              <button
                onClick={handlePayment}
                className="h-[40px] w-max py-2 px-4 rounded-[4px] font-medium text-center bg-[#a971ee] hover:bg-[#8d5ec7] text-white duration-300"
              >
                {props.name !== 'Premium'
                  ? 'Get LifeTime Access'
                  : 'Subscribe Now'}
              </button>
            )}
          </div>
        }
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => console.log('Razorpay script loaded')}
      />
    </div>
  );
}
