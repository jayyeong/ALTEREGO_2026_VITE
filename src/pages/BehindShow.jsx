import React from "react";

const ShowBehindPage = () => {
  const sectionMessage = "TEXT";
  const imagePaths = [
    "/2026/behind/show/6F4A7911.jpg",
    "/2026/behind/show/6F4A8281.jpg",
    "/2026/behind/show/6F4A8658.jpg",
    "/2026/behind/show/6F4A9191.jpg",
    "/2026/behind/show/6F4A9348.jpg",

    "/2026/behind/show/6F4A7930.jpg",
    "/2026/behind/show/6F4A8325.jpg",
    "/2026/behind/show/6F4A8765.jpg",
    "/2026/behind/show/6F4A9194.jpg",
    "/2026/behind/show/6F4A9427.jpg",

    "/2026/behind/show/6F4A8128.jpg",
    "/2026/behind/show/6F4A8377.jpg",
    "/2026/behind/show/6F4A8895.jpg",
    "/2026/behind/show/6F4A9214.jpg",
    "/2026/behind/show/6F4A9446.jpg",

    "/2026/behind/show/6F4A8189.jpg",
    "/2026/behind/show/6F4A8503.jpg",
    "/2026/behind/show/6F4A8964.jpg",
    "/2026/behind/show/6F4A9254.jpg",
    "/2026/behind/show/6F4A9466.jpg",

    "/2026/behind/show/6F4A8199.jpg",
    "/2026/behind/show/6F4A8578.jpg",
    "/2026/behind/show/6F4A8990.jpg",
    "/2026/behind/show/6F4A9265.jpg",
    "/2026/behind/show/6F4A9488.jpg",

    "/2026/behind/show/6F4A8237.jpg",
    "/2026/behind/show/6F4A8636.jpg",
    "/2026/behind/show/6F4A9057.jpg",
    "/2026/behind/show/6F4A9300.jpg",
    "/2026/behind/show/6F4A9534.jpg",
  ];

  return (
    <div className="max-w-[1140px] mx-auto px-4 py-10 space-y-12">
      {/* video */}
      <div className="w-full max-w-[860px] mx-auto aspect-video">
        <iframe
          src="https://www.youtube.com/embed/Si8vAV6KxEM"
          title="SHOW BEHIND"
          className="w-full h-full"
          allowFullScreen
        />
      </div>

      {/* center text */}
      <div className="w-full flex justify-center">
        <p className="text-center text-sm md:text-base text-black/80 whitespace-pre-line">
          {sectionMessage}
        </p>
      </div>

      {/* images grid (scroll) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {imagePaths.map((src, idx) => (
          <div key={idx} className="w-full">
            <img
              src={src}
              alt={`Show behind ${idx + 1}`}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowBehindPage;
