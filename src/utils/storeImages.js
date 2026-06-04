import { resolveAssetUrl } from './assets';

const createPlaceholder = (label = 'No Image') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <rect width="600" height="600" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="#9ca3af" font-family="Arial, sans-serif" font-size="32">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getStoreImageSrc = (imagePath, fallbackLabel) => {
  if (imagePath?.startsWith('assets/')) {
    return resolveAssetUrl(imagePath);
  }

  return imagePath || createPlaceholder(fallbackLabel);
};

export const setStoreImageFallback = (event, fallbackLabel) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = createPlaceholder(fallbackLabel);
};
