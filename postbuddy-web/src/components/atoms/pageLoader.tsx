import React from 'react';

interface PageLoaderProps {
  hasBg?: boolean;
  fullPage?: boolean;
  height?: number;
}

const PageLoader: React.FC<PageLoaderProps> = ({ hasBg = true, fullPage = true, height = 0 }) => {
  return (
    <div className={`loader ${fullPage ? "fixed inset-0 z-[9999999999]" : ""} flex items-center justify-center backdrop-blur-sm ${hasBg ? "bg-[#110f1b]" : ""} ${height ? `h-[${height}px]` : ""}`}>
      <div className="loader__balls">
        <div className="loader__balls__group">
          <div className="ball item1"></div>
          <div className="ball item1"></div>
          <div className="ball item1"></div>
        </div>
        <div className="loader__balls__group">
          <div className="ball item2"></div>
          <div className="ball item2"></div>
          <div className="ball item2"></div>
        </div>
        <div className="loader__balls__group">
          <div className="ball item3"></div>
          <div className="ball item3"></div>
          <div className="ball item3"></div>
        </div>
      </div>
    </div>

  );
};

export default PageLoader;