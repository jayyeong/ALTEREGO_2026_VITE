import React from "react";
import { Link } from "react-router-dom";

const teams = [
  { name: "Limbo", image: "/2026/poster/Limbo_poster.webp", url: "limbo" },
  { name: "(Un)skinned", image: "/2026/poster/unskinned_poster.webp", url: "unskinned" },
  { name: "Dreamscape", image: "/2026/poster/REI_poster.webp", url: "dreamscape" },
  { name: 'Tiny Lodge', image: "/2026/poster/TinyLodge_poster.webp", url: "tiny-lodge" },
  { name: "11:11", image: "/2026/poster/11_11_poster.webp", url: "eleven-eleven" },
  { name: "가시:화(花)", image: "/2026/poster/thronbloom_poster.webp", url: "thorn-bloom" },
  { name: "RE:I", image: "/2026/poster/REI_poster.webp", url: "rei" },
];

const TeamCard = ({ team }) => (
  <Link
    to={`/team/${team.url}`}
    className="block text-center hover:opacity-90 transition"
  >
    <div className="w-full aspect-[3/4] overflow-hidden bg-white">
      <img
        src={team.image}
        alt={team.name}
        className="w-full h-full object-cover"
      />
    </div>
    <p className="mt-1.5 text-xs md:text-sm tracking-wide text-black">{team.name}</p>
  </Link>
);

const ProjectPage = () => {
  const row1 = teams.slice(0, 4);
  const row2 = teams.slice(4);

  return (
    <div className="mx-auto max-w-[980px] xl:max-w-[1120px] 2xl:max-w-[1260px] px-4 py-8 md:py-0">
      <section>
        {/* 모바일: 1열(네 코드 의도 유지) */}
        <div className="grid grid-cols-1 gap-y-10 md:hidden">
          {teams.map((team, idx) => (
            <div key={idx} className="w-[75%] mx-auto">
              <TeamCard team={team} />
            </div>
          ))}
        </div>

        {/* PC: 4개 + 3개 “두 줄 분리” */}
        <div className="hidden md:flex h-[calc(100dvh-88px)] flex-col justify-center py-8">
          {/* 첫째 줄: 4개 (카드 폭 동일) */}
          <div className="grid grid-cols-4 w-full max-w-[920px] xl:max-w-[980px] 2xl:max-w-[1100px] mx-auto gap-x-14 gap-y-6">
            {row1.map((team, idx) => (
              <TeamCard key={idx} team={team} />
            ))}
          </div>

          {/* 둘째 줄: 3개 (가운데 정렬 + 카드 폭은 1줄과 동일하게 유지) */}
          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-3 w-full max-w-[676px] xl:max-w-[721px] 2xl:max-w-[812px] gap-x-14">
              {row2.map((team, idx) => (
                <TeamCard key={idx} team={team} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectPage;
