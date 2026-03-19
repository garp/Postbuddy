import Subscribe from '@/components/atoms/buttons/Subscribe';
import Link from 'next/link';
import React from 'react';
// import { BsTwitterX } from 'react-icons/bs';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const link = [
    'LinkedIn Comment Generator',
    'Twitter or X Comment Generator',
    'Facebook Comment Generator',
    'YouTube Comment Generator',
    'Instagram Comment Generator',
    'All Products',
  ];
  const formatSlug = (title: string) =>
    title
      // .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');

  return (
    <footer className=" bg-[#07060e] text-gray-400 p-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Products Section */}
        <div className="">
          <h3 className="text-white text-lg font-semibold mb-4">Products</h3>
          <ul className="space-y-2  flex flex-col">
            {link.map((i, index) => (
              <Link
                key={index}
                href={`/products/${link[index] === 'All Products' ? '' : formatSlug(i)}`}
                className="hover:underline"
              >
                {i}
              </Link>
            ))}
          </ul>
        </div>

        <div className="flex md:hidden items-start">
          <div className="w-[80%]">
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 flex flex-col">
              <Link href={'/blogs'}>Blogs</Link>
              <Link href={'/plans'}>Pricing</Link>
              <Link href="/feature-request">Feature Requests</Link>
              <Link href="/report-bug">Report bug</Link>
              <Link href={'/#faqs'}>FAQ</Link>
              <Link href="/release-notes">Release Notes</Link>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="w-[80%]">
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/setup">How to Use?</Link>
              </li>
              <li>
                <Link href="/privacy-policy">Privacy</Link>
              </li>
              <li>
                <Link href="/terms">Terms</Link>
              </li>
              <li>
                <Link href="/refund">Refund</Link>
              </li>
              <li>
                <Link href="/contactus">Contact us</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Company Section */}
        <div className="hidden md:flex md:flex-col w-[80%]">
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 flex flex-col">
            <Link href={`/blogs`}>Blogs</Link>
            <Link href={'/plans'}>Pricing</Link>
            <Link href="/feature-request">Feature Requests</Link>
            <Link href="/report-bug">Report bug</Link>
            <Link href={'/#faqs'}>FAQ</Link>
            <Link href="/release-notes">Release Notes</Link>
          </ul>
        </div>

        {/* Legal Section */}
        <div className="w-[80%] hidden md:flex md:flex-col">
          <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/setup">How to Use?</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
            <li>
              <Link href="/refund">Refund</Link>
            </li>
            <li>
              <Link href="/contactus">Contact us</Link>
            </li>
          </ul>
        </div>
        <div className="flex w-full justify-center">
          <Subscribe />
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 gap-4 flex flex-col">
        <ul className="flex sm:flex text-4xl gap-4 items-center justify-center text-white">
          {/* <a href="https://github.com/bytive" target="_blank">
            <FaGithub />
          </a> */}
          {/* <li><FaDiscord /></li> */}
          {/* <a href="https://bytive.in" target="_blank">
            <BsTwitterX />
          </a> */}
          <a
            href="https://www.linkedin.com/showcase/postbuddy-ai/about/"
            target="_blank"
          >
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/postbuddy.ai/" target="_blank">
            <FaInstagram />
          </a>
        </ul>
        <p>License © 2025 PostBuddy, <br />A product of{" "}
          <a href="https://bytive.in/" className='text-[#aa88ff]' target="_blank" rel="noopener noreferrer">
            Bytive Technologies Pvt Ltd
          </a></p>
      </div>
      <div className="flex relative">
        <div className="bg-[#FE8572] h-[100px] w-[100px] blur-[100px] absolute -bottom-24 -left-24"></div>
        <div className="bg-[#6124FF] h-[100px] w-[100px] blur-[100px] absolute -bottom-24 -right-24"></div>
      </div>
    </footer>
  );
};

export default Footer;
