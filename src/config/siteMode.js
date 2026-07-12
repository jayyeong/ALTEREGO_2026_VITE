import { useEffect, useState } from 'react';

export const STORE_ONLY_MODE =
  import.meta.env.PROD && import.meta.env.VITE_STORE_ONLY_MODE === 'true';

export const PAGE_ACCESS_OVERRIDE_KEY = 'alteregoPageAccessUnlocked';
const PAGE_ACCESS_CHANGE_EVENT = 'alterego-page-access-change';

export const isPageAccessUnlocked = () => {
  if (!STORE_ONLY_MODE) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(PAGE_ACCESS_OVERRIDE_KEY) === 'true';
};

export const isSiteLocked = () => STORE_ONLY_MODE && !isPageAccessUnlocked();

export const setPageAccessUnlocked = (unlocked) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (unlocked) {
    window.localStorage.setItem(PAGE_ACCESS_OVERRIDE_KEY, 'true');
  } else {
    window.localStorage.removeItem(PAGE_ACCESS_OVERRIDE_KEY);
  }

  window.dispatchEvent(new Event(PAGE_ACCESS_CHANGE_EVENT));
};

export const useSiteLocked = () => {
  const [locked, setLocked] = useState(() => isSiteLocked());

  useEffect(() => {
    const syncLockedState = () => setLocked(isSiteLocked());

    syncLockedState();
    window.addEventListener('storage', syncLockedState);
    window.addEventListener(PAGE_ACCESS_CHANGE_EVENT, syncLockedState);

    return () => {
      window.removeEventListener('storage', syncLockedState);
      window.removeEventListener(PAGE_ACCESS_CHANGE_EVENT, syncLockedState);
    };
  }, []);

  return locked;
};
