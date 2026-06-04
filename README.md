# KUAD 2026 ALTEREGO

건국대학교 의상디자인학과 2026 졸업전시회 `ALTER EGO` 웹사이트입니다.

이 프로젝트는 졸업전시의 주제, 팀별 프로젝트, 룩북, 런웨이, 비하인드, 아카이브를 한 곳에서 보여주기 위해 제작되었습니다. 전시 전체 페이지 오픈 전에는 스토어를 먼저 운영할 수 있도록 구성되어 있으며, 상품 조회, 주문서 작성, 주문 완료 확인, 관리자 주문 관리 기능을 함께 포함하고 있습니다.

프론트엔드는 React와 Vite 기반으로 개발되었고, 정적 파일은 AWS S3와 CloudFront를 통해 배포됩니다. 백엔드 API와 연동되는 스토어/관리자 기능은 환경 변수로 API 주소를 분리하여 로컬 개발 환경과 운영 환경을 나누어 사용할 수 있게 구성했습니다.

## 주요 기능

- `STORE`: 공식 굿즈 및 팀 굿즈 상품 목록, 상품 상세, 옵션별 수량 선택, 바로 주문 기능
- `CHECKOUT`: 입금 계좌 안내, 주문자 정보 입력, 주문 상품 및 총 금액 확인
- `ORDER COMPLETE`: 주문 완료 후 주문 내역, 입금 안내, 문의 연락처 확인
- `ADMIN`: 관리자 로그인, 주문 목록/상세 확인, 입금 상태 변경, 주문 삭제, 엑셀 내보내기, 상품 판매 상태 관리
- `PROJECT`: 전시 메인 테마, 팀별 소개, 포트폴리오 페이지
- `IMAGE`: 룩북, 런웨이 이미지 아카이브
- `BEHIND`: 쇼/브로슈어/메이킹 관련 비하인드 페이지
- `ARCHIVE`: 2024, 2025 이전 프로젝트 링크 및 포스터 기반 아카이브
- `COMING SOON`: 스토어 선오픈 기간 동안 미공개 페이지 접근을 안내 페이지로 전환

## 프로젝트 구조

```text
src/
  components/        공통 UI 컴포넌트
  config/            API 주소, 사이트 공개 모드 설정
  data/              팀, 멤버, 스토어 상품 상세, 입금 계좌 데이터
  pages/             라우트 단위 페이지
  utils/             이미지 경로, 날짜 포맷, 팀 순서 등 공통 유틸
public/              정적 파일, favicon, manifest, 이미지/영상 리소스
```

## 기술 스택

- React 19
- Vite 6
- React Router
- Tailwind CSS
- Axios
- AWS S3
- AWS CloudFront
- GitHub Actions

## 실행

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 아래와 같습니다.

```text
http://localhost:5173/2026/
```

`vite.config.mjs`에서 `/` 또는 `/2026`으로 접근했을 때 `/2026/`으로 이동하도록 개발 서버 리다이렉트가 설정되어 있습니다.

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

```bash
npm run preview
```

빌드 결과물을 로컬에서 확인할 때는 `preview` 명령어를 사용할 수 있습니다.

## 환경 변수

환경 변수 파일은 개발/운영 환경을 나누어 사용합니다.

```text
.env.development
.env.production
```

사용 중인 주요 환경 변수는 아래와 같습니다.

```env
VITE_API_URL=
VITE_STORE_ONLY_MODE=
```

- `VITE_API_URL`: 백엔드 API 서버 주소입니다. 값이 비어 있으면 현재 도메인을 기준으로 API를 호출합니다.
- `VITE_STORE_ONLY_MODE`: 기본값은 `true`입니다. `false`로 설정하면 메인/프로젝트/룩북/비하인드/아카이브 페이지 접근 제한을 해제합니다.

## 라우팅 기준

이 프로젝트는 2024, 2025, 2026 사이트를 같은 도메인에서 연도별 경로로 관리하기 위해 `base: '/2026/'`를 사용합니다.

```js
base: '/2026/'
```

따라서 운영 환경의 2026 사이트 기본 경로는 아래와 같습니다.

```text
https://www.kuadarchive.com/2026/
```

## 배포

`main` 브랜치에 push되면 GitHub Actions가 실행되어 `dist/`를 빌드한 뒤 S3 버킷의 `2026/` 경로로 업로드합니다. 업로드 후 CloudFront 캐시 무효화를 실행하여 변경사항이 빠르게 반영되도록 구성되어 있습니다.

배포 흐름은 아래와 같습니다.

```text
main push
→ GitHub Actions
→ npm ci
→ npm run build
→ S3 upload
→ CloudFront invalidation
```

`dev` 브랜치에서 작업한 뒤 확인이 끝나면 `main`으로 병합하여 배포하는 흐름을 기준으로 사용합니다.

## 개발 메모

- 스토어 선오픈 기간에는 `STORE_ONLY_MODE`를 통해 스토어 외 페이지를 `Coming Soon` 페이지로 보냅니다.
- 스토어 상품 이미지는 로컬 asset 경로와 서버 이미지 경로를 모두 처리할 수 있도록 공통 유틸로 관리합니다.
- 주문 완료 URL에는 백엔드에서 발급한 공개 토큰을 사용하여 단순 증가형 주문 번호 노출을 피하도록 구성했습니다.
- 관리자 페이지의 주문 시간 표시는 한국 시간 기준으로 포맷팅합니다.
- `dist/`는 빌드 결과물이므로 Git에 커밋하지 않습니다.
