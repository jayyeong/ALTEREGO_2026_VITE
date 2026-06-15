import React from 'react';

const ComingSoon = () => {
  return (
    <div className="flex h-[calc(100dvh-52px)] flex-col items-center justify-center bg-white px-4 text-center lg:h-[calc(100dvh-190px)]">
      <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-gray-500">ALTER EGO 2026</p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">Store Closed</h1>
      <p className="max-w-md text-base leading-7 text-gray-600 lg:text-lg">
        ALTER EGO 2026 스토어 운영이 종료되었습니다.
        <br />
        이용해 주셔서 감사합니다.
      </p>
    </div>
  );
};

export default ComingSoon;
