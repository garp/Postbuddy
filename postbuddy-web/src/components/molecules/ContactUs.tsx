'use client';
import { useEffect, useState } from 'react';
import { useContactusMutation } from '@/redux/api/services/admin/contactus';
import { Loader } from '@mantine/core';
import toast from 'react-hot-toast';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validationContactusForm } from '@/validators';
import { useGetUserQuery } from '@/redux/api/services/authApi';

export default function ContactUs() {
  const [contactUs, { isLoading }] = useContactusMutation();

  // const token = localStorage.getItem('token');

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const { data: userInfo, isLoading: isUserLoading } = useGetUserQuery(
    {},
    { skip: token === null },
  );

  const user = userInfo?.data;

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: any) => {
    console.log('Valuess ==>', values);
    try {
      await contactUs(values).unwrap();
      toast.success('Message sent successfully');
      resetForm(); // Reset form after successful submission
    } catch (err) {
      console.error('Failed to send message', err);
      toast.error('Failed to send message');
    }
  };

  // Show a loading indicator while fetching user data
  if (isUserLoading) {
    return <Loader color="white" size={'lg'} />;
  }
  return (
    <Formik
      initialValues={{
        fullName: user?.fullName || '',
        email: user?.email || '',
        subject: '',
        message: '',
      }}
      validationSchema={validationContactusForm}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="w-[75%] space-y-4">
          {/* Full Name Field */}
          <div>
            <Field
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              value={userInfo?.data?.fullName}
              className="w-full p-3 rounded-[8px] bg-transparent border border-[#5f4d97] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <ErrorMessage
              name="fullName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Email Field */}
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              required
              value={userInfo?.data?.email}
              className="w-full p-3 rounded-[8px] bg-transparent border border-[#5f4d97] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field
              type="text"
              name="subject"
              placeholder="Subject"
              required
              className="w-full p-3 rounded-[8px] bg-transparent border border-[#5f4d97] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <ErrorMessage
              name="subject"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field
              as="textarea"
              name="message"
              placeholder="Message"
              required
              className="w-full p-3 rounded-[8px] bg-transparent border border-[#5f4d97] focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[120px]"
            />
            <ErrorMessage
              name="message"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex items-center justify-center w-full">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-12 w-full md:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 text-white font-semibold text-center"
            >
              {isLoading || isSubmitting ? (
                <Loader color="white" size={'sm'} />
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
