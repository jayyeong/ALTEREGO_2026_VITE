import React, { useEffect, useState } from "react";
import membersData from "../data/members.json";

const runwayImages = [
  "/2026/runway/Kuad_fashionshow_0.jpg",
  "/2026/runway/Kuad_fashionshow_1.jpg",
  "/2026/runway/Kuad_fashionshow_2.jpg",
  "/2026/runway/Kuad_fashionshow_3.jpg",
  "/2026/runway/Kuad_fashionshow_4.jpg",
  "/2026/runway/Kuad_fashionshow_5.jpg",
  "/2026/runway/Kuad_fashionshow_6.jpg",
  "/2026/runway/Kuad_fashionshow_7.jpg",
  "/2026/runway/Kuad_fashionshow_8.jpg",
  "/2026/runway/Kuad_fashionshow_9.jpg",
  "/2026/runway/Kuad_fashionshow_10.jpg",
  "/2026/runway/Kuad_fashionshow_11.jpg",
  "/2026/runway/Kuad_fashionshow_12.jpg",
  "/2026/runway/Kuad_fashionshow_13.jpg",
  "/2026/runway/Kuad_fashionshow_14.jpg",
  "/2026/runway/Kuad_fashionshow_15.jpg",
  "/2026/runway/Kuad_fashionshow_16.jpg",
  "/2026/runway/Kuad_fashionshow_17.jpg",
  "/2026/runway/Kuad_fashionshow_18.jpg",
  "/2026/runway/Kuad_fashionshow_19.jpg",
  "/2026/runway/Kuad_fashionshow_20.jpg",
  "/2026/runway/Kuad_fashionshow_21.jpg",
  "/2026/runway/Kuad_fashionshow_22.jpg",
  "/2026/runway/Kuad_fashionshow_23.jpg",
  "/2026/runway/Kuad_fashionshow_24.jpg",
  "/2026/runway/Kuad_fashionshow_25.jpg",
  "/2026/runway/Kuad_fashionshow_26.jpg",
  "/2026/runway/Kuad_fashionshow_27.jpg",
  "/2026/runway/Kuad_fashionshow_28.jpg",
  "/2026/runway/Kuad_fashionshow_29.jpg",
  "/2026/runway/Kuad_fashionshow_30.jpg",
  "/2026/runway/Kuad_fashionshow_31.jpg",
  "/2026/runway/Kuad_fashionshow_32.jpg",
  "/2026/runway/Kuad_fashionshow_33.jpg",
  "/2026/runway/Kuad_fashionshow_34.jpg",
  "/2026/runway/Kuad_fashionshow_35.jpg",
  "/2026/runway/Kuad_fashionshow_36.jpg",
  "/2026/runway/Kuad_fashionshow_37.jpg",

  "/2026/runway/Kuad_fashionshow_39.jpg",
  "/2026/runway/Kuad_fashionshow_40.jpg",
  "/2026/runway/Kuad_fashionshow_41.jpg",
  "/2026/runway/Kuad_fashionshow_42.jpg",
  "/2026/runway/Kuad_fashionshow_43.jpg",
  "/2026/runway/Kuad_fashionshow_44.jpg",
  "/2026/runway/Kuad_fashionshow_45.jpg",
  "/2026/runway/Kuad_fashionshow_46.jpg",
  "/2026/runway/Kuad_fashionshow_47.jpg",
  "/2026/runway/Kuad_fashionshow_48.jpg",
  "/2026/runway/Kuad_fashionshow_49.jpg",
  "/2026/runway/Kuad_fashionshow_50.jpg",
  "/2026/runway/Kuad_fashionshow_51.jpg",
  "/2026/runway/Kuad_fashionshow_52.jpg",

  "/2026/runway/Kuad_fashionshow_54.jpg",
  "/2026/runway/Kuad_fashionshow_55.jpg",
  "/2026/runway/Kuad_fashionshow_56.jpg",
  "/2026/runway/Kuad_fashionshow_57.jpg",
  "/2026/runway/Kuad_fashionshow_58.jpg",
  "/2026/runway/Kuad_fashionshow_59.jpg",
  "/2026/runway/Kuad_fashionshow_60.jpg",
  "/2026/runway/Kuad_fashionshow_61.jpg",
  "/2026/runway/Kuad_fashionshow_62.jpg",
  "/2026/runway/Kuad_fashionshow_63.jpg",
  "/2026/runway/Kuad_fashionshow_64.jpg",
  "/2026/runway/Kuad_fashionshow_65.jpg",
  "/2026/runway/Kuad_fashionshow_66.jpg",
  "/2026/runway/Kuad_fashionshow_67.jpg",
  "/2026/runway/Kuad_fashionshow_68.jpg",
  "/2026/runway/Kuad_fashionshow_69.jpg",
  "/2026/runway/Kuad_fashionshow_70.jpg",
  "/2026/runway/Kuad_fashionshow_71.jpg",

  "/2026/runway/Kuad_fashionshow_73.jpg",
  "/2026/runway/Kuad_fashionshow_74.jpg",
  "/2026/runway/Kuad_fashionshow_75.jpg",
  "/2026/runway/Kuad_fashionshow_76.jpg",
  "/2026/runway/Kuad_fashionshow_77.jpg",
  "/2026/runway/Kuad_fashionshow_78.jpg",
  "/2026/runway/Kuad_fashionshow_79.jpg",
  "/2026/runway/Kuad_fashionshow_80.jpg",
  "/2026/runway/Kuad_fashionshow_81.jpg",
  "/2026/runway/Kuad_fashionshow_82.jpg",
  "/2026/runway/Kuad_fashionshow_83.jpg",
  "/2026/runway/Kuad_fashionshow_84.jpg",
  "/2026/runway/Kuad_fashionshow_85.jpg",
  "/2026/runway/Kuad_fashionshow_86.jpg",
  "/2026/runway/Kuad_fashionshow_87.jpg",
  "/2026/runway/Kuad_fashionshow_88.jpg",

  "/2026/runway/Kuad_fashionshow_90.jpg",
  "/2026/runway/Kuad_fashionshow_91.jpg",
  "/2026/runway/Kuad_fashionshow_92.jpg",
  "/2026/runway/Kuad_fashionshow_93.jpg",
  "/2026/runway/Kuad_fashionshow_94.jpg",
  "/2026/runway/Kuad_fashionshow_95.jpg",
  "/2026/runway/Kuad_fashionshow_96.jpg",
  "/2026/runway/Kuad_fashionshow_97.jpg",
  "/2026/runway/Kuad_fashionshow_98.jpg",
  "/2026/runway/Kuad_fashionshow_99.jpg",
  "/2026/runway/Kuad_fashionshow_100.jpg",
  "/2026/runway/Kuad_fashionshow_101.jpg",
  "/2026/runway/Kuad_fashionshow_102.jpg",
  "/2026/runway/Kuad_fashionshow_103.jpg",
  "/2026/runway/Kuad_fashionshow_104.jpg",
  "/2026/runway/Kuad_fashionshow_105.jpg",
  "/2026/runway/Kuad_fashionshow_106.jpg",
  "/2026/runway/Kuad_fashionshow_107.jpg",
];

export default function Runway() {
  const [selectedImage, setSelectedImage] = useState(null);

  let cursor = 0;
  const teamSections = membersData.map((team) => {
    const members = team.members.map((member) => {
      const images = runwayImages.slice(cursor, cursor + 2);
      cursor += 2;
      return {
        name: member.name,
        images,
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
        {/* video */}
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
                    <p className="mt-2 text-sm text-black/85">{member.name}</p>
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
