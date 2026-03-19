import Navbar from '@/components/molecules/Home/Navbar';
import UserCard from '@/components/molecules/User/UserCard';

/* eslint-disable react-hooks/exhaustive-deps */
export default function Page() {
  return (
    <>
      <head>
        <title>PostBuddy AI - User</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen font-Poppins px-6">
        <Navbar />
        <UserCard />
      </div>
    </>
  );
}
