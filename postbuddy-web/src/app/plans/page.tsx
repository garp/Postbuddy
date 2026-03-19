'use client'
import { useGetAllPlansQuery } from '../../redux/api/services/plansApi';
import Navbar from '@/components/molecules/Home/Navbar';
import AllPlans from '@/components/molecules/AllPlans';
import Footer from '@/components/molecules/Home/Footer';
import FAQs from '@/components/molecules/Home/FAQs';
import Benefits from '@/components/molecules/Home/Benefits';
import axios from 'axios';
import { useEffect, useState } from 'react';
import PageLoader from '@/components/atoms/pageLoader';

export default function SubscriptionId() {
  const [type, setType] = useState('');
  const { data, isLoading: planIsLoading } = useGetAllPlansQuery(type, {
    skip: !type,
  });
  const [isLoading, setIsLoading] = useState(true);

  async function planSelection() {
    setIsLoading(true);
    try {
      const res = await axios.get(
        'https://pro.ip-api.com/json?key=t9TIYGF22lITyyv',
      );
      console.log(res?.data?.country);
      setType(res?.data?.country?.toLowerCase());
    } catch (error) {
      console.error('Error fetching plans:', error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    planSelection();
  }, []);

  const plans = Array.isArray(data?.data) ? data.data : null;

  return (
    <>
      <head>
        <title>PostBuddy AI - Plans</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen">
        <Navbar />

        <div>
          <h1 className=" text-md md:text-2xl px-[14px] font-bold text-center mb-6 mt-12 text-white">
            Choose a subscription from the options below
          </h1>
          {isLoading ? (
            <PageLoader hasBg={false} fullPage={false} height={450} />
          ) : (
            <AllPlans plans={plans} isLoading={planIsLoading} />
          )}
        </div>

        <div className="mb-10">
          <FAQs />
          <Benefits />
        </div>
        <Footer />
      </div>
    </>
  );
}
