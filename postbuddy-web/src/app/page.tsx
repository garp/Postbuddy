/* eslint-disable import/no-unresolved */
import Benefits from '@/components/molecules/Home/Benefits';
import Companies from '@/components/molecules/Home/Companies';
import Description from '@/components/molecules/Home/Description';
import FAQs from '@/components/molecules/Home/FAQs';
import Features from '@/components/molecules/Home/Features';
import Footer from '@/components/molecules/Home/Footer';
import Hero from '@/components/molecules/Home/Hero';
import Hightlights from '@/components/molecules/Home/Hightlights';
import Navbar from '@/components/molecules/Home/Navbar';
import Plans from '@/components/molecules/Home/Plans';

export const metadata = {
  title: 'PostBuddy AI - Social Media Management Simplified',
  description:
    'PostBuddy AI is your ultimate solution for managing social media interactions. Automate comments, enhance engagement, and simplify your workflow with AI-powered features.',
  keywords:
    'PostBuddy AI, social media management, automate social media comments, social media engagement, AI-powered social tools, social media workflow automation, social media marketing tools',
};

export default function page() {
  return (
    <div className="bg-[#110f1b] min-h-screen overflow-x-hidden">
      <div className='sticky top-0 z-[999]'>
        <Navbar />
      </div>
      <Hero />
      <Features />
      <Companies />
      <Hightlights />
      <Description />
      <Plans />
      <FAQs />
      <Benefits />
      <Footer />
    </div>
  );
}
