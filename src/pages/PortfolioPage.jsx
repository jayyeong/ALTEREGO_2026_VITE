import React from 'react';
import { useParams } from 'react-router-dom';
import members from '../data/members.json';
import { Mail, Instagram } from 'lucide-react';
import { resolveAssetUrl } from '../utils/assets';

const PortfolioPage = () => {
  const { portfolioUrl } = useParams();

  // 모든 멤버를 하나의 배열로 평탄화
  const allMembers = members.flatMap(team => team.members);
  const member = allMembers.find(m => m.portfolioUrl === portfolioUrl);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">해당 멤버를 찾을 수 없습니다.</p>
      </div>
    );
  }

  /* ---------- 미디어 소스 선택 ---------- */
  const mediaItems = member.slides?.length ? member.slides : member.brochureImages?.map(src => ({
    type: 'image',
    src,
  })) || [];

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden max-w-[1140px] mx-auto px-4 py-8">
        <section className="flex items-start gap-4">
          <div className="w-[150px] flex-shrink-0 pt-1">
            <h1 className="text-base font-semibold leading-tight">{member.name}</h1>
            <p className="text-sm text-black/80 mt-1">{member.englishName}</p>
            {(member.email || member.instagram) && (
              <div className="mt-4 space-y-2 text-xs">
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
            <div className="w-full max-w-[180px] mr-auto">
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
          {member.description && (
            <p className="mt-3 text-sm whitespace-pre-line leading-relaxed text-black/85 text-right">
              {member.description}
            </p>
          )}
        </section>

        <section className="mt-8 space-y-3">
          {mediaItems.length ? (
            mediaItems.map((item, idx) => (
              <div key={`${item.type}-${idx}`} className="w-full">
                {item.type === 'image' ? (
                  <img
                    src={resolveAssetUrl(item.src)}
                    alt={`작품 이미지 ${idx + 1}`}
                    className="w-full h-auto object-contain"
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
            ))
          ) : (
            <p className="text-sm text-black/70">표시할 작품 이미지가 없습니다.</p>
          )}
        </section>
      </div>

      {/* Desktop */}
      <div className="hidden md:block w-full bg-white">
        <div className="w-full pr-6 lg:pr-8">
          <div className="grid grid-cols-[260px_460px_minmax(0,1fr)] gap-6 lg:gap-6 items-start">
            <aside className="sticky top-0 self-start bg-[#fafafa] min-h-[100dvh]">
              <div className="p-5">
                <div className="w-full max-w-[180px] mr-auto">
                  <div className="bg-white overflow-hidden">
                    <img
                      src={resolveAssetUrl(member.profileImageUrl)}
                      alt={`${member.name} profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-black">
                  <p className="text-xl font-semibold leading-none">{member.name}</p>
                  <p className="text-base text-black/80">{member.englishName}</p>
                </div>

                {(member.email || member.instagram) && (
                  <div className="mt-8 space-y-2 text-base leading-tight">
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

            <section className="pt-2 ml-24">
              {member.projectTitle && (
                <h2 className="text-xl font-bold leading-[1.2] break-words text-right">
                  {member.projectTitle}
                </h2>
              )}
              {member.description && (
                <p className="mt-5 text-xs leading-relaxed whitespace-pre-line text-black/85 text-right">
                  {member.description}
                </p>
              )}
            </section>

            <section className="pt-2 pr-6">
              {mediaItems.length ? (
                <div className="grid grid-cols-1 gap-4">
                  {mediaItems.map((item, idx) => (
                    <div key={`${item.type}-${idx}`} className="w-full">
                      {item.type === "image" ? (
                        <div className="w-full aspect-[3/4] overflow-hidden bg-white">
                          <img
                            src={resolveAssetUrl(item.src)}
                            alt={`작품 이미지 ${idx + 1}`}
                            className="w-full h-full object-cover"
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
              ) : (
                <p className="text-sm text-black/70">표시할 작품 이미지가 없습니다.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioPage;
