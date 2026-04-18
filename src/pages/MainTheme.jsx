import React from "react";
import { Link } from "react-router-dom";

const teams = [
  { name: "AGIOTITA", image: "/2025/poster/Agiotita.webp", url: "agiotita" },
  { name: "BIPOLAR", image: "/2025/poster/Bipolar.webp", url: "bipolar" },
  { name: '" - - - "', image: "/2025/poster/DASH.webp", url: "dash" },
  { name: "Dialysis", image: "/2025/poster/Dialysis.webp", url: "dialysis" },
  { name: "표류[ ]기", image: "/2025/poster/표류기.webp", url: "drift" },
  { name: "자각몽", image: "/2025/poster/자각몽.webp", url: "lucid-dream" },
  { name: "TEAM 7", image: "/2025/poster/team7.webp", url: "team7" },
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
    <p className="mt-3 text-sm tracking-wide text-black">{team.name}</p>
  </Link>
);

const MainTheme = () => {
  const row1 = teams.slice(0, 4);
  const row2 = teams.slice(4);

  return (
    <div className="mx-auto max-w-[1140px] px-4 py-10">
      <section>
        {/* 모바일: 1열(네 코드 의도 유지) */}
        <div className="grid grid-cols-1 gap-y-10 md:hidden">
          {teams.map((team, idx) => (
            <TeamCard key={idx} team={team} />
          ))}
        </div>

        {/* PC: 4개 + 3개 “두 줄 분리” */}
        <div className="hidden md:block">
          {/* 첫째 줄: 4개 (카드 폭 동일) */}
          <div className="grid grid-cols-4 gap-x-10 gap-y-10">
            {row1.map((team, idx) => (
              <TeamCard key={idx} team={team} />
            ))}
          </div>

          {/* 둘째 줄: 3개 (가운데 정렬 + 카드 폭은 1줄과 동일하게 유지) */}
          <div className="mt-10 flex justify-center">
            <div className="grid grid-cols-3 gap-x-10 w-[calc(100%-25%)]">
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

export default MainTheme;