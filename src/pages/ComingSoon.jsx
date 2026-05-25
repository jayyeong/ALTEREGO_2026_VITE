import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = () => {
  return (
    <div className="flex h-[calc(100dvh-52px)] flex-col items-center justify-center bg-white px-4 text-center lg:h-[calc(100dvh-190px)]">
      <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-gray-500">ALTER EGO 2026</p>
      <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">Coming Soon</h1>
      <p className="mb-8 max-w-md text-base leading-7 text-gray-600 lg:text-lg">
        현재는 스토어 페이지를 먼저 오픈했습니다. 전시 콘텐츠는 준비가 완료되는 대로 순차적으로 공개됩니다.
      </p>
      <Link
        to="/store/all"
        className="inline-flex h-11 items-center justify-center bg-black px-8 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        STORE 바로가기
      </Link>
    </div>
  );
};

export default ComingSoon;
