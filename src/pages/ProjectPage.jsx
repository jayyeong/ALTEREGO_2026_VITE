import React from "react";
import { Link } from "react-router-dom";

const teams = [
  { name: "Limbo", image: "/2026/poster/Limbo_poster.webp", url: "limbo" },
  { name: "(Un)skinned", image: "/2026/poster/unskinned_poster.webp", url: "unskinned" },
  { name: "Dreamscape", image: "/2026/poster/Dreamscape_poster.webp", url: "dreamscape" },
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
    <div className="mx-auto max-w-[980px] xl:max-w-[1120px] 2xl:max-w-[1260px] px-4 py-8 md:h-[calc(100dvh-88px)] md:overflow-hidden md:py-0">
      <section className="md:h-full">
        <div className="grid grid-cols-1 gap-y-10 md:hidden">
          {teams.map((team, idx) => (
            <div key={idx} className="w-[75%] mx-auto">
              <TeamCard team={team} />
            </div>
          ))}
        </div>

        <div className="hidden h-full md:flex flex-col justify-center py-[clamp(12px,3vh,32px)]">
          <div className="grid grid-cols-4 w-full max-w-[min(920px,calc((100dvh-176px)*3/2))] xl:max-w-[min(980px,calc((100dvh-176px)*3/2))] 2xl:max-w-[min(1100px,calc((100dvh-176px)*3/2))] mx-auto gap-x-[clamp(20px,4vw,56px)] gap-y-4">
            {row1.map((team, idx) => (
              <TeamCard key={idx} team={team} />
            ))}
          </div>

          <div className="mt-[clamp(14px,3vh,32px)] flex justify-center">
            <div className="grid grid-cols-3 w-full max-w-[min(676px,calc((100dvh-176px)*9/8))] xl:max-w-[min(721px,calc((100dvh-176px)*9/8))] 2xl:max-w-[min(812px,calc((100dvh-176px)*9/8))] gap-x-[clamp(20px,4vw,56px)]">
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
