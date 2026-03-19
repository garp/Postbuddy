'use client';
import { Button, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useDeactivateMutation } from '@/redux/api/services/user';

export default function Deactivate({ onClose, refetch }: any) {
  const [deactivate, { isLoading }] = useDeactivateMutation({});
  useEffect(() => {
    refetch();
  }, [refetch]);
  const [reason, setReason] = useState('');

  const submitHandler = async () => {
    try {
      const res = await deactivate(reason);
      console.log(res);
      refetch();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border-2 border-[#6022b5] bg-[#2b1e4e] text-white p-8 rounded-lg max-w-lg mx-auto">
      <h3 className="text-red-400 text-sm mb-2 font-bold font-Poppins">
        DEACTIVATE ACCOUNT
      </h3>
      <div>
        <h2 className="text-3xl font-semibold mb-2">
          You are about to deactivate your account :(
        </h2>
        <h3 className="text-lg mb-6"></h3>
      </div>
      <div className="mb-6 gap-4 flex flex-col">
        <h3 className="text-lg">
          What is your reason for deactivating your account?
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
          <option value="Want a pause">Want a pause</option>
          <option value="Other">Other</option>
        </select>
        <div className="flex items-center justify-between font-Poppins">
          <Button className="" color="#6c2ae6" onClick={() => onClose()}>
            Keep Active
          </Button>
          <Button
            color="#aa1b1b"
            className=""
            onClick={submitHandler}
            disabled={!reason}
          >
            {isLoading ? <Loader color="white" size="sm" /> : 'Deactivate'}
          </Button>
        </div>
      </div>
      <div className="flex justify-between"></div>
    </div>
  );
}
