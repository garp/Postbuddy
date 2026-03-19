import Footer from '@/components/molecules/Home/Footer';
import Navbar from '@/components/molecules/Home/Navbar';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'About Us | PostBuddy AI',
  description:
    'Learn more about PostBuddy AI, your trusted partner in crafting meaningful social media engagement. Discover our vision, story, and why we are the go-to solution for AI-powered social media tools.',
  keywords:
    'About PostBuddy AI, social media engagement, AI-powered tools, meaningful connections, social media strategy, online presence, customizable AI, social media interaction, PostBuddy story, social media insights',
};

export default function page() {
  return (
    <>
      <head>
        <title>PostBuddy AI - About Us</title>
      </head>
      <div className="bg-[#110f1b] h-screen overflow-x-hidden w-screen">
        <Navbar />
        <div className="my-4">
          <h2 className="gradient-text text-4xl text-center font-Poppins font-semibold">
            About us
          </h2>
          <p className="text-center text-2xl my-4">
            Our Experts are like no other
          </p>
          <div>{/*Image div */}</div>
          <div className="flex w-[90%] flex-col items-center justify-center mx-auto text-xl gap-8">
            <h3 className="">
              <span className="text-[#A877E9]">Welcome to postbuddy.ai</span> -
              Your trusted partner in crafting meaningful social media engagement
            </h3>
            <div className="w-[80%]">
              <h4 className="text-[#A877E9]">Who Are We?</h4>
              <p className="text-lg pr-4">
                At Postbuddy.ai, we believe in the power of connection. Our
                mission is to help individuals and businesses foster genuine
                conversations on social media platforms like LinkedIn, Instagram,
                and beyond.
                <br />
                Leveraging cutting-edge AI technology, we specialize in generating
                insightful, contextually relevant, and engaging comments tailored
                to your voice and audience. Whether you&apos;re networking,
                promoting your brand, or simply staying active online,
                Postbuddy.ai makes it easy to keep the conversation going.
              </p>
            </div>

            <div className="w-[80%]">
              <h4 className="text-[#A877E9]">Our Vision</h4>
              <p className="text-lg pr-4">
                To revolutionize how people interact on social media by providing
                tools that make engagement effortless, impactful, and authentic.
              </p>
            </div>

            <div className="w-[80%]">
              <h4 className="text-[#A877E9]">Why Choose Postbuddy.ai</h4>
              <ul>
                <li>
                  AI-Powered Engagement: Our algorithms are designed to understand
                  context and tone, delivering comments that resonate with your
                  audience.
                </li>
                <li>
                  Time-Saving: Spend less time brainstorming responses and more
                  time focusing on your goals.
                </li>
                <li>
                  Customizable Responses: Tailor our AI&apos;s output to match
                  your style, ensuring authenticity in every interaction.
                </li>
              </ul>
            </div>

            <div className="w-[80%]">
              <h4 className="text-[#A877E9]">Our Story</h4>
              <p>
                Postbuddy.ai was founded by a team of social media enthusiasts, AI
                experts, and creatives who saw a need for smarter, more efficient
                ways to engage online. Frustrated by the time and effort required
                to craft meaningful comments, we set out to build a solution that
                combines the speed of technology with the human touch of
                thoughtful interaction. Since then, we&apos;ve helped countless
                users enhance their social media presence and build stronger
                relationships online.
              </p>
            </div>

            <Link
              href="/contactus"
              className="w-[80%] flex justify-center rounded-lg bg-[#783ec8] mx-auto px-auto py-2 font-Poppins mb-8 hover:bg-[#6130a6] duration-300 ease-in-out"
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
