import React from "react";

const imagePaths = [
  "/2026/behind/brochure/001.jpeg",
  "/2026/behind/brochure/002.jpeg",
  "/2026/behind/brochure/003.jpeg",
  "/2026/behind/brochure/004.jpeg",
  "/2026/behind/brochure/005.jpeg",
  "/2026/behind/brochure/006.jpeg",
  "/2026/behind/brochure/007.jpeg",
  "/2026/behind/brochure/008.jpeg",
  "/2026/behind/brochure/009.jpeg",
  "/2026/behind/brochure/010.jpeg",
  "/2026/behind/brochure/011.jpeg",
  "/2026/behind/brochure/012.jpeg",
  "/2026/behind/brochure/013.jpeg",
  "/2026/behind/brochure/014.jpeg",
  "/2026/behind/brochure/015.jpeg",
  "/2026/behind/brochure/016.jpeg",
  "/2026/behind/brochure/017.jpeg",
  "/2026/behind/brochure/018.jpeg",
  "/2026/behind/brochure/019.jpeg",
  "/2026/behind/brochure/020.jpeg",
  "/2026/behind/brochure/021.jpeg",
  "/2026/behind/brochure/022.jpeg",
];

export default function BehindBrochure() {
  return (
    <div className="max-w-[1140px] mx-auto px-4 py-10 space-y-12">
      {/* video (하나만) */}
      <div className="w-full max-w-[860px] mx-auto aspect-video">
        <iframe
          src="https://www.youtube.com/embed/7Kgi3zzsTj0"
          title="BROCHURE BEHIND"
          className="w-full h-full"
          allowFullScreen
        />
      </div>

      {/* images grid (scroll) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {imagePaths.map((src, idx) => (
          <div key={idx} className="w-full">
            <img
              src={src}
              alt={`Brochure behind ${idx + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
