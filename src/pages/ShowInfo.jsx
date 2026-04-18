import React from "react";

const ShowInfo = () => {
  const IMAGE_BASE_PATH = "/2026/image";
  const POSTER_PATH = "/2026/poster/SOMA2025poster.webp";
  const mainThemeDescription = [
    "SOMA는 체세포, 더 나아가 물리적 형태인 몸과 정신이 깃든 신체를 아우르는 개념이다.신체는 타고난 본성으로부터 시작하여, 나로 비롯된 취향, 그리고 자연스럽게 형성된 습관을 통해 하나의 고유한 실체로 완성되어 간다.",
    "우리는 이번 쇼에서 의식하지 않아도 완성되는 개인의 - SOMA를 담았다. 이는 단순한 패션쇼를 넘어 신체와 감각의 경계를 탐구하는 예술적 실험이자, 인간의 본질에 대한 깊은 질문을 던지는 무대다.",
    "2025 SOMA를 통해 관객이 자신의 감각 세계를 확장하고, 신체를 매개로 한 새로운 이야기를 발견할 수 있기를 바란다.",
  ];

  const desktopImages = [
    { src: `${IMAGE_BASE_PATH}/team-credit.jpg`, alt: "팀 크레딧 데스크탑" },
    { src: `${IMAGE_BASE_PATH}/exhibition-guide.png`, alt: "전시 안내 데스크탑" },
    { src: `${IMAGE_BASE_PATH}/location.jpg`, alt: "오시는 길 데스크탑" },
  ];

  const mobileImages = [
    { src: `${IMAGE_BASE_PATH}/team-credit-mobile-1.jpg`, alt: "팀 크레딧 #1" },
    { src: `${IMAGE_BASE_PATH}/team-credit-mobile-2.jpg`, alt: "팀 크레딧 #2" },
    { src: `${IMAGE_BASE_PATH}/exhibition-guide-mobile-1.jpg`, alt: "전시 안내 #1" },
    { src: `${IMAGE_BASE_PATH}/exhibition-guide-mobile-2.png`, alt: "전시 안내 #2" },
    { src: `${IMAGE_BASE_PATH}/location-mobile-1.jpg`, alt: "오시는 길 #1" },
    { src: `${IMAGE_BASE_PATH}/location-mobile-2.jpg`, alt: "오시는 길 #2" },
  ];

  return (
    <div className="w-full bg-white py-10 md:py-14 px-4">
      {/* Main Theme */}
      <section className="w-full max-w-[1040px] mb-8 md:mb-8 mx-auto">
        <div className="border border-black/5 bg-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] p-5 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-10">
            <div className="order-1 w-full max-w-[340px] md:w-[33vw] md:min-w-[360px] md:max-w-[460px] mx-auto">
              <div className="aspect-[3/4] bg-white">
                <img
                  src={POSTER_PATH}
                  alt="SOMA 메인 포스터"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="order-2 w-full max-w-[460px] mx-auto text-left">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight mb-4 md:mb-5">SOMA</h2>
              <div className="space-y-3 md:space-y-4">
                {mainThemeDescription.map((line, index) => (
                  <p
                    key={index}
                    className="text-sm md:text-[15px] leading-relaxed text-black/85 whitespace-pre-line"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[1040px] mx-auto">

        {/* PC */}
        <div className="hidden md:flex w-full flex-col items-center gap-8">
          {desktopImages.map((image) => (
            <div
              key={image.src}
              className="w-full border border-black/5 bg-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden w-full flex flex-col items-center gap-5">
          {mobileImages.map((image) => (
            <div
              key={image.src}
              className="w-full border border-black/5 bg-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] overflow-hidden"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-auto object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowInfo;
