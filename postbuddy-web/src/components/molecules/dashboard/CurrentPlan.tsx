import React, { forwardRef } from 'react';
import { Loader } from '@mantine/core';

interface Plan {
  _id?: string;
  gatewayPlanId: string;
  name: string;
  price: number;
  type: string;
  features: string[];
}

interface CurrentPlanProps {
  isLoading: boolean;
  plans: Plan[];
  open?: () => void;
  cancelCheck?: boolean;
}

const CurrentPlan = forwardRef<HTMLDivElement, CurrentPlanProps>(
  ({ isLoading, plans, open, cancelCheck }, ref) => {
    if (isLoading)
      return (
        <div className="bg-[#110f1b] w-full max-w-screen-sm flex items-center justify-center">
          <Loader color="#8251FB" />
        </div>
      );

    const isBasicPlan = plans?.[0]?.gatewayPlanId === 'plan_basic';

    const renderPlans = () => (
      <>
        {plans?.map((plan: Plan, index: number) => (
          <div
            key={plan._id || index}
            className="bg-white bg-opacity-10 p-4 md:p-5 rounded-lg md:mb-6"
          >
            <h4 className="text-sm font-semibold text-white mb-1">
              {plan.name} Plan
            </h4>
            <p className="text-gray-400 text-sm">
              Price:{' '}
              {plan.price === 0
                ? 'Free'
                : `${plan.type === 'india' ? '₹' : '$'}${plan.price / 100}`}
            </p>
            <h5 className="text-sm font-semibold text-white mt-2">Features:</h5>
            <ul className="text-gray-300 text-sm list-disc list-inside space-y-1 md:space-y-2 mt-2">
              {plan.features.map((feature: string, i: number) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </>
    );

    return (
      <div 
        className="dashboard-container w-full h-fit p-6 md:p-8 rounded-lg"
        ref={ref}
      >
        <h3 className="text-lg md:text-xl font-Poppins font-medium text-white mb-4 md:mb-6">
          Your Current Plan and Its Benefits
        </h3>

        {renderPlans()}

        {isBasicPlan ? (
          <div className="w-full mx-auto flex">
            <a
              href="/plans"
              className="w-full mx-auto text-center py-2 bg-[#7b5bff] text-white rounded-md text-sm md:text-base font-semibold"
            >
              Update Plan
            </a>
          </div>
        ) : (
          (cancelCheck && plans?.length) ? (
            <div className="w-full mx-auto flex items-center justify-center">
              <button onClick={open} className="text-red-500 hover:underline">
                Cancel Subscription
              </button>
            </div>
          ) : null
        )}
      </div>
    );
  }
);

CurrentPlan.displayName = 'CurrentPlan';

export default CurrentPlan;