import Navbar from '@/components/molecules/Home/Navbar';
import ProductMain from './ProductMain';
import Footer from '@/components/molecules/Home/Footer';

export const metadata = {
  title: 'Our Products | PostBuddy AI',
  description:
    'Discover our range of innovative AI-driven tools and products. Explore features, benefits, and how they can help enhance your social media management experience.',
  keywords:
    'PostBuddy AI products, AI tools for social media, social media management tools, PostBuddy product features, AI-driven social media tools, innovative AI products, product listing PostBuddy, explore PostBuddy tools',
};

export default function Products() {
  return (
    <>
      <head>
        <title>PostBuddy AI - Products</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen">
        <Navbar />
        <ProductMain />
        <Footer />
      </div>
    </>
  );
}
