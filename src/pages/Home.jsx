import React, { useEffect, useMemo, useRef, useState } from "react";
import teams from "../data/teams.json";
import { withBaseUrl } from "../utils/assets";

const teamDescriptionByName = teams.reduce((acc, team) => {
    acc[team.name] = team.description || "";
    return acc;
}, {});

const getCaptionLines = (teamName) => {
    const description = teamDescriptionByName[teamName];
    if (!description) return [];
    return description.split("\n\n").map((line, idx) => (idx === 0 ? line : `\n${line}`));
};

const videoList = [
    {
        title: "ALTER EGO",
        src: "/videos/MainTeaser.mp4",
        captionTitle: "Alter ego",
        captionLines: [
            "SOMA는 체세포, 더 나아가 물리적 형태인 몸과 정신이 깃든 신체를 아우르는 개념이다.신체는 타고난 본성으로부터 시작하여, 나로 비롯된 취향, 그리고 자연스럽게 형성된 습관을 통해 하나의 고유한 실체로 완성되어 간다.",
            "\n우리는 이번 쇼에서 의식하지 않아도 완성되는 개인의 - SOMA를 담았다. 이는 단순한 패션쇼를 넘어 신체와 감각의 경계를 탐구하는 예술적 실험이자, 인간의 본질에 대한 깊은 질문을 던지는 무대다.",
            "\n2025 SOMA를 통해 관객이 자신의 감각 세계를 확장하고, 신체를 매개로 한 새로운 이야기를 발견할 수 있기를 바란다.",
        ],
    },
    {
        title: "AGIOTITA",
        src: "/videos/team_1_cut_comp.mp4",
        captionTitle: "Agiotita",
        captionLines: getCaptionLines("AGIOTITA"),
    },
    {
        title: "BIPOLAR",
        src: "/videos/team_2_cut_2560.mp4",
        captionTitle: "Bipolar",
        captionLines: getCaptionLines("BIPOLAR"),
    },
    {
        title: '" - - - "',
        src: "/videos/team_3_cut_comp.mp4",
        captionTitle: '" - - - "',
        captionLines: getCaptionLines('" - - - "'),
    },
    {
        title: "Dialysis",
        src: "/videos/team_4_cut_comp.mp4",
        captionTitle: "Dialysis",
        captionLines: getCaptionLines("Dialysis"),
    },
    {
        title: "표류[ ]기",
        src: "/videos/team_5_cut_comp.mp4",
        captionTitle: "표류[ ]기",
        captionLines: getCaptionLines("표류[ ]기"),
    },
    {
        title: "자각몽",
        src: "/videos/team_6_cut_comp.mp4",
        captionTitle: "자각몽",
        captionLines: getCaptionLines("자각몽"),
    },
];

export default function Home() {
    const videoRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const current = useMemo(() => videoList[currentIndex], [currentIndex]);

    const goTo = (nextIndex) => {
        const safe = (nextIndex + videoList.length) % videoList.length;
        setCurrentIndex(safe);
    };

    // const enterFullscreen = () => {
    //     const v = videoRef.current;
    //     if (!v) return;

    //     // iOS Safari (특히 iPhone)
    //     if (typeof v.webkitEnterFullscreen === "function") {
    //         v.webkitEnterFullscreen();
    //         return;
    //     }

    //     // 표준 Fullscreen API (Chrome/Android/데스크탑 Safari 일부)
    //     if (typeof v.requestFullscreen === "function") {
    //         v.requestFullscreen();
    //         return;
    //     }

    //     // 구형 웹킷
    //     const anyV = v;
    //     if (typeof anyV.webkitRequestFullscreen === "function") {
    //         anyV.webkitRequestFullscreen();
    //     }
    // };

    const handlePrev = () => goTo(currentIndex - 1);
    const handleNext = () => goTo(currentIndex + 1);
    const handleEnded = () => setCurrentIndex((prev) => (prev + 1) % videoList.length);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const play = async () => {
            try {
                await v.play();
            } catch { }
        };
        play();
    }, [currentIndex]);

    return (
        <div className="bg-white text-black overflow-x-hidden">
            <div className="min-h-[calc(100dvh-88px)] lg:h-[calc(100dvh-88px)]">
                <div className="mx-auto px-6 lg:px-6 py-10 lg:py-8 lg:h-full">
                    <div className="h-full flex flex-col lg:flex-row gap-10 lg:gap-2 justify-between">

                        {/* LEFT */}
                        {/* <aside
              className="
                lg:w-[15dvh]
                flex flex-col
                lg:h-[75dvh]
              "
            >
              <div className="pt-6">
                <p className="text-[14px] font-semibold">{current.title}</p>

                <div className="mt-5 space-y-2">
                  {videoList.map((v, idx) => (
                    <button
                      key={v.title}
                      onClick={() => goTo(idx)}
                      className={`block text-left text-[13px] w-full transition-colors ${
                        idx === currentIndex
                          ? "text-black font-semibold"
                          : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            </aside> */}

                        {/* RIGHT (영상 박스) */}
                        <section className="flex-1 min-w-0 flex justify-end items-center">
                            {/* ✅ 영상 왼쪽에 캡션을 붙이기 위해 flex-row */}
                            <div className="w-full flex flex-col lg:flex-row lg:items-end justify-end gap-2 lg:gap-12">

                                {/* ✅ 영상 바로 왼쪽 캡션 (검은 글씨) */}
                                <div className="order-2 lg:order-1 lg:w-[220px] flex-shrink-0 text-left">
                                    <p className="text-[14px] font-semibold text-black">
                                        {current.captionTitle}
                                    </p>

                                    <div className="mt-2 space-y-1">
                                        {(current.captionLines || []).map((line, i) => (
                                            <p key={i} className="text-[12px] text-black leading-relaxed whitespace-pre-line">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                {/* ✅ 영상 박스 */}
                                <div
                                    className="
                                                order-1 lg:order-2
                                                relative
                                                w-full
                                                lg:w-[min(75vw,100%)]
                                                h-[55dvh]
                                                lg:h-[75dvh]
                                                overflow-hidden
                                                bg-white
                                            "
                                >
                                    <video
                                        ref={videoRef}
                                        key={currentIndex}
                                        src={withBaseUrl(current.src)}
                                        autoPlay
                                        muted
                                        playsInline
                                        loop={false}
                                        onEnded={handleEnded}
                                        // onClick={() => {
                                        //     // 모바일에서만 전체화면
                                        //     if (window.innerWidth < 1024) enterFullscreen();
                                        // }}
                                        controls={window.innerWidth < 1024}  // 모바일은 컨트롤 보이게(원하면 제거)
                                        className="w-full h-full object-cover cursor-pointer"
                                    />

                                    <div className="block">
                                        <button
                                            onClick={handlePrev}
                                            className="
  absolute 
  left-4 lg:left-[1.5vw]
  top-1/2 -translate-y-1/2 
  w-12 h-12 lg:w-auto lg:h-auto
  flex items-center justify-center
  text-3xl lg:text-[2vw]
  text-black/60
 
  rounded-full
  hover:text-white/60
  transition
"
                                            aria-label="prev"
                                        >
                                            &#10094;
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            className="
  absolute 
  right-4 lg:right-[1.5vw]
  top-1/2 -translate-y-1/2 
  w-12 h-12 lg:w-auto lg:h-auto
  flex items-center justify-center
  text-3xl lg:text-[2vw]
  text-black/60 
  
  rounded-full
  hover:text-white/60
  transition
"
                                            aria-label="next"
                                        >
                                            &#10095;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
