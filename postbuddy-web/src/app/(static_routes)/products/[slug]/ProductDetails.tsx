'use client';
import React, { useEffect, useState } from 'react';
import Plans from '@/components/molecules/Home/Plans';
import FAQs from '@/components/molecules/Home/FAQs';
import SingleFeature from '@/components/molecules/product/SingleFeature';

import { BsStars } from 'react-icons/bs';
import { BsBrowserChrome } from 'react-icons/bs';
import CustomerReviews from '@/components/molecules/product/CustomerReviews';
import Highlights from '@/components/molecules/Home/Hightlights';
import axios from 'axios';

interface ProductDetailsProps {
  params: {
    slug: string;
  };
}

const ProductDetails = ({ params }: ProductDetailsProps) => {
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const slug = params.slug;
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  console.log('🚀 ~ ProductDetails ~ slug:', slug);

  // Fetch product data based on slug
  const fetchProductData = async () => {
    const slugTitle = slug.replaceAll('-', '%20');
    try {
      const response = await axios.get(
        `${baseUrl}/api/products-categories?filters[Product_title][$eq]=${slugTitle}&populate=*`,
      );
      setProductData(response?.data?.data[0]);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!productData) {
    return <div>No product found.</div>;
  }

  return (
    <div className="pt-5 sm:pb-12 sm:pt-5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className=" text-center md:p-6">
          {/* Badge */}
          {/* <div className="flex justify-center mb-4">
            <div className="text-sm bg-blue-100 text-blue-600 px-4 py-1 rounded-full">
              Product of the day <span className="font-bold">5th</span>
            </div>
          </div> */}

          {/* Title */}

          <h1 className="text-[30px] lg:text-[60px] font-extrabold  gradient-text mb-4">
            {productData?.Product_title}
          </h1>

          {/* Description */}
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            {productData?.Product_description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            <button className="flex items-center justify-center gap-1 bg-[#5f40ab] text-white font-medium py-3 px-6 rounded-[8px] hover:bg-purple-700 transition">
              <BsStars />
              Get Lifetime Access
            </button>
            <button className="flex items-center gap-1 justify-center bg-white gradient-text border border-gray-300 font-medium py-3 px-6  rounded-[8px] hover:border-gray-400 transition">
              <BsBrowserChrome />
              Start for Free
            </button>
          </div>

          {/* Customer Info */}
          {/* <p className="text-white mb-12">
            <span className="text-green-600 font-medium">
              🎁 2763 customers
            </span>{' '}
            •{' '}
            <span className="text-green-600">$20 off for next 7 customers</span>{' '}
            •<span className="text-green-600"> 7-day refund</span>
          </p> */}

          {/* Features Section */}
          {/* <div className="flex justify-center items-center gap-6">
            <div className="text-center">
              <Image
                src="/manual-mode-icon.png"
                alt="Manual Mode"
                width={80}
                height={80}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-sm text-gray-500">Manual Mode</p>
            </div>
            <div className="text-center">
              <Image
                src="/Postbuddy-mode-icon.png"
                alt="Postbuddy Mode"
                width={80}
                height={80}
                className="w-12 h-12 mx-auto mb-2"
              />
              <p className="text-sm text-gray-500">Postbuddy Mode</p>
            </div>
          </div> */}

          {/* Trust Section */}
          <p className="mt-12 text-white font-semibold text-[25px]">
            Trusted by over <span className="text-blue-600">60+</span> companies
            & agencies around the World
          </p>
        </div>

        <Highlights />
        <SingleFeature />
        <div className="mt-20">
          <Plans />
          <FAQs />
          <CustomerReviews />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
