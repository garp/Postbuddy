import React from 'react';
import { features } from '@/constants/index';
import featuresImg0 from '@/assets/features/ai-driver.png';
import featuresImg1 from '@/assets/features/viral.png';
import featuresImg2 from '@/assets/features/cross.png';
import featuresImg3 from '@/assets/features/config.png';
import featuresImg4 from '@/assets/features/hash.png';
import featureBanner from '@/assets/features/feature-banner.png';
import Image from 'next/image';

export default function Features() {
  const featureImages = [
    featuresImg0,
    featuresImg1,
    featuresImg2,
    featuresImg3,
    featuresImg4,
  ];

  return (
    <div className="flex justify-center" id="features">
      <div className="mt-32 mb-16 w-full max-w-[1468px] px-8 font-Poppins">
        <ul>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex features-list flex-col sm:flex-row py-[40px] sm:py-[80px] md:gap-[50px] ${
                index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
              }`}
            >
              <div className="w-full sm:w-[50%] h-full flex flex-col">
                <h3 className="font-Poppins font-medium text-[25px] md:text-[35px] text-start">
                  {feature.title}
                </h3>
                <p className="font-Poppins font-medium text-[12px] md:text-[16px] my-4 text-start">
                  {feature.description}
                </p>
                <div className="pl-12 md:flex flex-col gap-4 hidden pr-4">
                  <li className="font-Poppins text-[12px] flex flex-row flex-wrap">
                    <p>
                      <span className="font-bold text-[14px]">
                        {feature.li[0].heading}
                      </span>{' '}
                      {feature.li[0].subHeading}
                    </p>
                  </li>
                  <li className="font-Poppins text-[12px] flex flex-row flex-wrap">
                    <p>
                      <span className="font-bold text-[14px]">
                        {feature.li[1].heading}
                      </span>{' '}
                      {feature.li[1].subHeading}
                    </p>
                  </li>
                  <li className="font-Poppins text-[12px] flex flex-row flex-wrap">
                    <p>
                      <span className="font-bold text-[14px]">
                        {feature.li[2].heading}
                      </span>{' '}
                      {feature.li[2].subHeading}
                    </p>
                  </li>
                </div>
              </div>
              <div className="flex w-full sm:w-[45%] h-full relative">
                {!(
                  index === featureImages.length - 1 ||
                  index === featureImages.length - 2
                ) && (
                  <Image
                    alt="/"
                    src={featureBanner}
                    className={`feature-banner-img scale-90`}
                  />
                )}

                <Image
                  alt={feature.title}
                  src={featureImages[index % featureImages.length]}
                  className={`feature-img rounded-lg scale-75  ${!(
                    index === featureImages.length - 1 ||
                    index === featureImages.length - 2
                  ) ? "scale-[0.8] absolute" : 'scale-[0.9]'}`}
                />
                {index % 2 === 0 ? (
                  <div className="bg-[#00312b] h-[100px] w-[200px] blur-[220px] absolute right-0 bottom-[40%]"></div>
                ) : (
                  <div className="bg-[#AA72FE] h-[100px] w-[400px] blur-[300px] absolute left-0 bttom-[40%]"></div>
                )}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
