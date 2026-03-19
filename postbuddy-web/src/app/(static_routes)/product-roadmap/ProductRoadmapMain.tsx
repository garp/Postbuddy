'use client';
import { Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { FaRegThumbsUp } from 'react-icons/fa';
import { useGetAllProductRoadMapsQuery, useUpvoteMutation } from '@/redux/api/services/admin/productRoadMap';
import toast from 'react-hot-toast';


const ProductRoadmapMain = () => {
  const [votingId, setVotingId] = useState<string | null>(null);
  const [upvote] = useUpvoteMutation()
  const { data, isLoading, refetch } = useGetAllProductRoadMapsQuery({});
  const roadmapItems:any = data || []
  const [token,setToken] = useState<String | null>("")

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  },[])

  return (
    <div className="bg-[#110f1b] h-auto overflow-x-hidden w-screen font-Poppins">
      <div className="max-w-4xl xl:max-w-7xl mx-auto mt-12 mb-12 px-4">
        <h2 className="gradient-text text-[40px] xl:text-[60px] text-center font-Poppins font-semibold">
          Product Roadmap
        </h2>
        {isLoading ? (
          <div className='flex w-full items-center justify-center'>
            <Loader color='white' size={'lg'} />
          </div>
        ) : (
          <div className="overflow-x-auto mt-8 px-4">
            <table
              className="table-auto border-separate"
              style={{ borderSpacing: '0 20px' }}
            >
              <thead>
                <tr>
                  <th className="text-[20px] font-[500] px-4 py-2 text-left">
                    Features
                  </th>
                  <th className="text-[20px] font-[500] px-4 py-2 text-left">
                    Status
                  </th>
                  <th className="text-[20px] font-[500] px-4 py-2 text-left">
                    Description
                  </th>
                  <th className="text-[20px] font-[500] px-4 py-2 text-left">
                    Votes
                  </th>
                  <th className="text-[20px] font-[500] px-4 py-2 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  roadmapItems?.data?.map((item: any, index: number) => (
                    <tr key={index} className=" bg-[#2C1F5099] rounded-[14px]">
                      <td className="px-4 py-2 text-[15px] font-[400]">
                        {item?.features}
                      </td>
                      <td className="px-4 py-2 text-[13px] font-[400]">
                        <span
                          className={`${item.status === 'Progress'
                            ? 'bg-[#110E2199]'
                            : item.status
                              ? 'bg-[#782FFF]'
                              : 'bg-gray-400'
                            } text-white px-3 py-1 rounded-full`}
                        >
                          {item?.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[15px] font-[400]">
                        {item?.description}
                      </td>
                      <td className="px-4 py-2 text-[15px] font-[400] text-center">
                        {item?.upvotes?.length}
                      </td>
                      <td className="px-4 py-2 text-[13px] font-[400]">
                        <button
                          onClick={async () => {
                            if(!token) return toast.error('Please login to upvote roadmap');
                            setVotingId(item._id); 
                            await toast.promise(
                              (async () => {
                                const res:any = await upvote(item._id).unwrap();
                                refetch();
                                return res?.message;
                              })(),
                              {
                                loading: 'Upvoting...',
                                success: (message) => message || 'Upvoted successfully!',
                                error: 'Unable to upvote roadmap',
                              },
                            );
                            setVotingId(null); 
                          }}
                          className="flex gap-1 items-center bg-[#110E2199] text-white px-3 py-1 rounded-md hover:bg-[#4c338d] transition"
                        >
                          {votingId === item._id ? (
                            <Loader color='white' size={'xs'} />
                          ) : (
                            <FaRegThumbsUp />
                          )}
                        </button>


                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductRoadmapMain;
