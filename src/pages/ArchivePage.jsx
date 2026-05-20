import React from 'react';

const assetBase = import.meta.env.BASE_URL;

const archives = [
  {
    year: 2025,
    title: 'SOMA',
    href: '/2025/',
    poster: `${assetBase}poster/SOMA2025poster.webp`,
  },
  {
    year: 2024,
    title: 'Prototype',
    href: '/2024/',
    poster: `${assetBase}poster/prototype2024.webp`,
  },
];

const ArchivePage = () => {
  return (
    <div className="w-full flex justify-center px-8 md:px-36 py-12 md:py-12">
      <div className="w-full max-w-[1400px] text-left px-2 md:px-4 mx-auto">
        {/* <h1 className="block w-fit mx-auto border border-black px-5 py-2 text-3xl md:text-[32px] font-normal mb-10 md:mb-16 text-center font-[650]">ARCHIVE</h1> */}

        <div
          className="grid justify-items-start gap-x-8 gap-y-12 md:gap-x-12 md:gap-y-16 
                     grid-cols-2 
                     sm:grid-cols-3 
                     md:grid-cols-4 
                     lg:grid-cols-5 
                     xl:grid-cols-5"
          style={{ direction: 'ltr' }}
        >
          {archives.map((archive) => (
            <a
              key={archive.year}
              href={archive.href}
              style={{ direction: 'ltr' }}
              aria-label={`${archive.year} ${archive.title} archive`}
              className="group block w-full max-w-[180px] md:max-w-[220px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-white">
                <img
                  src={archive.poster}
                  alt={`${archive.year} ${archive.title} poster`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-3 pt-10 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-lg font-semibold leading-none">{archive.year}</span>
                  <span className="text-xs uppercase tracking-[0.2em]">{archive.title}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ArchivePage;
