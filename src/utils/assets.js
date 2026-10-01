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

export { withBaseUrl } from './paths';
