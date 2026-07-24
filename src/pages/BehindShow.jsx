import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const ShowBehindPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const imagePaths = Array.from({ length: 203 }, (_, idx) => {
    const number = String(idx + 1).padStart(3, "0");
    return `/2026/behind/gallery/behind-${number}.webp`;
  });

  useEffect(() => {
    if (selectedIndex === null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => (current - 1 + imagePaths.length) % imagePaths.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => (current + 1) % imagePaths.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, imagePaths.length]);

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-10 space-y-12 md:py-14">
      <div className="w-full max-w-[860px] mx-auto aspect-video">
        <iframe
          src="https://www.youtube.com/embed/sMeZQnVp-hg"
          title="BEHIND"
          className="w-full h-full"
          allowFullScreen
        />
      </div>

      <div className="w-full flex justify-center">
        <p className="max-w-[720px] text-center text-[11pt] leading-[1.9] text-black/80">
          런웨이 위의 몇 분을 위해 쌓여온 수많은 시간들.
          <br />
          디자이너와 모델, 그리고 수많은 스태프들의 준비 과정 속에는 쇼의 또 다른 이야기가 존재합니다.
          <br />
          <strong className="font-semibold text-black">ALTER EGO의 무대 뒤</strong>에서 펼쳐진{" "}
          <strong className="font-semibold text-black">준비와 열정의 순간들</strong>을{" "}
          <strong className="font-semibold text-black">기록</strong>했습니다.
          <br />
          보이지 않는 곳에서 이어진 수많은 선택과 노력, 그리고 무대를 향한 진심을 이곳에 담아 아카이빙합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {imagePaths.map((src, idx) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelectedIndex(idx)}
            className="block w-full cursor-zoom-in"
            aria-label={`Behind ${idx + 1} 크게 보기`}
          >
            <img
              src={src.replace("/gallery/", "/thumbnails/")}
              alt={`Behind ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </button>
        ))}
      </div>

      {selectedIndex !== null && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Behind ${selectedIndex + 1} 이미지 보기`}
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-6 md:top-6"
            aria-label="이미지 닫기"
            title="닫기"
          >
            <X size={30} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex - 1 + imagePaths.length) % imagePaths.length);
            }}
            className="absolute left-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:left-5"
            aria-label="이전 이미지"
            title="이전 이미지"
          >
            <ChevronLeft size={38} strokeWidth={1.25} />
          </button>

          <img
            src={imagePaths[selectedIndex]}
            alt={`Behind ${selectedIndex + 1}`}
            className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain md:max-h-[calc(100vh-4rem)] md:max-w-[calc(100vw-8rem)]"
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedIndex((selectedIndex + 1) % imagePaths.length);
            }}
            className="absolute right-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-5"
            aria-label="다음 이미지"
            title="다음 이미지"
          >
            <ChevronRight size={38} strokeWidth={1.25} />
          </button>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70 md:bottom-6">
            {selectedIndex + 1} / {imagePaths.length}
          </span>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ShowBehindPage;
