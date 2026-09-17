# KUAD 2026 ALTER EGO — Graduation Exhibition & Store

건국대학교 의상디자인학과 2026 졸업전시 웹사이트의 **React 프론트엔드**입니다. 전시 주제와 팀별 작품, 룩북·런웨이, 이전 연도 아카이브를 제공하며, 굿즈 주문과 관리자 운영 화면의 구현을 포함합니다.

**[사이트](https://www.kuadarchive.com/2026/) · [런웨이 최적화 PR #27](https://github.com/jayyeong/ALTEREGO_2026_VITE/pull/27) · [배포 워크플로](.github/workflows/deploy.yml)**

> **현재 코드의 동작:** `main`의 스토어·상품 상세·주문·주문 완료 경로는 모두 `StoreClosed` 안내 화면으로 연결됩니다. 주문 관련 컴포넌트는 소스에 남아 있습니다. 전시 페이지의 접근 여부는 공개 모드 설정에 따라 달라집니다. 아래 설명은 저장소 코드 기준이며 실제 배포 상태와는 차이가 있을 수 있습니다.

## 먼저 볼 구현

| 과제 | 구현 방식 | 코드·기록 |
| --- | --- | --- |
| 이미지가 많은 런웨이 갤러리의 로딩 부담 | 목록은 경량 썸네일과 lazy loading, 원본은 모달을 열 때 로딩 | [Runway.jsx](src/pages/Runway.jsx), [PR #27](https://github.com/jayyeong/ALTEREGO_2026_VITE/pull/27) |
| 이미지 탐색 | 전체 화면 모달, 이전·다음 버튼, 방향키와 ESC 지원 | [Runway.jsx](src/pages/Runway.jsx) |
| 주문 입력과 API 연동 | 필수 값·연락처 검증, 제출 중 중복 클릭 방지, 성공 후 공개 토큰 경로로 이동 | [CheckoutPage.jsx](src/pages/CheckoutPage.jsx) |
| 운영자 주문 관리 | 주문 목록·상태 변경·삭제, 상품 품절 관리, 기간별 엑셀 다운로드 | [AdminDashboard.jsx](src/pages/AdminDashboard.jsx) |
| 연도별 사이트 배포 | `/2026/` base 경로, S3 업로드, HTML과 정적 자산의 캐시 정책 분리, CloudFront 무효화 | [vite.config.mjs](vite.config.mjs), [deploy.yml](.github/workflows/deploy.yml) |

PR #27에는 갤러리 이미지 전송 용량을 **약 209MB → 2.1MB**로 줄였다는 기록이 있습니다. 이는 해당 PR에 기록된 수치이며, 전체 사이트 용량이나 페이지 로딩 시간의 측정 결과를 뜻하지 않습니다.

## 구현 범위와 현재 상태

- **전시:** 메인, 쇼 정보, 팀·작품 소개, 포트폴리오, 룩북, 런웨이, 비하인드, 2024·2025 아카이브.
- **스토어·주문:** 상품 목록·옵션 선택·주문서·주문 완료 컴포넌트가 있습니다. 현재 라우터에서는 종료 안내 화면을 보여줍니다.
- **관리자:** 로그인과 주문 관리 라우트가 있으며, 데이터 조회와 변경에는 별도 백엔드 API가 필요합니다.
- **공개 모드:** 프로덕션 빌드에서 `VITE_STORE_ONLY_MODE=true`이면 전시 페이지 접근을 제한합니다. 브라우저별 공개 설정 예외도 있습니다.

라우트의 기준은 [src/App.jsx](src/App.jsx)입니다. 공개 모드 설정을 바꿔도 현재 스토어·주문 경로는 다시 열리지 않습니다.

이 저장소에는 프론트엔드와 배포 워크플로가 포함되어 있습니다. 백엔드 서버·DB 구현은 포함되어 있지 않으므로, API 연동 코드와 서버 구현 범위를 구분해서 보아주세요.

## 기술 스택

React 19 · JavaScript · Vite 6 · React Router 7 · Tailwind CSS 3 · Axios  
AWS S3 · CloudFront · GitHub Actions

정확한 의존성은 [package.json](package.json)과 [package-lock.json](package-lock.json)에서 확인할 수 있습니다.

## 로컬 실행

현재 배포 워크플로와 동일한 Node.js 20 및 npm 환경을 기준으로 합니다.

```bash
npm ci
npm run dev
```

개발 서버: [http://localhost:5173/2026/](http://localhost:5173/2026/)  
포트가 사용 중이면 터미널에 표시된 주소를 사용합니다. 개발 서버의 `/`, `/2026` 요청은 `/2026/`으로 이동합니다.

### 환경 변수

기존 환경 파일을 직접 바꾸기보다 로컬 전용 `.env.development.local` 또는 `.env.production.local`에 필요한 값을 설정합니다.

```env
VITE_API_URL=
VITE_STORE_ONLY_MODE=false
```

| 변수 | 코드 기준 동작 |
| --- | --- |
| `VITE_API_URL` | API 서버의 기준 주소. 빈 값이면 현재 origin을 기준으로 요청합니다. 로컬에서 API 기능을 사용하려면 별도 백엔드 연결이 필요합니다. |
| `VITE_STORE_ONLY_MODE` | **프로덕션 빌드이면서 문자열이 정확히 `true`일 때만** 공개 제한 모드를 켭니다. 개발 서버에서는 이 제한이 적용되지 않습니다. |

설정 근거: [api.js](src/config/api.js), [siteMode.js](src/config/siteMode.js). `VITE_` 변수는 클라이언트에 노출되므로 비밀 키를 넣지 않습니다. 공개 모드는 화면 표시 제어이며 API 인증·인가를 대신하지 않습니다.

### 빌드와 미리보기

```bash
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 미리보기 서버에서 안내하는 주소의 `/2026/` 경로로 접근합니다. API 기능은 백엔드 없이 완전히 실행되지 않습니다.

## 프로젝트 구조

```text
src/
  components/        헤더, 스크롤 처리 등 공통 컴포넌트
  config/            API 주소와 페이지 공개 모드
  data/              팀·멤버·상품 상세 데이터
  pages/             전시·스토어·관리자 화면
  utils/             이미지 경로, 날짜 포맷, 팀 순서
public/              이미지·영상 등 정적 리소스
.github/workflows/   배포 자동화
```

## 배포

[deploy.yml](.github/workflows/deploy.yml)은 `main` push 또는 수동 실행으로 동작합니다.

```text
npm ci → npm run build → S3의 2026/ 경로 업로드 → CloudFront 캐시 무효화
```

- 정적 자산에는 장기 캐시를, `index.html`·아이콘·manifest에는 no-cache 정책을 적용합니다.
- AWS 자격 증명과 CloudFront 배포 ID는 GitHub Actions Secrets를 참조합니다.
- `main`에 README만 변경해도 현재 워크플로의 배포 조건에 해당합니다.

## 검증 현황과 다음 개선

현재 [package.json](package.json)에는 자동 테스트와 lint 스크립트가 없으며, 배포 워크플로는 의존성 설치와 빌드를 수행합니다. 빌드 성공과 사용자 흐름 검증은 별개입니다.

다음 개선 대상으로 주문 입력·오류 처리 테스트, 관리자 API 권한 검증, 이미지 모달의 포커스 이동 검증을 남깁니다. 아직 구현된 테스트나 완료된 개선으로 간주하지 않습니다.

## 관련 저장소

- [개발자 프로필](https://github.com/jayyeong)
- [ALTEREGO_2026](https://github.com/jayyeong/ALTEREGO_2026): Create React App 기반 이전 구현. 현재 프로젝트의 기준은 이 Vite 저장소입니다.
