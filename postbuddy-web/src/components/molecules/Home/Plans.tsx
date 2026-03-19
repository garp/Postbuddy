'use client';
import React, { useEffect, useState } from 'react';
import { useGetAllPlansQuery } from '../../../redux/api/services/plansApi';
import AllPlans from '../AllPlans';
import axios from 'axios';
import PageLoader from '@/components/atoms/pageLoader';

export default function Plans() {
  const [type, setType] = useState('');
  const { data, isLoading: planLoading } = useGetAllPlansQuery(type, { skip: !type });
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

  const plans = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="flex relative h-auto lg:min-h-[850px] justify-center">
      {/* Background Gradient Decorations */}
      <div className="absolute h-[100px] w-[400px] rounded-full gradient-div1 bottom-0 -left-[200px]"></div>
      <div className="absolute h-[100px] w-[400px] rounded-full gradient-div2 bottom-0 -right-[200px]"></div>

      {/* Content Section */}
      <div className="flex items-center flex-col justify-center">
        {/* Header */}
        <div className="flex flex-col w-full justify-center">
          <div className="px-5 md:px-1 flex flex-col items-center md:leading-[64px] gap-4">
            <h1 className="text-[30px] md:text-[58px] font-Poppins text-center">
              Compare your plans for
            </h1>
            <p className="text-[30px] md:text-[58px] font-Poppins text-center">
              <span className="gradient-text font-medium">PostBuddy Ai</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row  items-center justify-center gap-4 my-24">
          {isLoading ? (
            <PageLoader hasBg={false} fullPage={false} height={450} />
          ) : (
            <AllPlans plans={plans} isLoading={planLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
