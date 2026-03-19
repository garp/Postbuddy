import React from "react";

const SkeletonGridLoader = () => {
  return (
    <div className="flex gap-2">
      <div className="loaderImg h-[150px] w-[50%]"></div>
      <div className="w-[50%] flex flex-col gap-2">
        <div className="loader1"></div>
        <div className="loader2"></div>
        <div className="loader3"></div>
      </div>
    </div>
  );
};

export default SkeletonGridLoader;
