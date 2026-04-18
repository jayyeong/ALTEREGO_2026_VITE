const assetModules = import.meta.glob('../assets/**/*', {
  eager: true,
  import: 'default',
});

export const resolveAssetUrl = (assetPath) => {
  if (!assetPath || typeof assetPath !== 'string') {
    return '';
  }

  if (/^https?:\/\//i.test(assetPath)) {
    return assetPath;
  }

  const normalizedPath = assetPath.replace(/^\.?\//, '');
  const resolved = assetModules[`../${normalizedPath}`];

  if (resolved) {
    return resolved;
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
