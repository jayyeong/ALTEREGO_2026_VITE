import React from 'react';
import images from '../data/responsive-images.json';
import { resolveAssetUrl, withBaseUrl } from '../utils/assets';

// Keep originals as a fallback; generated URLs are content-hashed for immutable caches.
export default function ResponsiveImage({ src, sizes = '100vw', priority = false, loading, decoding = 'async', ...props }) {
  const key = src?.replace(import.meta.env.BASE_URL, '').replace(/^\.?\//, '');
  const image = images[key];
  const fallback = image?.variants.find(v => v.width >= 768) || image?.variants.at(-1);
  return <img
    {...props}
    style={image ? { aspectRatio: `${image.width} / ${image.height}`, ...props.style } : props.style}
    src={fallback ? withBaseUrl(fallback.src) : resolveAssetUrl(src)}
    srcSet={image?.variants.map(v => `${withBaseUrl(v.src)} ${v.width}w`).join(', ')}
    sizes={image ? sizes : undefined}
    width={image?.width}
    height={image?.height}
    loading={priority ? 'eager' : (loading || 'lazy')}
    fetchPriority={priority ? 'high' : 'auto'}
    decoding={decoding}
  />;
}
