import React, { useEffect, useState, useMemo } from "react";

const LOOKBOOK_PAGE_COUNT = 292;
const LOOKBOOK_BASE_PATH = `${import.meta.env.BASE_URL}lookbook/`;

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
      Array.from({ length: LOOKBOOK_PAGE_COUNT }, (_, i) => {
        const pageNumber = String(i + 1).padStart(3, "0");
        return `${LOOKBOOK_BASE_PATH}lookbook-${pageNumber}.webp`;
      }),
    []
  );

  const teamToc = useMemo(
    () => [
      { name: "Limbo", index: 6 },
      { name: "(Un)skinned", index: 58 },
      { name: "Dreamscape", index: 96 },
      { name: "Tiny Lodge", index: 140 },
      { name: "11:11", index: 178 },
      { name: "Thorn Bloom", index: 212 },
      { name: "RE:I", index: 242 },
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
      <div className="w-full bg-white" aria-hidden="true" />
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

        <div className="lg:hidden px-4 pb-10">{renderImageGrid(false)}</div>
      </div>
    </div>
  );
};

export default LookBook;
