import React from "react";

const imagePaths = [
  "/2026/behind/making/001.jpeg",
  "/2026/behind/making/002.jpeg",
  "/2026/behind/making/003.jpeg",
  "/2026/behind/making/004.jpeg",
  "/2026/behind/making/005.jpeg",
  "/2026/behind/making/006.jpeg",
  "/2026/behind/making/007.jpeg",
  "/2026/behind/making/008.jpeg",
  "/2026/behind/making/010.jpeg",
  "/2026/behind/making/011.jpeg",
  "/2026/behind/making/012.jpeg",
  "/2026/behind/making/013.jpeg",
  "/2026/behind/making/014.jpeg",
  "/2026/behind/making/015.jpeg",
];

export default function BehindMaking() {
  return (
    <div className="max-w-[1140px] mx-auto px-4 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {imagePaths.map((src, idx) => (
          <div key={idx} className="w-full">
            <img
              src={src}
              alt={`Making behind ${idx + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}