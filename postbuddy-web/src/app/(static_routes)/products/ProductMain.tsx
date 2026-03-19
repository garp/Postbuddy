'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { IoSearchSharp } from 'react-icons/io5';
import axios from 'axios';

// Static data for products
// const products = [
//   {
//     id: 1,
//     image: 'https://r2.erweima.ai/i/-YSqQQ3fQDKCR0P_xAyMKQ.png',
//     title: 'LinkedIn Comment Generator',
//     description:
//       'Experience the future with Postbuddy’s AGI Agent. Our advanced artificial general intelligence solution tackles complex business challenges through adaptive learning.',
//   },
//   {
//     id: 2,
//     image: 'https://r2.erweima.ai/i/-YSqQQ3fQDKCR0P_xAyMKQ.png',
//     title: 'Twitter / X Comment Generator',
//     description:
//       'Discover the power of Postbuddy, your AI Agent tailored for social media. Postbuddy excels in automating comment generation, analyzing viral potential, and delivering results.',
//   },
//   {
//     id: 3,
//     image: 'https://r2.erweima.ai/i/-YSqQQ3fQDKCR0P_xAyMKQ.png',
//     title: 'Facebook Comment Generator',
//     description:
//       'Enhance your browsing experience with Postbuddy.social’s AI Chrome Extension. Leverage AI to streamline your online activities.',
//   },
//   {
//     id: 4,
//     image: 'https://r2.erweima.ai/i/-YSqQQ3fQDKCR0P_xAyMKQ.png',
//     title: 'YouTube Comment Generator',
//     description:
//       'Generate actionable insights for your content strategy using Postbuddy’s AI-powered tools for in-depth analysis and engagement tracking.',
//   },

//   {
//     id: 5,
//     image: 'https://r2.erweima.ai/i/-YSqQQ3fQDKCR0P_xAyMKQ.png',
//     title: 'Instagram Comment Generator',
//     description:
//       'Generate actionable insights for your content strategy using Postbuddy’s AI-powered tools for in-depth analysis and engagement tracking.',
//   },
// ];

type Category = {
  id: number;
  Product_title: string;
  common_image: {
    url: string;
  };
  Product_description: string;
};

type Product = {
  id: number;
  Product_title: string;
  Product: string;
  common_image: {
    url: string;
  };
  products_categories: Category[];
};

const ProductMain = () => {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_STRAPI_BASE_URL;

  const formatSlug = (title: string) =>
    title
      // .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products?populate=*`);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-5 md:px-10 lg:px-[112px] my-10">
      {products.length > 0 && (
        <div className="items-center xl:w-[50%] mx-auto">
          <h1 className="text-center text-[30px] md:text-[40px] font-bold gradient-text mb-4">
            {products[0]?.Product_title}
          </h1>
          <p className="text-center text-lg text-white mb-10">
            {products[0]?.Product}
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex justify-center mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="border border-gray-300 text-black rounded-[8px] px-4 py-2 w-96 focus:outline-none focus:ring-2 focus:ring-[#5f40ab] focus:border-transparent pl-10"
          />
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <IoSearchSharp />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          // products.map((product: Product) => (
          products[0]?.products_categories?.map((category: Category) => (
            <div
              key={category.id}
              className="shadow-lg rounded-[8px] hover:scale-105 transition-transform cursor-pointer"
              onClick={() =>
                router.push(`/products/${formatSlug(category?.Product_title)}`)
              }
            >
              {products.map((product: Product) => (
                <Image
                  key={product.id}
                  src={`${baseUrl}${product?.common_image?.url}`}
                  alt={product?.products_categories[0]?.Product_title}
                  width={400}
                  height={160}
                  className="rounded-lg object-cover w-full h-40 rounded-t-[8px]"
                />
              ))}
              <div className="bg-white p-5 rounded-b-[8px]">
                <h2 className="text-lg font-semibold text-gray-900">
                  {category?.Product_title}
                </h2>
                <p className="text-gray-700 text-sm mt-2">
                  {category?.Product_description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductMain;
