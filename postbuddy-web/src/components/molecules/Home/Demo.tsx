import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Demo() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const videoId = 'Jz8wJgg6qnw';
  const baseEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
  const videoSrc = isPopupVisible
    ? `${baseEmbedUrl}?autoplay=1`
    : `${baseEmbedUrl}`;

  return (
    <div className="flex items-center justify-center relative md:mt-4">
      <div
        className="relative w-[90%] md:w-[60%] cursor-pointer -m-2 rounded-xl bg-[#fff] dark:bg-gray-100/5 p-2 ring-1 ring-inset ring-[#b66bbd70] lg:-m-4 lg:rounded-2xl lg:p-4 transform hover:scale-[1.01] transition-all duration-500"
        onClick={() => setIsPopupVisible(true)}
      >
        <Image
          src={require('@/assets/home.webp')}
          alt="videoThumbnail"
          width={1920}
          height={1080}
          className="rounded-xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 transition-shadow duration-300 hover:shadow-teal-500/20"
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button className="flex items-center justify-center p-4 bg-[#8949ff] text-white rounded-full shadow-xl hover:bg-[#b66bbd] transition-all duration-300">
            <svg
              className="w-5 h-5 md:w-8 md:h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Popup for iframe */}
      {isPopupVisible && (
        <div
          className="fixed inset-0 overflow-y-auto bg-[#fffffff1] flex justify-center items-center z-50"
          onClick={() => setIsPopupVisible(false)}
        >
          <div
            className="relative w-[90%] h-[40%] lg:w-[60%] lg:h-[60%] flex justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              ref={iframeRef}
              className="w-full h-full rounded-xl shadow-2xl"
              src={videoSrc}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture; web-share"
              loading="eager"
            ></iframe>
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setIsPopupVisible(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
