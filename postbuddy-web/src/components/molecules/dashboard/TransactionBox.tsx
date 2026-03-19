import { useGetTransactionsQuery } from '@/redux/api/services/payment';
import React from 'react';
import { getAuth } from '@/utils/helper';
import { Loader } from '@mantine/core';


export default function TransactionBox() {
  const { data, isLoading: transactionLoading } = useGetTransactionsQuery({}, { skip: !getAuth()?._id });
  const transactions = data?.data
  return (
    <div className="w-full h-full chart-parent">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-lg md:text-xl font-Poppins font-medium text-white mt-8 md:mt-6 ml-10 mb-4 md:mb-6">
          Transactions History
        </h3>
      </div>
      <div className='mx-4 mb-4'>
        {
          transactionLoading ?
            <div className='flex justify-center items-center h-full'>
            <Loader color='white'/>
          </div> : 
          transactions?.length === 0 ? (
            <div className='flex justify-center items-center h-full py-8'>
              <p className='text-white'>No past transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-700 rounded-[4px]">
              <table className="min-w-full bg-[#1f1b2e] text-white text-sm">
                <thead>
                  <tr className="bg-purple-800 text-left text-xs uppercase tracking-wider text-gray-200 ">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Payment ID</th>
                    <th className="px-4 py-3">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map((tx: any) => (
                    <tr
                      key={tx._id}
                      className="border-t border-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3">{new Date(tx.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }).replace(' at ', ', ')}</td>
                      <td className="px-4 py-3">
                        {tx.currency === "INR" ? "₹" : "$"}{(tx.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 capitalize">{tx.status}</td>
                      <td className="px-4 py-3">{tx.gatewayPaymentId}</td>
                      <td className="px-4 py-3">{tx.gatewaySubscriptionId === "sub_lifetime" ? "Lifetime" : "Monthly"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
