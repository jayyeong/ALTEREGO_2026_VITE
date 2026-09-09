export const resolveAssetUrl = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.replace(/^\.?\//, '');

  if (normalizedPath.startsWith('assets/')) {
    const servedPath = import.meta.env.DEV ? `src/${normalizedPath}` : normalizedPath;
    return `${import.meta.env.BASE_URL}${servedPath}`;
  }

  if (normalizedPath.startsWith('src/assets/')) {
    const servedPath = import.meta.env.DEV
      ? normalizedPath
      : normalizedPath.replace(/^src\//, '');
    return `${import.meta.env.BASE_URL}${servedPath}`;
  }

  return assetPath;
};

export const withBaseUrl = (path = '') => {
  if (!path || typeof path !== 'string') {
    return import.meta.env.BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};
