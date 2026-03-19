import React from 'react';
import ProductDetails from './ProductDetails';
import Navbar from '@/components/molecules/Home/Navbar';
import Footer from '@/components/molecules/Home/Footer';

const page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  return (
    <>
      <head>
        <title>PostBuddy AI - Product Details</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen">
        <Navbar />
        <ProductDetails params={{ slug }} />
        <Footer />
      </div>
    </>
  );
};

export default page;
