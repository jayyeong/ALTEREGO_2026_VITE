import React from "react";

const ShowInfo = () => {
  const IMAGE_BASE_PATH = "/2026/image";
  const POSTER_PATH = `${IMAGE_BASE_PATH}/info-main-poster.webp`;
  const mainThemeDescription = [
    "2026 KUAD Graduation Fashion Show Main Theme ‘ALTER EGO’시선의 기준을 세상과 타인에 두고 스스로를 가늠하기 시작할 때 존재는 중심을 잃는다. 비교는 사유를 하나의 궤도로 고정시키고, 우리는 그 안에서 ‘생각’하고 있다고 착각한다.\n 2026 ALTER EGO는 그 착각이 흔들리는 지점이다. 고착된 궤도를 빗겨가 외면해왔던 스스로를 마주하는 시간이다. ",
  ];

  const venueImages = [
    { src: `${IMAGE_BASE_PATH}/info-venue-map.jpg`, alt: "노천극장 오시는 길" },
    { src: `${IMAGE_BASE_PATH}/info-seating-guide.jpg`, alt: "노천극장 좌석 안내" },
  ];

  const creditImages = [
    { src: `${IMAGE_BASE_PATH}/info-credit-1.jpg`, alt: "졸업준비위원회 및 후원 크레딧" },
    { src: `${IMAGE_BASE_PATH}/info-credit-2.jpg`, alt: "쇼 디렉팅 및 모델 크레딧" },
    { src: `${IMAGE_BASE_PATH}/info-credit-3.jpg`, alt: "포스터, 브로슈어 및 웹사이트 크레딧" },
  ];

  return (
    <div className="w-full bg-white px-4 py-10 md:py-14">
      <section className="mx-auto mb-12 w-full max-w-[1120px] md:mb-16">
        <div className="grid items-center gap-8 md:grid-cols-[minmax(300px,0.8fr)_minmax(320px,1fr)] md:gap-14">
            <div className="w-full max-w-[420px] mx-auto">
              <div className="aspect-[1/1.414] bg-white overflow-hidden">
                <img
                  src={POSTER_PATH}
                  alt="메인 포스터"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="w-full max-w-[500px] mx-auto text-left">
              <p className="mb-3 text-xs font-medium tracking-[0.16em] text-black/50">
                31ST GRADUATE FASHION SHOW
              </p>
              <h1 className="mb-5 text-3xl font-semibold tracking-tight md:text-5xl">
                ALTER EGO
              </h1>
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
      </section>

      <section className="mx-auto mb-14 w-full max-w-[1120px] md:mb-20">
        <div className="mb-6 border-b border-black/15 pb-3">
          <h2 className="text-lg font-semibold tracking-[0.08em] md:text-xl">SHOW INFO</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 md:gap-7">
          {venueImages.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden bg-white"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px]">
        <div className="mb-6 border-b border-black/15 pb-3">
          <h2 className="text-lg font-semibold tracking-[0.08em] md:text-xl">CREDIT</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {creditImages.map((image) => (
            <div
              key={image.src}
              className="overflow-hidden bg-white"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowInfo;
