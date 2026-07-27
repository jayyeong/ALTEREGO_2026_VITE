import React from "react";
import { useParams, Link } from "react-router-dom";
import teams from "../data/teams.json";
import membersData from "../data/members.json";
import teamSideText from "../data/teamSideText.json";
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
  const sideText = teamSideText[teamId];

  return (
    <>
      <div className="w-full overflow-x-hidden px-4 py-10 md:hidden">
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

        <section className="mt-14">
          <div className="w-full max-w-[340px] mx-auto aspect-video bg-black">
            <iframe
              className="block w-full h-full border-0"
              src={`https://www.youtube.com/embed/${team.youtubeId}`}
              title={`${team.name} Teaser`}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>

        <section className="mt-14">
          <div className="w-full max-w-[340px] mx-auto">
            <h3 className="text-base font-semibold mb-6">TEAM {team.name}</h3>

            <div className="grid grid-cols-2 gap-x-6 gap-y-9">
              {members.map((member) => (
                <Link
                  key={member.name}
                  to={`/portfolio/${member.portfolioUrl}`}
                  className="block group w-full max-w-[135px] mx-auto"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-white">
                    <img
                      src={resolveAssetUrl(member.brochureImages?.[0] || member.profileImageUrl)}
                      alt={`${member.name} 브로슈어`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
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

      <div className="hidden w-full overflow-x-clip bg-white md:block">
        <div className="grid grid-cols-[260px_minmax(0,1fr)] items-stretch">
          <aside className="self-stretch bg-[#fafafa]">
            <div className="sticky top-0 min-h-[100dvh] px-5 pb-8 pt-10 text-right">
              {sideText && (
                <>
                  <p className="text-[11pt] leading-relaxed">
                    {sideText.intro}
                  </p>
                  <h3 className="mt-5 text-[11pt] font-bold leading-relaxed">
                    {sideText.teamName}
                  </h3>
                  <ul className="mt-8 space-y-3">
                    {members.map((member) => (
                      <li
                        key={member.portfolioUrl}
                        className="text-[10pt] leading-relaxed"
                      >
                        <Link
                          to={`/portfolio/${member.portfolioUrl}`}
                          className="transition-opacity hover:opacity-60"
                        >
                          {member.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>

          <div className="py-10 pl-8 lg:pl-12">
            <div className="ml-auto w-full max-w-[1320px] overflow-x-hidden pr-4 lg:pr-8">
              <section className="ml-auto flex w-[86%] flex-col gap-6 lg:flex-row lg:items-end lg:justify-end lg:gap-0">
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

              <section className="mt-20">
                <div className="ml-auto aspect-video w-[86%] bg-black">
                  <iframe
                    className="block w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${team.youtubeId}`}
                    title={`${team.name} Teaser`}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </section>

              <section className="pt-20">
                <div className="ml-auto w-[86%]">
                  <h3 className="text-[20px] text-base font-semibold mb-6 text-left">TEAM {team.name}</h3>

                  <div className="grid grid-cols-2 gap-x-9 gap-y-8 lg:grid-cols-3">
                    {members.map((member) => (
                      <Link
                        key={member.name}
                        to={`/portfolio/${member.portfolioUrl}`}
                        className="block w-full group"
                      >
                        <div className="relative aspect-[2/3] overflow-hidden bg-white">
                          <img
                            src={resolveAssetUrl(member.brochureImages?.[0] || member.profileImageUrl)}
                            alt={`${member.name} 브로슈어`}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover"
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
