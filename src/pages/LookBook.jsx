import React, { useEffect, useState, useMemo } from "react";

const LookBook = () => {
  const [scrollOffset, setScrollOffset] = useState(8);

  useEffect(() => {
    const updateScrollOffset = () => {
      const width = window.innerWidth;

      const desktopHeader = document.querySelector("header");
      const mobileHeader = document.querySelector(".lg\\:hidden .sticky");

      const headerEl =
        width >= 1024
          ? desktopHeader
          : mobileHeader;

      if (!headerEl) {
        setScrollOffset(8);
        return;
      }

      const headerRect = headerEl.getBoundingClientRect();
      const computed = window.getComputedStyle(headerEl);
      const isOverlayHeader =
        computed.position === "fixed" || computed.position === "sticky";

      setScrollOffset(isOverlayHeader ? Math.ceil(headerRect.height + 10) : 8);
    };
    updateScrollOffset();
    window.addEventListener("resize", updateScrollOffset);
    window.addEventListener("load", updateScrollOffset);

    const rafId = window.requestAnimationFrame(updateScrollOffset);

    return () => {
      window.removeEventListener("resize", updateScrollOffset);
      window.removeEventListener("load", updateScrollOffset);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const imagePaths = useMemo(
    () =>
      Array.from({ length: 252 }, (_, i) => {
        const suffix = i === 0 ? "" : `${i}`;
        return `/2026/lookbook/SOMA2025${suffix}.jpg`;
      }),
    []
  );

  const teamToc = useMemo(
    () => [
      { name: "AGIOTITA", index: 6 },
      { name: "BIPOLAR", index: 48 },
      { name: " \" - - - \" ", index: 96 },
      { name: "Dialysis", index: 138 },
      { name: "표류[]기", index: 180 },
      { name: "자각몽", index: 218 },
      { name: "TEAM 7", index: 250 },
    ],
    []
  );

  const scrollToImage = (index) => {
    const safeIndex = Math.max(0, Math.min(imagePaths.length - 1, index));
    const target = document.getElementById(`lookbook-image-${safeIndex}`);
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const renderImageGrid = (withIds = false) => (
    <div className="grid grid-cols-2 gap-x-0 gap-y-1.5">
      {imagePaths.map((src, i) => (
        <div
          id={withIds ? `lookbook-image-${i}` : undefined}
          key={i}
          className="w-full bg-gray-100"
          style={withIds ? { scrollMarginTop: `${scrollOffset}px` } : undefined}
        >
          <img
            src={src}
            alt={`lookbook-${i + 1}`}
            className="w-full h-auto block object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="w-full">
        {/* PC: 좌측 고정 리모콘 + 우측 이미지 */}
        <div className="hidden lg:grid grid-cols-[280px_minmax(0,1fr)]">
          <aside className="bg-white border-r border-black/5">
            <div className="sticky top-0 px-6 py-6 pb-8 flex flex-col">


              <ul className="overflow-y-auto pr-1 max-h-[calc(100dvh-130px)]">
                {teamToc.map((team) => (
                  <li key={team.name}>
                    <button
                      type="button"
                      onClick={() => scrollToImage(team.index)}
                      className="w-full text-right text-sm py-3 px-1 font-normal text-black/75 hover:text-black hover:font-bold transition"
                    >
                      {team.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="pl-8 pr-8 pb-10">
            <div className="w-full ml-auto">
              {renderImageGrid(true)}
            </div>
          </section>
        </div>

        {/* Mobile: 기존 이미지만 */}
        <div className="lg:hidden px-4 pb-10">{renderImageGrid(false)}</div>
      </div>
    </div>
  );
};

export default LookBook;
