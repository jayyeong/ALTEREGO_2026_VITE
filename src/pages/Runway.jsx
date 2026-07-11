import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import membersData from "../data/members.json";
import { getRunwayImageUrls } from "../utils/runway";

export default function Runway() {
  const [selectedImage, setSelectedImage] = useState(null);

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
                          onClick={() => setSelectedImage({ src, name: member.name, idx })}
                          className="block w-full"
                        >
                          <img
                            src={src}
                            alt={`${member.name} runway ${idx + 1}`}
                            loading="lazy"
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

      {selectedImage && (
        <RunwayImageModal
          src={selectedImage.src}
          alt={`${selectedImage.name} runway ${selectedImage.idx + 1}`}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}

function RunwayImageModal({ src, alt, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute top-5 right-5 text-white text-3xl leading-none"
        onClick={onClose}
        aria-label="닫기"
      >
        ×
      </button>

      <img
        src={src}
        alt={alt}
        className="max-w-[92vw] max-h-[88vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
