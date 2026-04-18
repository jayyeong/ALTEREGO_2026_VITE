# KUAD 2026 ALTEREGO (Vite)

이 프로젝트는 React + Vite 기반으로 동작합니다.

## 실행

```bash
npm install
npm run dev
```

개발 서버 기본 주소: `http://localhost:5173/2026/`

## 빌드

```bash
npm run build
```

배포 베이스 경로는 `vite.config.mjs`의 `base: '/2026/'` 로 설정되어 있습니다.

## 환경 변수

- 개발: `.env.development`
- 배포: `.env.production`

사용 키:

```env
VITE_API_URL=...
```
