import React from 'react';

const ComingSoon = () => {
  return (
    <div className="h-[calc(100dvh-52px)] lg:h-[calc(100dvh-190px)] flex flex-col justify-center items-center bg-white text-center px-4">
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Coming Soon</h1>
      <p className="text-lg lg:text-xl mb-6 text-gray-600">
        This content will be available in <strong>June 2026!</strong>
      </p>
    </div>
  );
};

export default ComingSoon;
