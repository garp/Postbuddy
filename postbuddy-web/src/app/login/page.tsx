'use client';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLoginMutation } from '@/redux/api/services/authApi';
import { setToken } from '@/redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import LoginImage from '@/assets/login-page.png';
import Logo from '@/assets/postbuddy-logo.png';
import { Loader } from '@mantine/core';
import { getAuth } from '@/utils/helper';


export default function Auth() {
  const { email } = getAuth() || {};
  const router = useRouter();

  useEffect(() => {
    if (email) {
      router.push('/dashboard');
    }
  }, [email, router]);

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formik = useFormik({
    initialValues: { email: '', organizationName: '' },
    validate: (values) => {
      const errors: { email?: string; organizationName?: string } = {};
      if (!values.email) {
        errors.email = 'Required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
      ) {
        errors.email = 'Invalid email address';
      }
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = {
          email: values.email,
        };
        const response = await login(payload).unwrap();
        localStorage.setItem('verified', response?.data?.isVerified);
        localStorage.setItem('purpose', response?.data?.purpose);
        localStorage.setItem('type', response?.data?.type);
        localStorage.setItem('email', values.email);
        setSuccess(`Verify Otp sent on ${values.email}`);
        dispatch(setToken(response?.data?.token));
        setError('');
        router.push(`/verifyOtp?email=${values.email}`);
      } catch (err: any) {
        setError(err?.data?.message || 'Something went wrong!');
        setSuccess('');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <head>
        <title>PostBuddy AI - Login</title>
      </head>
      <div className="bg-[#1a1830] overflow-y-hidden md:h-full min-h-screen">
        <div className="flex items-center justify-between px-4 py-2 w-full">
          <Link href={'/'}>
            <Image src={Logo} width={50} alt="/" className="hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>
        <div className="2xl:h-[calc(100vh_-_59.8px)] flex flex-col lg:flex-row md:h-full items-center h-[70vh] justify-between bg-[#1a1830] text-white">
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
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-3xl text-center font-Poppins font-semibold">
                  Post Buddy
                </h2>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-light text-purple-200">Get started for free</h4>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Login to your account</h3>
              </div>

              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-6 items-start w-full"
              >
                <div className="w-full">
                  <div className="relative w-full">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      className="w-full px-5 py-3 bg-[#1a1830] border-2 border-purple-500/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-400"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-400 text-sm mt-1 ml-2">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl transition duration-300 h-[50px] flex justify-center items-center font-semibold shadow-lg shadow-purple-700/30 text-white"
                  disabled={formik.isSubmitting || isLoading}
                >
                  {formik.isSubmitting || isLoading ? (
                    <Loader size="sm" color="white" />
                  ) : (
                    'Send Otp'
                  )}
                </button>
              </form>

              {error && <p className="text-red-400 bg-red-400/10 p-3 rounded-lg text-center">{error}</p>}
              {success && <p className="text-green-400 bg-green-400/10 p-3 rounded-lg text-center">{success}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
