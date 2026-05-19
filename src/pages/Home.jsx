import React, { useEffect, useMemo, useRef, useState } from "react";
import teams from "../data/teams.json";
import { withBaseUrl } from "../utils/assets";

const teamsById = teams.reduce((acc, team) => {
    acc[team.id] = team;
    return acc;
}, {});

const getCaptionLines = (teamId) => {
    const description = teamsById[teamId]?.description;
    if (!description) return [];
    return description.split("\n\n").map((line, idx) => (idx === 0 ? line : `\n${line}`));
};

const videoList = [
    {
        title: "ALTER EGO",
        src: "/videos/MainTeaser.mp4",
        captionTitle: "ALTER EGO",
        captionLines: [
            "시선의 기준을 세상과 타인에 두고 스스로를 가늠하기 시작할 때 존재는 중심을 잃는다. 비교는 사유를 하나의 궤도로 고정시키고, 우리는 그 안에서 ‘생각’하고 있다고 착각한다.",
            "2026 ALTER EGO는 그 착각이 흔들리는 지점이다.",
            "고착된 궤도를 빗겨가 외면해왔던 스스로를 마주하는 시간이다. ",
        ],
    },
    {
        title: "Limbo",
        src: "/videos/team_1_cut_comp.mp4",
        captionTitle: "Limbo",
        captionLines: getCaptionLines("limbo"),
    },
    {
        title: "11:11",
        src: "/videos/team_2_cut_2560.mp4",
        captionTitle: "11:11",
        captionLines: getCaptionLines("eleven-eleven"),
    },
    {
        title: "Tiny Lodge",
        src: "/videos/team_3_cut_comp.mp4",
        captionTitle: "Tiny Lodge",
        captionLines: getCaptionLines("tiny-lodge"),
    },
    {
        title: "(Un)skinned",
        src: "/videos/team_4_cut_comp.mp4",
        captionTitle: "(Un)skinned",
        captionLines: getCaptionLines("unskinned"),
    },
    {
        title: "RE:I",
        src: "/videos/team_5_cut_comp.mp4",
        captionTitle: "RE:I",
        captionLines: getCaptionLines("rei"),
    },
    {
        title: "Dreamscape",
        src: "/videos/team_6_cut_comp.mp4",
        captionTitle: "Dreamscape",
        captionLines: getCaptionLines("dreamscape"),
    },
    {
        title: "가시:화(花)",
        src: "/videos/MainTeaser.mp4",
        captionTitle: "가시:화(花)",
        captionLines: getCaptionLines("thorn-bloom"),
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
