// src/pages/TeamPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import teams from "../data/teams.json";
import membersData from "../data/members.json";
import { resolveAssetUrl } from "../utils/assets";

const TeamPage = () => {
  const { teamId } = useParams();

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return <div className="text-center py-20">팀 정보를 찾을 수 없습니다.</div>;
  }

  const teamMembersEntry = membersData.find(
    (t) => t.teamPageUrl.toLowerCase() === teamId
  );
  const members = teamMembersEntry ? teamMembersEntry.members : [];

  const calculatePaddingTop = () => (3500 / 2333) * 100;

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden w-full px-4 py-10">
        {/* 1) 포스터 + 팀명/설명 */}
        <section className="flex flex-col gap-6">
          <div className="w-full max-w-[290px] mx-auto">
            <div className="w-full aspect-[3/4] bg-white overflow-hidden">
              <img
                src={team.poster}
                alt={team.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="w-full max-w-[290px] mx-auto">
            <h2 className="text-base text-left font-medium mb-3">{team.name}</h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-black/80 text-left">
              {team.description}
            </p>
          </div>
        </section>

        {/* 2) 티저 영상 */}
        <section className="mt-14">
          <div className="w-full max-w-[340px] mx-auto aspect-video border border-black/20 bg-black">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${team.youtubeId}`}
              title={`${team.name} Teaser`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>

        {/* 3) 팀 구성원 */}
        <section className="mt-14">
          <div className="w-full max-w-[340px] mx-auto">
            <h3 className="text-base font-semibold mb-6">TEAM {team.name}</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-9">
              {members.map((member) => (
                <Link
                  key={member.name}
                  to={`/portfolio/${member.portfolioUrl}`}
                  className="block group w-full max-w-[150px] mx-auto"
                >
                  <div
                    className="bg-white relative overflow-hidden"
                    style={{ paddingTop: `${calculatePaddingTop()}%` }}
                  >
                    <img
                      src={resolveAssetUrl(member.profileImageUrl)}
                      alt={member.name}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full object-contain"
                    />
                  </div>

                  <div className="mt-2 text-sm group-hover:opacity-70 transition">
                    {member.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full bg-white">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start">
          <aside className="sticky top-0 self-start bg-[#fafafa] min-h-[100dvh]">
            <div className="p-5">
              <h3 className="mt-3 text-lg font-semibold">{team.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-black/70 whitespace-pre-line">
                text 등등
              </p>
            </div>
          </aside>

          <div className="px-8 lg:px-12 py-10">
            <div className="w-[min(78vw,1320px)] ml-auto pr-4 lg:pr-8 xl:pr-10 overflow-x-hidden">
              {/* 1) 포스터 + 팀명/설명 */}
              <section className="flex flex-col lg:flex-row lg:justify-end lg:items-end gap-6 lg:gap-0">
                <div className="order-2 lg:order-1 w-full max-w-[300px] lg:max-w-[340px] lg:mr-8 lg:flex-shrink-0">
                  <h2 className="text-base text-left lg:text-right font-medium mb-3">{team.name}</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-black/80 text-left">
                    {team.description}
                  </p>
                </div>

                <div className="order-1 lg:order-2 w-full max-w-[340px] lg:max-w-none lg:w-[clamp(320px,32vw,620px)]">
                  <div className="w-full aspect-[3/4] bg-white overflow-hidden">
                    <img
                      src={team.poster}
                      alt={team.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </section>

              {/* 2) 티저 영상 */}
              <section className="mt-20">
                <div className="w-full max-w-[1040px] ml-auto aspect-video border border-black/20 bg-black">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${team.youtubeId}`}
                    title={`${team.name} Teaser`}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </section>

              {/* 3) 팀 구성원 */}
              <section className="pt-20">
                <div className="w-fit ml-auto">
                  <h3 className="text-[20px] text-base font-semibold mb-6 text-left">TEAM {team.name}</h3>

                  <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                    {members.map((member) => (
                      <Link
                        key={member.name}
                        to={`/portfolio/${member.portfolioUrl}`}
                        className="block group w-[clamp(260px,18vw,360px)]"
                      >
                        <div
                          className="bg-white relative overflow-hidden"
                          style={{ paddingTop: `${calculatePaddingTop()}%` }}
                        >
                          <img
                            src={resolveAssetUrl(member.profileImageUrl)}
                            alt={member.name}
                            loading="lazy"
                            className="absolute top-0 left-0 w-full h-full object-contain"
                          />
                        </div>

                        <div className="mt-2 text-sm group-hover:opacity-70 transition">
                          {member.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamPage;
