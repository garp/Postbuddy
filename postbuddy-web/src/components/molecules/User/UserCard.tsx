'use client';
import React from 'react';
import { Button } from '@mantine/core';
import { useGetUserQuery } from '@/redux/api/services/authApi';
import { Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import EditProfile from './EditProfile';
import Image from 'next/image';
import { getAuth } from '@/utils/helper';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserCard() {
  const { data, isLoading, refetch } = useGetUserQuery({});
  const User = data?.data;
  console.log('User ==> ', User?.profileUrl);

  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const router = useRouter();
  const { fullName, email } = getAuth() || {};
  useEffect(() => {
    if (!fullName && !email) {
      router.push('/login');
    }
  }, [email, fullName, router]);

  return (
    <div
      className={`flex flex-col h-[17rem] xl:items-start xl:justify-${isLoading ? 'start' : 'start'} w-full bg-[#1e153796] border-2 border-[#52397d96] px-6 md:px-12 py-4 md:py-6 rounded-xl items-start justify-between my-4`}
    >
      <h3 className="text-2xl md:text-3xl font-Poppins font-semibold my-4 text-white">
        User Profile
      </h3>
      {isLoading ? (
        <Loader color="white" />
      ) : (
        <div className="flex gap-4 items-center">
          <div>
            <Image
              src={User?.profileUrl}
              alt="/"
              width={96}
              height={96}
              className="rounded-full border border-gray-300 w-[100px] h-[100px]"
            />
          </div>
          <div className="relative">
            <div className="flex flex-col gap-2 my-4">
              <p>
                Name : <span>{User?.fullName}</span>
              </p>
              <p>
                Email : <span>{User?.email}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                className="z-10"
                variant="filled"
                color="#782fff"
                onClick={openEdit}
              >
                Edit Profile
              </Button>
              {/* <Button className="z-10" color="#aa1b1b" onClick={openDeactivate}>
              Deactivate Profile
            </Button> */}
            </div>
            <div className="bg-[#8251FB] h-[80px] w-[150px] md:h-[100px] md:w-[200px] absolute blur-[125px] left-16 -bottom-4"></div>
          </div>
        </div>
      )}

      <Modal
        withCloseButton={false}
        opened={editOpened}
        onClose={closeEdit}
        centered
        size="auto"
      >
        <EditProfile User={User} onClose={closeEdit} refetch={refetch} />
      </Modal>
    </div>
  );
}
