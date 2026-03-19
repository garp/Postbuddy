'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAuth } from '@/utils/helper';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineChrome } from 'react-icons/ai';
import { IoClose, IoChevronUpOutline } from 'react-icons/io5';
import Logo from '@/assets/postbuddy-logo.png';
import credsBg from '@/assets/creds-bg.png';
import { useGetCredsQuery } from '@/redux/api/services/apiKey';
import { useGetUserQuery } from '@/redux/api/services/authApi';
import { Avatar, Loader } from '@mantine/core';

const dropdownItems = [
  { label: 'FAQ', href: '/#faqs' },
  { label: 'Product Roadmap', href: '/product-roadmap' },
  { label: 'Release Notes', href: '/release-notes' },
];



const NavLink = ({ href, children, currentPath }: { href: string; children: React.ReactNode; currentPath: string }) => (
  <li className="relative">
    <Link href={href}>{children}</Link>
    <div className={`${currentPath === href ? '' : 'hidden'} h-[2px] w-full bg-[#5f40ab] absolute`}></div>
  </li>
);

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);

  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const authData = useMemo(() => getAuth(), []);
  const [fullName, setFullName] = useState(authData?.fullName || '');

  const { data } = useGetCredsQuery({}, { skip: !fullName });
  const { data: userInfo, isLoading } = useGetUserQuery({}, { skip: !fullName });

  const creds = data?.data;
  const user = userInfo?.data;
  const firstName = useMemo(() => user?.fullName?.split(' ')[0], [user?.fullName]);

  const toolsItems = [
    { label: 'Brand Voice', href: `/brand-voice/${authData?._id}` },
  ]

  const handleScrollToFeatures = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      const featuresSection = document.getElementById('features');
      featuresSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#features');
    }
  }, [pathname, router]);

  useEffect(() => {
    setFullName(authData?.fullName || '');
  }, [pathname, authData?.fullName]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const redirect = searchParams?.get('redirect');
    const hasEmail = Boolean(authData?.email);

    if (redirect === 'extension' && !hasEmail) {
      setTimeout(() => {
        const cleanUrl = pathname;
        window.history.replaceState(null, '', cleanUrl);
        window.location.reload();
      }, 600);
    }
  }, [searchParams, pathname, authData?.email]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleDesktopDropdown = useCallback((state: boolean) => {
    setDropdownOpen(state);
  }, []);

  const itemsDesktopDropdown = useCallback((state: boolean) => {
    setToolsDropdownOpen(state);
  }, []);

  const toggleMobileDropdown = useCallback(() => {
    setDropdownMobileOpen(prev => !prev);
  }, []);

  const isLoggedIn = !!fullName;

  return (
    <div className="">
      {/* Desktop Navbar */}
      <div className="flex items-center justify-between w-[90%] px-8 py-4 mx-auto rounded-lg mt-4 navbar backdrop-blur-sm z-50">
        <Link href="/" className="flex items-end gap-2">
          <Image src={Logo} alt="PostBuddy Logo" width={32} height={32} priority />
          <p className="gradient-text">PostBuddy AI</p>
        </Link>

        <ul className="lg:flex gap-8 font-Poppins hidden">
          <li className="relative">
            <button onClick={handleScrollToFeatures}>Features</button>
            <div className={`${pathname === '/' ? '' : 'hidden'} h-[2px] w-full bg-[#5f40ab] absolute`} />
          </li>

          <NavLink href="/blogs" currentPath={pathname}>Blogs</NavLink>

          {isLoggedIn && (
            <>
              <NavLink href="/dashboard" currentPath={pathname}>Dashboard</NavLink>
              <NavLink href="/setup" currentPath={pathname}>Setup</NavLink>
            </>
          )}

          <NavLink href="/plans" currentPath={pathname}>Pricing</NavLink>

          <li
            className="relative"
            onMouseEnter={() => toggleDesktopDropdown(true)}
            onMouseLeave={() => toggleDesktopDropdown(false)}
          >
            <button className="flex items-center gap-2 hover:scale-100">
              Resource
              <IoChevronUpOutline className={`text-white text-[20px] font-bold transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="w-[180px] absolute top-6 left-0 bg-[#252342] shadow-lg rounded-xl p-2">
                <ul>
                  {dropdownItems.map((item) => (
                    <li key={item.href} className="py-1">
                      <Link href={item.href} className="block text-white hover:text-[#5f40ab]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>

          <li
            className="relative"
            onMouseEnter={() => itemsDesktopDropdown(true)}
            onMouseLeave={() => itemsDesktopDropdown(false)}
          >
            <button className="flex items-center gap-2 hover:scale-100">
              Tools
              <IoChevronUpOutline className={`text-white text-[20px] font-bold transition-transform duration-500 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {toolsDropdownOpen && (
              <div className="w-[180px] absolute top-6 left-0 bg-[#252342] shadow-lg rounded-xl p-2">
                <ul>
                  {toolsItems.map((item) => (
                    <li key={item.href} className="py-1">
                      <Link href={item.href} className="block text-white hover:text-[#5f40ab]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Desktop Auth Section */}
        <ul className="hidden lg:flex gap-2 items-center">
          {isLoggedIn && pathname !== '/' && (
            <div
              className="relative flex items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${credsBg.src})` }}
            >
              <Image src={credsBg} width={100} height={40} alt="Credits background" priority />
              <div className="absolute">{creds ?? 0} Creds</div>
            </div>
          )}

          <li className='flex items-center gap-1'>
            <a
              className="lg:flex items-center gap-1 hidden"
              href="https://chromewebstore.google.com/detail/postbuddy/ffiheeeepmiobmpefjencmcmfeokkkhm?hl=en-US&utm_source=ext_sidebar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineChrome className="text-xl" />
              {pathname === '/' && 'Add to Chrome'}
            </a>
          </li>

          {isLoggedIn ? (
            <li className="flex items-center gap-1 relative">
              {isLoading ? (
                <Loader size="xs" color="white" />
              ) : (
                <Link href="/dashboard" className='flex items-center gap-1'>
                  {user?.profileUrl && (
                    <Image
                      src={user.profileUrl}
                      alt="User profile"
                      width={24}
                      height={24}
                      className="rounded-full border border-gray-300 w-[28px] h-[28px]"
                    />
                  )}
                  {firstName}
                </Link>
              )}
            </li>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="flex lg:hidden cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? null : <GiHamburgerMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[999] bg-black bg-opacity-75 backdrop-blur-sm transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-0 right-0 p-4">
          <IoClose
            className="text-white text-[30px] cursor-pointer"
            onClick={toggleMobileMenu}
          />
        </div>

        <div className="flex flex-col items-center justify-center h-full text-white">
          <ul className="flex flex-col gap-6 text-lg font-Poppins items-center">
            <li className="hover:underline relative">
              <button onClick={handleScrollToFeatures}>Features</button>
              <div className={`${pathname === '/' ? '' : 'hidden'} h-[2px] w-full bg-[#5f40ab] absolute`} />
            </li>

            <NavLink href="/blogs" currentPath={pathname}>Blogs</NavLink>

            {isLoggedIn && (
              <>
                <NavLink href="/dashboard" currentPath={pathname}>Dashboard</NavLink>
                <NavLink href="/setup" currentPath={pathname}>Setup</NavLink>
              </>
            )}

            <NavLink href="/plans" currentPath={pathname}>Pricing</NavLink>

            <li className="relative">
              <button
                onClick={toggleMobileDropdown}
                className="flex items-center gap-2"
              >
                Resource
                <IoChevronUpOutline className={`text-white text-[20px] font-bold transition-transform duration-500 ${dropdownMobileOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownMobileOpen && (
                <div className="w-[180px] bg-[#252342] shadow-lg rounded-xl mt-2 p-2">
                  <ul>
                    {dropdownItems.map((item) => (
                      <li key={item.href} className="py-1">
                        <Link
                          href={item.href}
                          className="block text-white hover:text-[#5f40ab]"
                          onClick={toggleMobileMenu}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            <li>
              {isLoggedIn ? (
                <div className="flex items-center gap-1 h-12 w-12">
                  {user?.profileUrl ? (
                    <Image
                      src={user.profileUrl}
                      alt="User profile"
                      width={24}
                      height={24}
                      className="rounded-full border border-gray-300 w-[40px] h-[40px]"
                    />
                  ) : <Avatar size="sm" color="violet" radius="xl">{firstName}</Avatar>}
                  <Link href="/dashboard">{firstName}</Link>
                </div>
              ) : (
                <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}