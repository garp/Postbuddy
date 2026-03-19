'use client'
import Navbar from "@/components/molecules/Home/Navbar";
import { useJoinOrganizationQuery, useAcceptInviteMutation } from "@/redux/api/services/userManagement";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader } from "@mantine/core";
import Link from "next/link";
import PageLoader from "@/components/atoms/pageLoader";
import { useRouter } from "next/navigation";

export default function JoinOrganization({ params }: { params: { organizationId: string } }) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { organizationId } = params;
  const { data, isLoading, isError, error } = useJoinOrganizationQuery({ organizationId, email });
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();
  const organization = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      toast.error("Error loading organization details");
    }
  }, [isError, error]);

  const handleJoin = async () => {
    // Simulate joining process
    const res = await acceptInvite({ organizationId, email });
    console.log(res)
    localStorage.setItem('verified', "false");
    localStorage.setItem('purpose', "login");
    localStorage.setItem('type', "organization");
    toast.success(`Successfully joined ${organization?.organizationName}`);
    router.push(`/verifyOtp?email=${email}`);
  };

  if (isLoading) {
    return (
      <div className='bg-[#110f1b] h-screen flex items-center justify-center w-screen font-Poppins'>
        <PageLoader />
      </div>
    );
  }

  return (
    <div className='bg-[#110f1b] min-h-screen overflow-x-hidden w-screen font-Poppins'>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#1E1B2E] rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6">Join Organization</h1>

        {organization ? (
          <div className="space-y-6">
            <div className="bg-[#2D293F] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Organization</p>
              <p className="text-white text-lg font-medium">{organization.organizationName}</p>
            </div>

            <div className="bg-[#2D293F] p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Your Email</p>
              <p className="text-white text-lg font-medium">{email}</p>
            </div>

            <button
              onClick={handleJoin}
              className="w-full py-2 px-4 h-[36px] bg-[#9D6FFF] hover:bg-[#8A5CF7] text-white font-medium rounded transition duration-200 disabled:opacity-70"
              disabled={isAccepting}
            >
              {isAccepting ? <Loader color='white' size={20} /> : 'Join Organization'}
            </button>

            <div className="text-center text-sm text-gray-400">
              <p>
                Already have an account?{" "}
                <Link href="/login" className="text-[#9D6FFF] hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white">Organization not found or invitation expired.</p>
            <Link href="/" className="text-[#9D6FFF] hover:underline block mt-4">
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
