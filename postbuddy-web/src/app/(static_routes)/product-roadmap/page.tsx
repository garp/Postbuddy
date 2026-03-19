import React from 'react';
import ProductRoadmapMain from './ProductRoadmapMain';
import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';

export const metadata = {
  title: 'Product Roadmap | PostBuddy AI',
  description:
    'Explore the latest features, updates, and improvements planned for PostBuddy AI. Stay informed about ongoing developments and future enhancements.',
  keywords:
    'PostBuddy AI roadmap, product updates, new features, planned features, progress updates, product roadmap PostBuddy, development roadmap, PostBuddy improvements, user feedback features',
};

const ProductRoadmap = () => {
  return (
    <>
      <head>
        <title>PostBuddy AI - Roadmap</title>
      </head>
      <div className="bg-[#110f1b] pt-5 overflow-x-hidden">
        <Navbar />
        <ProductRoadmapMain />
        <Footer />
      </div>
    </>
  );
};

export default ProductRoadmap;
