'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import emoji from '@/assets/star-eyed-smiling-emoji.svg';
import { testimonials } from '@/constants/index';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

export default function Highlights() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto py-2 px-4">
      {/* Heading */}
      <div className="flex gap-2 w-full items-center justify-center my-8">
        <h3 className="text-2xl md:text-4xl font-bold text-white text-center">
          Happy <span className="text-purple-400">Highlights!</span>
        </h3>
        <Image src={emoji} alt="Happy emoji" width={40} height={40} />
      </div>

      {/* Masonry for Desktop (Hidden on Mobile) */}
      <ResponsiveMasonry className='hidden md:flex' columnsCountBreakPoints={{ 350: 4, 750: 4 }}>
        <Masonry gutter="12px">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#211a2d] border border-[#3a3347] text-white p-5 rounded-[5px] shadow-lg transition-transform duration-300 ease-in-out hover:scale-[1.02]"
            >
              <p className="mb-4 text-md font-Poppins">{testimonial.text}</p>
              <div className="flex items-center gap-3 mt-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="font-medium text-white">
                  {testimonial.name}
                </span>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {isMobile && (
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true} // Infinite loop
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-slide every 3 sec
            className="w-full"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-[#211a2d] border border-[#3a3347] text-white p-5 rounded-[5px] shadow-lg min-h-[220px] flex flex-col justify-between">
                  <p className="mb-4 text-md font-Poppins">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium text-white">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      )}
    </div>
  );
}
