import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import membersData from "../data/members.json";
import { getRunwayImageUrls } from "../utils/runway";

export default function Runway() {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const teamSections = membersData.map((team) => {
    const members = team.members.map((member) => {
      return {
        name: member.name,
        portfolioUrl: member.portfolioUrl,
        images: getRunwayImageUrls(team.teamPageUrl, member.portfolioUrl),
      };
    });

    return {
      label: team.teamName,
      members,
    };
  });

  const allRunwayImages = teamSections.flatMap((team) =>
    team.members.flatMap((member) =>
      member.images.map((src, idx) => ({
        src,
        alt: `${member.name} runway ${idx + 1}`,
      }))
    )
  );

  return (
    <>
      <div className="max-w-[1140px] mx-auto px-4 py-10 pt-20">
        <div className="w-full max-w-[860px] mx-auto aspect-video mb-12 md:mb-14">
          <iframe
            src="https://www.youtube.com/embed/I6ZhuIJTGug"
            title="RUNWAY"
            className="w-full h-full"
            allowFullScreen
          />
        </div>

        <div className="space-y-16 md:space-y-20 pt-20">
          {teamSections.map((team) => (
            <section key={team.label}>
              <h2 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
                {team.label}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
                {team.members.map((member) => (
                  <article key={`${team.label}-${member.name}`} className="w-full">
                    <div className="grid grid-cols-2 gap-x-1">
                      {member.images.map((src, idx) => (
                        <button
                          type="button"
                          key={`${member.name}-${idx}`}
                          onClick={() => setSelectedIndex(
                            allRunwayImages.findIndex((image) => image.src === src)
                          )}
                          className="block w-full cursor-zoom-in"
                          aria-label={`${member.name} runway ${idx + 1} 크게 보기`}
                        >
                          <img
                            src={src.replace("/runway/", "/runway-thumbnails/")}
                            alt={`${member.name} runway ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-auto object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    <Link
                      to={`/portfolio/${member.portfolioUrl}`}
                      className="mt-2 inline-block text-sm text-black/85 transition-opacity hover:opacity-60"
                    >
                      {member.name}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <RunwayImageModal
          images={allRunwayImages}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}

function RunwayImageModal({ images, selectedIndex, onSelect, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        onSelect((selectedIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        onSelect((selectedIndex + 1) % images.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, onClose, onSelect, selectedIndex]);

  const selectedImage = images[selectedIndex];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 md:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${selectedImage.alt} 이미지 보기`}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-6 md:top-6"
        onClick={onClose}
        aria-label="이미지 닫기"
        title="닫기"
      >
        <X size={30} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect((selectedIndex - 1 + images.length) % images.length);
        }}
        className="absolute left-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:left-5"
        aria-label="이전 이미지"
        title="이전 이미지"
      >
        <ChevronLeft size={38} strokeWidth={1.25} />
      </button>

      <img
        src={selectedImage.src}
        alt={selectedImage.alt}
        className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain md:max-h-[calc(100vh-4rem)] md:max-w-[calc(100vw-8rem)]"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSelect((selectedIndex + 1) % images.length);
        }}
        className="absolute right-1 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-5"
        aria-label="다음 이미지"
        title="다음 이미지"
      >
        <ChevronRight size={38} strokeWidth={1.25} />
      </button>

      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70 md:bottom-6">
        {selectedIndex + 1} / {images.length}
      </span>
    </div>,
    document.body
  );
}
