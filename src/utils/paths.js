export const withBaseUrl = (path = '') => {
  if (!path || typeof path !== 'string') {
    return import.meta.env.BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
};
