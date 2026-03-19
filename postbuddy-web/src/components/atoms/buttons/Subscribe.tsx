'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Loader } from '@mantine/core';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  interface SubscribeResponse {
    message: string;
  }

  const submitHandler = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<SubscribeResponse>(
        `${process.env.NEXT_PUBLIC_API_SUBSCRIBE_URL}`,
        { email },
      );
      if (res?.data?.message === 'Already subscribed') {
        setError('Already subscribed');
      } else {
        setSuccess('Subscribed to newsletter');
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mt-8 md:mt-0">
      <h3 className="text-white text-lg font-semibold mb-4">
        Let&apos;s keep in Touch
      </h3>
      <p className="mb-4 text-xs">
        Enter your email to keep in the know with the latest updates from
        PostBuddy AI
      </p>
      <form
        className="items-center flex flex-col gap-3"
        onSubmit={submitHandler}
      >
        <input
          type="text"
          placeholder="your@email.com"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#20203b] font-Poppins rounded-xl h-[50px] w-full pl-2 focus:border-none "
        />
        <p className={`${error ? 'text-red-500' : 'text-green-500'}`}>
          {error || success}
        </p>
        <button
          type="submit"
          className="lifetime-access-btn text-xl w-full rounded-xl h-[40px] m-auto text-white flex items-center justify-center"
        >
          {loading ? <Loader size={'sm'} color="white" /> : 'Submit'}
        </button>
      </form>
    </div>
  );
}
