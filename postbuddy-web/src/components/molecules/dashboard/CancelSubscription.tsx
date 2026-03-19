'use client'
import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import {
  useLazyCheckActiveSubscriptionQuery,
  useCancelActiveSubscriptionMutation,
} from '@/redux/api/services/subscription';
import { Loader } from '@mantine/core';
import toast from 'react-hot-toast';

export default function CancelSubscription({ plans, onClose, refetch }: any) {
  const [cancelActiveSubscription, { isLoading }] =
    useCancelActiveSubscriptionMutation();
  const { data: checkActive, refetch: checkRefetch } = useLazyCheckActiveSubscriptionQuery({});
  const check = checkActive?.data;
  console.log('Check ==> ', check);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    checkRefetch();
  },[])

  const handleCancelSubscription = async () => {
    let finalReason = reason;

    if (reason === 'Other') {
      if (!customReason.trim()) {
        toast.error('Please enter a reason');
        return;
      }
      finalReason = customReason;
    } else if (!reason) {
      toast.error('Please enter a reason');
      return;
    }

    try {
      toast.promise(
        async () => {
          const res = await cancelActiveSubscription({
            reason: finalReason,
          }).unwrap();
          if (res?.message === 'Please try again after 10 min')
            return toast.error('Please try again after 10 min');
          refetch();
          onClose();
        },
        {
          loading: 'Cancelling subscription...',
          success: 'Subscription cancelled',
          error: 'Unable to cancel subscription',
        },
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  return (
    <div className="border-2 border-[#6022b5] bg-[#2b1e4e] text-white p-8 rounded-lg max-w-lg mx-auto z-[999]">
      <h3 className="text-red-400 text-sm mb-2 font-bold font-Poppins">
        CANCEL PLAN
      </h3>
      <div>
        <h2 className="xl:text-2xl 2xl:text-3xl font-semibold ">
          You are about to cancel your subscription :(
        </h2>
        <h3 className="text-md 2xltext-lg mb-6">
          Once your subscription expires on your next invoice date, you will
          lose access to Postbuddy AI:
        </h3>
        <h3 className="text-lg mb-4">
          Your current plan{' '}
          <span className="text-green-400">{plans?.[0]?.name}</span>
        </h3>
      </div>
      <ul className="space-y-2 2xl:space-y-4 mb-6">
        <li className="flex items-center">
          <MdOutlineCancel className="text-red-500 text-xl mr-2" />
          <p>You will lose all your data.</p>
        </li>
        <li className="flex items-center">
          <MdOutlineCancel className="text-red-500 text-xl mr-2" />
          <p>You will lose all your settings and customizations.</p>
        </li>
        <li className="flex items-center">
          <MdOutlineCancel className="text-red-500 text-xl mr-2" />
          <p>Future updates and features won&apos;t be accessible.</p>
        </li>
      </ul>
      <div className="mb-4">
        <h3 className="text-lg mb-2">
          What is your reason for cancelling Postbuddy AI?
        </h3>
        <select
          name="reason"
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 text-white rounded-[4px] bg-[#332064] outline-none"
        >
          <option value="">Select a reason</option>
          <option value="Too expensive">Too expensive</option>
          <option value="Not useful for my needs">
            Not useful for my needs
          </option>
          <option value="Found a better alternative">
            Found a better alternative
          </option>
          <option value="Other">Other</option>
        </select>
      </div>
      {!check && <p className="text-xs my-2">
        Subscription activation is in progress. Enjoy premium features in the
        meantime.
      </p>}
      {/* Conditionally render the textarea when "Other" is selected */}
      {reason === 'Other' && (
        <div className="mb-6">
          <textarea
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Please provide your reason"
            className="w-full p-2 text-white rounded-[4px] bg-[#332064] outline-none"
            rows={4}
          />
        </div>
      )}
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="bg-[#332064] px-6 py-2 rounded-[4px] text-white hover:bg-[#663eae] border-2 border-[#663eae] duration-300"
        >
          Stay Subscribed
        </button>
        <button
          disabled={!check}
          onClick={handleCancelSubscription}
          className={`bg-[#a5382e] px-6 py-2 rounded-[4px] text-white hover:bg-[#bf4b38] border-2 border-[#bf4b38] duration-300 flex items-center justify-center ${check ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
          {isLoading ? (
            <Loader color="white" size="sm" />
          ) : (
            'Cancel Subscription'
          )}
        </button>
      </div>
    </div>
  );
}
