'use client';
import React from 'react';
import { useFormik } from 'formik';
import Navbar from '@/components/molecules/Home/Navbar';
import { FaBuilding, FaUsers, FaHeadset } from 'react-icons/fa';
import { validationTalkToSalesForm } from '@/validators';
import { useTalkToSalesMutation } from '@/redux/api/services/admin/contactus';
import toast from 'react-hot-toast';
import { Loader } from '@mantine/core';
export default function ContactUs() {
  const [createForm, { isLoading }] = useTalkToSalesMutation();
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      companyName: '',
      teamSize: '',
      message: '',
    },
    validationSchema: validationTalkToSalesForm,
    onSubmit: async (values) => {
      if (isLoading) return;
      try {
        await createForm(values).unwrap();
        // console.log('Form data submitted', values);
        toast.success('Message sent successfully');
        formik.resetForm();
      } catch (error: any) {
        console.log('Error', error.message);
        toast.error('Failed to send message');
      }
    },
  });

  return (
    <>
      <head>
        <title>PostBuddy AI - Talk to Sales</title>
      </head>
      <div>
        <div className="bg-[#110f1b] h-full pt-4 text-white relative">
          <Navbar />
          {/* Gradient Background Effect */}
          <div className="bg-[#AA72FE] h-[200px] w-[400px] blur-[300px] absolute left-0 top-[40%]"></div>
          <div className="bg-[#00312b] h-[200px] w-[200px] blur-[220px] absolute right-0 top-[40%]"></div>

          <div className="max-w-4xl mx-auto mt-12">
            <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">
              Talk to Sales
            </h1>
            <p className="text-gray-400 text-sm mb-8 text-center">
              Learn how Postbuddy.ai can transform your social media engagement
              and content strategy
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#1c1a29] p-6 rounded-lg">
                <FaBuilding className="text-purple-400 text-3xl mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-purple-300">
                  Enterprise Solutions
                </h2>
                <p className="text-gray-300">
                  Custom solutions for large-scale social media operations
                </p>
              </div>

              <div className="bg-[#1c1a29] p-6 rounded-lg">
                <FaUsers className="text-purple-400 text-3xl mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-purple-300">
                  Team Collaboration
                </h2>
                <p className="text-gray-300">
                  Multi-user access and advanced team features
                </p>
              </div>

              <div className="bg-[#1c1a29] p-6 rounded-lg">
                <FaHeadset className="text-purple-400 text-3xl mb-4" />
                <h2 className="text-xl font-semibold mb-2 text-purple-300">
                  Dedicated Support
                </h2>
                <p className="text-gray-300">
                  Priority support and personalized onboarding
                </p>
              </div>
            </div>

            <form
              className="bg-[#1c1a29] p-8 rounded-lg"
              onSubmit={formik.handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your Name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-4 bg-[#110f1b] rounded-lg text-gray-300 w-full"
                    required
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.fullName}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Work Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-4 bg-[#110f1b] rounded-lg text-gray-300 w-full"
                    required
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-4 bg-[#110f1b] rounded-lg text-gray-300 w-full"
                    required
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.companyName}
                    </div>
                  )}
                </div>

                <div>
                  <select
                    name="teamSize"
                    value={formik.values.teamSize}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="p-4 bg-[#110f1b] rounded-lg text-gray-300 w-full"
                    required
                  >
                    <option value="">Team Size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201+">201+</option>
                  </select>
                  {formik.touched.teamSize && formik.errors.teamSize && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.teamSize}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Tell us about your needs and how we can help"
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full p-4 bg-[#110f1b] rounded-lg text-gray-300 mb-6"
                  rows={4}
                  required
                />
                {formik.touched.message && formik.errors.message && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.message}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center w-full">
                <button
                  type="submit"
                  className="px-12 w-full md:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-700 transition rounded-xl py-3 text-white font-semibold text-center"
                  disabled={!formik.isValid || isLoading}
                >
                  {isLoading ? (
                    <Loader color="white" size={'sm'} />
                  ) : (
                    'Contact Sales'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
