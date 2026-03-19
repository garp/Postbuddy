/* eslint-disable react-hooks/exhaustive-deps */
'use client';
/* chrome global  */
import { useEffect, useRef, useState } from 'react';
import { getAuth } from '@/utils/helper';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/molecules/Home/Navbar';
import { useGetActiveSubscriptionQuery } from '@/redux/api/services/subscription';
import { IoExitOutline } from 'react-icons/io5';
import Link from 'next/link';
import ApiKeyBox from '@/components/molecules/dashboard/ApiKeyBox';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Tabs } from '@mantine/core';
import CancelSubscription from '@/components/molecules/dashboard/CancelSubscription';
import CurrentPlan from '@/components/molecules/dashboard/CurrentPlan';
import moment from 'moment';
import Chart from '@/components/molecules/dashboard/Chart';
import { useGetUserQuery } from '@/redux/api/services/authApi';
import UserManagement from '@/components/molecules/dashboard/UserManagement';
import { useGetOrganizationUsersQuery } from '@/redux/api/services/userManagement'
import TransactionBox from '@/components/molecules/dashboard/TransactionBox';
import CommentsTable from '@/components/molecules/dashboard/CommentsTable';
// import DataTable from '@/components/molecules/dashboard/DataTable';

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: organizationUsers } = useGetOrganizationUsersQuery({});
  const isOrgMember = organizationUsers?.data?.length > 0;
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
  }, [])

  const [cancelCheck, setCancelCheck] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [opened, { open, close }] = useDisclosure(false);
  const { data: userData } = useGetUserQuery({}, { skip: token === null });
  const user = userData?.data;
  // Fetch subscription data
  if (userData) console.log('Postbuddy');

  const { data, isLoading, refetch } = useGetActiveSubscriptionQuery(
    getAuth()?._id,
    { skip: !getAuth()?._id }
  );

  const plans = data?.data?.flatMap((item: any) => item.planDetails);

  // Get the active tab from URL params or use default
  const activeTab = searchParams.get('tab') || 'analytics';

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    // Create a new URLSearchParams object from the current parameters
    const params = new URLSearchParams(searchParams.toString());
    // Update the 'tab' parameter with the new value
    params.set('tab', value);
    // Update the URL without reloading the page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const logoutHandler = () => {
    localStorage.clear();
    router.push('/');
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.remove('websiteToken', () => {
        console.log('websiteToken has been removed from chrome.storage.sync');
      });
    }
    window.location.reload();
  };

  const isVisible =
    data?.data?.[0]?.planDetails?.[0]?.name.toLowerCase() === 'lifetime' ||
    data?.data?.[0]?.planDetails?.[0]?.name.toLowerCase() === 'premium';

  const handleToggleCancelCheck = () => {
    const createdAt = moment(data?.data?.[0]?.createdAt);
    const today = moment();
    const differenceInDays = today.diff(createdAt, 'days');
    setCancelCheck(differenceInDays < 7);
  };

  useEffect(() => {
    if (!data?.data?.[0]?.createdAt) return;
    handleToggleCancelCheck();
  }, [data, handleToggleCancelCheck]);

  useEffect(() => {
    const auth = getAuth();
    if (!auth || !auth._id) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);


  if (!isAuthenticated) return null;

  return (
    <>
      <head>
        <title>PostBuddy AI - Dashboard</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen font-Poppins px-6">
        <Navbar />
        <div className="flex flex-col md:items-end md:flex-row bg-[#1e153796] border-2 border-[#52397d96] px-6 md:px-12 py-4 md:py-6 rounded-xl items-start justify-between my-4">
          <div className="relative flex flex-col md:flex-row h-full">
            <div>
              <h3 className="text-2xl md:text-3xl font-Poppins font-semibold my-4 text-white">
                Welcome!{' '}
                <Link href={`/user/${getAuth()?._id}`} className="underline">
                  {user?.fullName?.split(' ')[0]}
                </Link>
              </h3>
              <p className="text-gray-400 text-lg md:text-2xl my-2">
                Usage Graph
              </p>
              <p className="text-base md:text-lg w-[80%]">
                To see usage and growth analytics, please follow these steps:
              </p>
              <ul className="list-disc pl-4">
                <li>1. Add Postbuddy to Chrome</li>
                <li>2. Purchase a plan to see analytics</li>
              </ul>
            </div>

            <div className="bg-[#8251FB] h-[80px] w-[150px] md:h-[100px] md:w-[200px] absolute blur-[125px] left-16 -bottom-4"></div>
          </div>

          <button
            className="flex items-center gap-2 text-sm md:text-lg border-[#413967] border-2 rounded px-3 md:px-4 py-2 exit-btn mt-4 md:mt-0"
            onClick={logoutHandler}
          >
            <IoExitOutline />
            Log out
          </button>
        </div>

        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Tab value="analytics" >
              Analytics
            </Tabs.Tab>
            <Tabs.Tab value="configuration" >
              Configuration
            </Tabs.Tab>
            {isOrgMember && (
              <Tabs.Tab value="userManagement" >
                User Management
              </Tabs.Tab>
            )}
            <Tabs.Tab value="transactions" >
              Transactions
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className='mt-6' value="analytics">
            <div className='bg-[#1e153796] border-2 border-[#52397d96] gap-12 flex flex-col px-6 md:px-12 py-4 md:py-6 rounded-xl items-start justify-between my-4'>
              <Chart organizationUsers={organizationUsers} />
              <CommentsTable />
            </div>
          </Tabs.Panel>

          <Tabs.Panel className='mt-6' value="configuration">
            <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4 mb-4">
              <CurrentPlan
                isLoading={isLoading}
                plans={plans}
                open={open}
                cancelCheck={cancelCheck}
                ref={containerRef}
              />
              {isLoading ? (
                null
              ) :
                isVisible && <ApiKeyBox containerRef={containerRef} isVisible={!isVisible} />
              }
            </div>
          </Tabs.Panel>

          <Tabs.Panel className='mt-6' value="userManagement">
            <div className='bg-[#1e153796] border-2 border-[#52397d96] rounded-xl items-start justify-between'>
              <UserManagement />
            </div>
          </Tabs.Panel>

          <Tabs.Panel className='mt-6' value="transactions">
            <div className='bg-[#1e153796] border-2 border-[#52397d96] rounded-xl items-start justify-between'>
              <TransactionBox />
            </div>
          </Tabs.Panel>
        </Tabs>

        <Modal
          withCloseButton={false}
          opened={opened}
          onClose={close}
          centered
          size="auto"
        >
          <CancelSubscription plans={plans} onClose={close} refetch={refetch} />
        </Modal>
      </div>
    </>
  );
}
