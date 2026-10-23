import { API_URL } from './api';

export const clearAdminSession = () => {
  sessionStorage.removeItem('adminToken');
  sessionStorage.removeItem('adminAuth');
};

export const adminFetch = async (url, options = {}) => {
  const headers = new Headers(options.headers);
  const token = sessionStorage.getItem('adminToken');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    clearAdminSession();
    window.location.assign(`${import.meta.env.BASE_URL}admin`);
    throw new Error('관리자 로그인이 만료되었습니다.');
  }
  return response;
};

export const logoutAdmin = async () => {
  try {
    const response = await adminFetch(`${API_URL}/api/admin/logout`, { method: 'POST' });
    if (!response.ok) throw new Error('로그아웃에 실패했습니다. 다시 시도해 주세요.');
    clearAdminSession();
  } catch (error) {
    // Keep a valid token so a failed logout can be retried.
    throw error;
  }
};
