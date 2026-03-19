import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="loaderImg h-[300px]"></div>
      <div className="loader1"></div>
      <div className="loader2"></div>
      <div className="loader3"></div>
    </div>
  );
};

export default SkeletonLoader;
