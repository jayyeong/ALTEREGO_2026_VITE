import React from 'react';

const archives = [
 
  { year: 2025, url: 'https://kuad-archive.com/2025/' },
  { year: 2024, url: 'https://kuad-archive.com/2024/' },
];

const ArchivePage = () => {
  return (
    <div className="w-full flex justify-center px-8 md:px-36 py-12 md:py-12">
      
      <div className="w-full max-w-[1400px] text-left px-2 md:px-4 mx-auto">
        {/* <h1 className="block w-fit mx-auto border border-black px-5 py-2 text-3xl md:text-[32px] font-normal mb-10 md:mb-16 text-center font-[650]">ARCHIVE</h1> */}

        <div
          className="grid justify-items-start gap-x-12 gap-y-14 md:gap-x-14 md:gap-y-16 
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
              href={archive.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ direction: 'ltr' }}
              className="block w-full max-w-[140px] md:max-w-[165px]"
            >
              <div className="aspect-[3/4] border border-black flex items-center justify-center text-xl md:text-2xl font-medium md:font-semibold hover:bg-black hover:text-white transition-all duration-300">
                {archive.year}
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ArchivePage;
