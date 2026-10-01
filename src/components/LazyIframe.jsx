import React, { useEffect, useRef, useState } from 'react';

// Native iframe lazy loading can start far below the viewport. Keep the
// reserved frame size, and connect the player when its frame becomes visible.
export default function LazyIframe({ src, ...props }) {
  const ref = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setLoadedSrc(src);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setLoadedSrc(src);
        observer.disconnect();
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [src]);
  return <iframe {...props} ref={ref} src={loadedSrc === src ? src : undefined} />;
}
