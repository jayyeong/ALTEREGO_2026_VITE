import React from 'react';
import { useParams } from 'react-router-dom';
import members from '../data/members.json';
import { Mail, Instagram } from 'lucide-react';
import { resolveAssetUrl } from '../utils/assets';
import { getRunwayImageUrls } from '../utils/runway';

const ProfileTextSection = ({ member, className = '', descriptionClassName = '', lookClassName = '' }) => (
  <div className={className}>
    {member.description && (
      <p className={`whitespace-pre-line break-keep leading-relaxed text-black/85 ${descriptionClassName}`}>
        {member.description}
      </p>
    )}

    {member.lookDescriptions?.length > 0 && (
      <div className="mt-9 space-y-9">
        {member.lookDescriptions.map((look) => (
          <section key={look.label}>
            <h3 className="text-[11px] font-semibold tracking-normal text-black">{look.label}</h3>
            <p className={`mt-2 whitespace-pre-line break-keep leading-relaxed text-black/80 ${lookClassName}`}>
              {look.text}
            </p>
          </section>
        ))}
      </div>
    )}
  </div>
);

const PortfolioPage = () => {
  const { portfolioUrl } = useParams();

  const allMembers = members.flatMap(team =>
    team.members.map(member => ({
      ...member,
      teamPageUrl: team.teamPageUrl,
    }))
  );
  const member = allMembers.find(m => m.portfolioUrl === portfolioUrl);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">해당 멤버를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const mediaItems = member.slides?.length ? member.slides : member.brochureImages?.map(src => ({
    type: 'image',
    src,
  })) || [];
  const runwayItems = getRunwayImageUrls(member.teamPageUrl, member.portfolioUrl).map(src => ({
    type: 'image',
    src,
    category: 'runway',
  }));
  const portfolioItems = [...mediaItems, ...runwayItems];

  return (
    <>
      <div className="md:hidden max-w-[1140px] mx-auto px-4 py-8">
        <section className="flex items-start gap-4">
          <div className="w-[150px] flex-shrink-0 pt-1">
            <h1 className="text-sm font-semibold leading-tight">{member.name}</h1>
            <p className="mt-1 text-xs text-black/80">{member.englishName}</p>
            {(member.email || member.instagram) && (
              <div className="mt-4 space-y-2 text-[10px]">
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-start gap-2 text-black hover:no-underline">
                    <Mail size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span>{member.email}</span>
                  </a>
                )}
                {member.instagram && (
                  <a
                    href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-black hover:no-underline"
                  >
                    <Instagram size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                    <span>{member.instagram}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex justify-start">
            <div className="w-full max-w-[171px] mr-auto">
              <div className="aspect-[3/4] bg-white">
                <img
                  src={resolveAssetUrl(member.profileImageUrl)}
                  alt={`${member.name} profile`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          {member.projectTitle && (
            <h2 className="text-lg font-bold leading-snug break-words">{member.projectTitle}</h2>
          )}
          <ProfileTextSection
            member={member}
            className="mt-3 text-right"
            descriptionClassName="text-sm"
            lookClassName="text-sm"
          />
        </section>

        <section className="mt-8 space-y-3">
          {portfolioItems.map((item, idx) => (
              <div key={`${item.type}-${idx}`} className="w-full">
                {item.type === 'image' ? (
                  <img
                    src={resolveAssetUrl(item.src)}
                    alt={
                      item.category === 'runway'
                        ? `${member.name} 런웨이 ${runwayItems.indexOf(item) + 1}`
                        : `작품 이미지 ${idx + 1}`
                    }
                    className="ml-auto block h-auto max-h-[calc(100dvh-4rem)] w-auto max-w-full object-contain object-right"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[3/4]">
                    <iframe
                      title={`iframe-${idx}`}
                      src={item.src}
                      frameBorder="0"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            ))}
        </section>
      </div>

      <div className="hidden md:block w-full bg-white">
        <div className="w-full pr-6 lg:pr-8">
          <div className="grid grid-cols-[200px_minmax(0,1fr)] items-start gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)] xl:gap-6">
            <aside className="sticky top-0 self-start bg-[#fafafa] min-h-[100dvh]">
              <div className="p-4">
                <div className="w-full max-w-[171px] mx-auto">
                  <div className="bg-white overflow-hidden">
                    <img
                      src={resolveAssetUrl(member.profileImageUrl)}
                      alt={`${member.name} profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-black">
                  <p className="text-lg font-semibold leading-none">{member.name}</p>
                  <p className="text-sm text-black/80">{member.englishName}</p>
                </div>

                {(member.email || member.instagram) && (
                  <div className="mt-8 space-y-2 text-sm leading-tight">
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-black hover:no-underline"
                      >
                        <Instagram size={16} strokeWidth={1.5} className="mt-1 shrink-0" />
                        <span className="break-all">{member.instagram}</span>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-start gap-2 text-black hover:no-underline"
                      >
                        <Mail size={16} strokeWidth={1.5} className="mt-1 shrink-0" />
                        <span className="break-all">{member.email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </aside>

            <div className="flex min-w-0 items-start justify-end gap-4 xl:gap-6">
              <section className="sticky top-4 w-[clamp(220px,24vw,360px)] shrink-0 self-start pt-2">
                {member.projectTitle && (
                  <h2 className="text-xl font-bold leading-[1.2] break-words text-right">
                    {member.projectTitle}
                  </h2>
                )}
                <ProfileTextSection
                  member={member}
                  className="mt-5 text-right"
                  descriptionClassName="text-xs"
                  lookClassName="text-xs"
                />
              </section>

              <section className="w-[min(280px,calc((100dvh-var(--site-header-height))*0.666667))] shrink-0 lg:w-[min(560px,calc((100dvh-var(--site-header-height))*0.666667))] xl:w-[min(680px,calc((100dvh-var(--site-header-height))*0.666667))]">
                <div className="grid w-full grid-cols-1 gap-4">
                  {portfolioItems.map((item, idx) => (
                    <div key={`${item.type}-${idx}`} className="w-full">
                      {item.type === "image" ? (
                        <div className="flex w-full justify-end overflow-hidden bg-white">
                          <img
                            src={resolveAssetUrl(item.src)}
                            alt={
                              item.category === 'runway'
                                ? `${member.name} 런웨이 ${runwayItems.indexOf(item) + 1}`
                                : `작품 이미지 ${idx + 1}`
                            }
                            className="h-auto max-h-[calc(100dvh-var(--site-header-height))] w-auto max-w-full object-contain object-right"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[3/4]">
                          <iframe
                            title={`iframe-${idx}`}
                            src={item.src}
                            frameBorder="0"
                            width="100%"
                            height="100%"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;
