import React from 'react';
import Card from './plans/card';
import PageLoader from '../atoms/pageLoader';

export default function AllPlans({ plans, isLoading }: any) {
  return (
    <div className="flex flex-col gap-4 z-[900] h-full">
      {isLoading ? (
        <PageLoader hasBg={false} fullPage={false} height={450} />
      ) : (
        <div className="z-[900] flex flex-col mb-12 lg:flex-row items-center gap-6 px-[24px] justify-evenly lg:items-start w-full">
          {plans?.length > 0 ? (
            plans?.map((plan: any) => (
              <Card
                key={plan?._id}
                _id={plan?._id}
                price={plan?.price / 100}
                features={plan?.features}
                name={plan?.name}
                type={plan?.type}
                checkout={true}
                origin={plan?.type}
                razorpayDetails={plan?.razorpayDetails}
              />
            ))
          ) : (
            <p className="text-lg font-semibold text-gray-400 text-center w-full">
              No plans available at the moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
