import React from 'react';
import BlogsMain from './BlogsMain';
import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';

export const metadata = {
  title: 'PostBuddy AI | Amplify Your Social Needs',
  description:
    'Discover how PostBuddy AI transforms your social presence. Explore insights, tools, and strategies to amplify your social media game and elevate your digital engagement.',
  keywords:
    'PostBuddy AI, social media amplification, digital engagement, social media tools, social strategy, online presence, AI-driven social media, technology insights, social media trends',
};

const BlogPage = () => {
  return (
    <>
      <head>
        <title>PostBuddy AI - Blogs</title>
      </head>
      <div className="bg-[#110f1b] pt-1">
        <Navbar />
        <BlogsMain />
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
