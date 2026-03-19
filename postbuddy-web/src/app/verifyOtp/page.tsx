'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Checkbox } from '@mantine/core'
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from '@/redux/api/services/authApi';
import { setToken } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import LoginImage from '@/assets/login-page.png';
import Logo from '@/assets/postbuddy-logo.png';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useFormik } from 'formik';
import { Loader, PinInput } from '@mantine/core';
import { getAuth } from '@/utils/helper';
import ScreenLoader from '@/components/atoms/ScreenLoader';

function AuthComponentInner() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  const { fullName } = getAuth() || {};

  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sendOtpTimer, setSendOtpTimer] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [purpose, setPurpose] = useState<string | null>('login');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const searchParams = useSearchParams();

  // Check the purpose from localStorage or default to 'login'
  useEffect(() => {
    const storedPurpose = localStorage.getItem('purpose');
    setPurpose(storedPurpose || 'login');
    const storedIsVerified: boolean =
      localStorage.getItem('verified') === 'true' ? true : false;
    // console.log('Verified ==> ', storedIsVerified);
    setIsVerified(storedIsVerified);
  }, []);

  useEffect(() => {
    setEmail(searchParams.get('email'));
  }, [fullName, router, searchParams]);

  useEffect(() => {
    if (sendOtpTimer) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setSendOtpTimer(false);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sendOtpTimer]);

  const formik = useFormik({
    initialValues: { fullName: '', otp: '', accountType: 'individual', organizationName: '' },
    validate: (values) => {
      const errors: { otp?: string; fullName?: string; accountType?: string; organizationName?: string } = {};
      if (purpose === 'register') {
        if (!values.fullName) {
          errors.fullName = 'Full Name is required!';
        } else if (!/^[A-Za-z\s]+$/.test(values.fullName)) {
          errors.fullName = 'Only letters allowed';
        } else if ((values.fullName.match(/[A-Za-z]/g) || []).length < 1) {
          errors.fullName = 'At least 1 letters required';
        }
      }
      if (!values.otp) {
        errors.otp = 'OTP is required!';
      } else if (!/^\d{6}$/.test(values.otp)) {
        errors.otp = 'OTP must be exactly 6 digits';
      }

      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await verifyOtp({
          fullName: values.fullName,
          email,
          code: values.otp,
          type: values.accountType,
          organizationName: values.organizationName,
        }).unwrap();
        setSuccess(`Logged in with ${email}`);
        const redirect = localStorage.getItem('redirectUrl');
        router.push(redirect || '/dashboard');
        localStorage.removeItem('redirectUrl');
        dispatch(setToken(response?.data?.token));
        setError('');
      } catch (err: any) {
        const errorMsg =
          err?.data?.message || err?.message || 'An unexpected error occurred!';
        setError(errorMsg);
        setSuccess('');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const resendOtpHandler = async () => {
    try {
      const res = await resendOtp({ email });
      if (res?.data?.status === 200) {
        toast.success(res.data.message);
      } else {
        const errorMessage =
          res?.data?.message ||
          'OTP request limit exceeded. Please wait for 10 minutes.';
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred!';
      toast.error(errorMessage);
    } finally {
      setSendOtpTimer(true);
    }
  };

  return (
    <div className="bg-[#1a1830] overflow-y-hidden md:h-full min-h-screen">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 w-full">
          <Link href={`/`}>
            <Image src={Logo} width={50} alt="/" />
          </Link>
        </div>

        <div className=" 2xl:h-[calc(100vh_-_59.8px)] flex flex-col lg:flex-row items-center justify-between bg-[#1a1830] text-white">
          {/* Left Part with Background Image */}
          <div className="items-center justify-center w-[60%] flex">
            <div className="hidden relative md:flex items-center justify-center">
              <Image
                src={LoginImage}
                alt="/"
                width={450}
                height={450}
                className="opacity-80 rounded-lg shadow-[0_0_30px_rgba(123,31,162,0.25)]"
              />
              <div className="absolute flex flex-col items-center text-center">
                <Image
                  src={Logo}
                  alt="Post Buddy AI Logo"
                  width={130}
                  height={130}
                  className="mb-6 animate-pulse"
                />
                <p className="text-white text-lg md:text-3xl font-semibold leading-snug">
                  Supercharge Your Social Engagement in Seconds with
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-4xl font-bold mt-2">
                  Post Buddy AI
                </p>
              </div>
              <div className="bg-[#45296b] h-[250px] w-[250px] blur-[120px] absolute left-0 bottom-[10%]"></div>
              <div className="bg-[#00312b] h-[250px] w-[250px] blur-[220px] absolute right-0 top-[10%]"></div>
            </div>
          </div>

          {/* Right Part */}
          <div className="w-[90%] md:w-[40%] h-[60vh] md:h-auto px-6 md:px-12 flex lg:flex-col lg:justify-start justify-center items-center 2xl:items-start lg:h-auto bg-[#252342] shadow-lg rounded-xl md:bg-transparent md:shadow-none">
            <div className="space-y-6">
              <div className="flex md:hidden gap-2 items-center justify-center">
                <Image src={Logo} width={50} alt="/" />
                <h2 className="gradient-text text-3xl text-center font-Poppins font-semibold">
                  Post Buddy
                </h2>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-light text-purple-200">Verify your account</h4>
                <h3 className="text-3xl font-bold">Enter OTP</h3>
                <span className="text-xl font-light text-purple-200">
                  {email && <p className="text-green-400 bg-green-400/10 text-sm my-4 p-2 rounded-lg text-center">OTP sent to {email} </p>}
                </span>
              </div>

              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                {
                  purpose === 'register' && (
                    <div>
                      <input
                        type="hidden"
                        name="accountType"
                        value="individual"
                        onChange={() => { }}
                      />

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="organization"
                          className='cursor-pointer'
                          checked={formik.values.accountType === 'organization'}
                          onChange={(event) => formik.setFieldValue('accountType', event.currentTarget.checked ? 'organization' : 'individual')}
                          label="Create an Organization Account"
                          color="violet"
                          styles={{
                            label: { color: 'white', cursor: 'pointer' }
                          }}
                        />
                      </div>

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${formik.values.accountType === 'organization' ? 'max-h-24 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                        <input
                          placeholder="Enter Organization Name"
                          value={formik.values.organizationName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            formik.setFieldValue('organizationName', e.target.value)
                          }
                          className={`w-full px-5 py-3 bg-[#1a1830] border-2 border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-400`}
                          required={formik.values.accountType === 'organization'}
                        />
                        {formik.touched.organizationName && formik.errors.organizationName && (
                          <div className="text-red-500 text-sm">
                            {formik.errors.organizationName}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                }
                {/* Conditionally render fullName input */}
                {!isVerified && (
                  <div className="flex flex-col gap-2">
                    <input
                      placeholder="Enter Full Name"
                      className={`w-full px-5 py-3 bg-[#1a1830] border-2 border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-400`}
                      value={formik.values.fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        formik.setFieldValue('fullName', e.target.value)
                      }
                      required={!isVerified}
                    />
                    {/* <button
                      type="button"
                      className="text-end"
                      // onClick={() => UserName()}
                    >
                      Generate Name
                    </button> */}
                    {formik.touched.fullName && formik.errors.fullName && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.fullName}
                      </div>
                    )}
                  </div>
                )}

                <PinInput
                  className='focus:border-b-[#7b6ef6]'
                  value={formik.values.otp}
                  onChange={(value: string) =>
                    formik.setFieldValue('otp', value)
                  }
                  gap={30}
                  length={6}
                  type={/^[0-9]*$/}
                  inputType="number"
                  inputMode="numeric"
                  onComplete={() => formik.handleSubmit()}
                  styles={() => ({
                    input: {
                      width: '3rem',
                      height: '3.5rem',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                      borderRadius: 0,
                      border: 'none',
                      borderBottom: '2px solid #4c4a6e',
                      backgroundColor: 'transparent',
                      color: 'white',
                      margin: '0 0.25rem',
                      boxShadow: 'none',
                      '&&:focus': {
                        borderBottom: '2px solid #7b6ef6 !important',
                        outline: 'none',
                        backgroundColor: 'transparent',
                      },
                    },
                  })}
                />
                {formik.touched.otp && formik.errors.otp && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.otp}
                  </div>
                )}

                <div className="flex items-end w-full justify-end">
                  <button
                    className={`hover:underline mt-4 ${sendOtpTimer
                      ? 'cursor-not-allowed text-gray-400'
                      : 'cursor-pointer'
                      }`}
                    type="button"
                    onClick={resendOtpHandler}
                    disabled={sendOtpTimer}
                  >
                    {sendOtpTimer
                      ? `Resend OTP in ${countdown}s`
                      : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl transition duration-500 h-[50px] flex justify-center items-center font-semibold shadow-lg shadow-purple-700/30 text-white"
                >
                  {isLoading ? (
                    <Loader color="white" size={'sm'} />
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </form>

              {error && <p className="text-red-500 mt-4">{error}</p>} 
              {success && <p className="text-green-500">{success}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthComponent() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Verify OTP</title>
      </head>
      <Suspense fallback={<ScreenLoader />}>
        <AuthComponentInner />
      </Suspense>
    </>
  );
}
