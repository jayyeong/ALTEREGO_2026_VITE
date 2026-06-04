import React from "react";

const ShowInfo = () => {
  const IMAGE_BASE_PATH = "/2026/image";
  const POSTER_PATH = "/2026/poster/MainPoster.webp";
  const mainThemeDescription = [
    "2026 KUAD Graduation Fashion Show Main Theme ‘ALTER EGO’시선의 기준을 세상과 타인에 두고 스스로를 가늠하기 시작할 때 존재는 중심을 잃는다. 비교는 사유를 하나의 궤도로 고정시키고, 우리는 그 안에서 ‘생각’하고 있다고 착각한다.\n 2026 ALTER EGO는 그 착각이 흔들리는 지점이다. 고착된 궤도를 빗겨가 외면해왔던 스스로를 마주하는 시간이다. ",
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
      <section className="w-full max-w-[1040px] mb-8 md:mb-8 mx-auto">
        <div className="border border-black/5 bg-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] p-5 md:p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-10">
            <div className="order-1 w-full max-w-[340px] md:w-[33vw] md:min-w-[360px] md:max-w-[460px] mx-auto">
              <div className="aspect-[3/4] bg-white">
                <img
                  src={POSTER_PATH}
                  alt="메인 포스터"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="order-2 w-full max-w-[460px] mx-auto text-left">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight mb-4 md:mb-5">ALTER EGO</h2>
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
