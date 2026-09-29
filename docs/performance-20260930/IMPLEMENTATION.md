# KUAD 2026 성능 개선 · 2026-09-30

## 배경

운영 사이트 공개 화면 74개를 Lighthouse 12.8.2 모바일 설정으로 진단했다. 성능 평균 81.1점, 범위 54–100점이었다. 일부 페이지는 고득점이어도 수십 MiB의 이미지를 전송하므로 점수와 전송량을 함께 개선 대상으로 삼았다.

## 변경

- `ResponsiveImage`: 실제 이미지 메타데이터의 비율을 예약하고 `srcset`·`sizes`로 적절한 해상도를 선택한다. 첫 화면 이미지는 eager/high priority, 나머지는 native lazy loading을 사용한다. 원본 이미지와 확대 모달은 유지한다.
- 이미지 930개: 원본을 수정하지 않고 WebP 품질 88, 프로필 192/384/768px, 일반 이미지 384/768/1440/2200px의 파생본을 생성한다. 원본보다 확대하지 않는다. 콘텐츠+인코딩 설정 해시를 URL에 넣어 immutable 캐시에서 새 파일을 구별한다.
- 룩북: 292장 이미지의 공간을 미리 예약해 한꺼번에 다운로드되는 현상을 방지한다. 축소 이미지 픽셀 반올림에 따른 목차 위치 이동은 명시적 CSS aspect-ratio로 방지한다.
- 글꼴: 기존 AppFont 및 굵기·문자 범위를 유지한다. 콘텐츠 한글 672자를 117,896B WOFF2로 제공하며 나머지 지원 한글 글자는 서로 겹치지 않는 fallback 조각으로 보존한다. Open Sans WOFF2는 114,104B다. 원본 TTF는 삭제하지 않는다.
- 홈: 원본 영상은 데스크톱에 유지하고 모바일은 최대 1280×720, H.264 CRF22 파생본을 사용한다. 원본 오디오가 있으면 유지한다. 첫 장면 poster, metadata preload, faststart를 적용하고 자동재생·이전/다음 동작은 유지한다.
- 팀의 화면 아래 YouTube iframe은 lazy loading한다.

## 재현

```bash
npm ci
npm run build
```

`prebuild`·`predev`·`prestart`에서 `npm run media:generate`를 실행한다. Git sparse checkout으로 미디어를 생략하면 생성 단계가 실패하도록 하여 불완전한 배포를 막는다. 첫 생성은 수분 걸리며 다음 실행은 해시가 같은 파생본을 재사용한다. 생성된 이미지와 런타임 manifest는 Git에서 제외하며 빌드 시 재생성한다. 원본 이미지는 그대로 추적·보관한다.

폰트와 영상 파생본은 저장소에 포함한다. 다시 만들려면:

```bash
# Python 환경에 fonttools[woff] 설치 후
python scripts/generate-fonts.py
# ffmpeg 설치 후
npm run media:videos
```

## 검증과 주장 범위

74개 페이지 × 모바일 412×823 / 데스크톱 1440×1000 = 148회 화면 검사에서 첫 화면 이미지 로딩 실패, 가로 넘침, 잘못된 멤버/팀 경로, JavaScript 오류가 없었다. 룩북 마지막 팀 목차, 사진 모달 열기·다음·Escape 닫기, 모바일 영상 자동재생·다음 전환을 확인했다. 폰트·이미지 변경 전후 전시 정보 화면을 육안 비교했다.

성능 수치는 별도 결과 문서에서 개선 전후 동일한 로컬 압축 서버·Chrome·Lighthouse 설정의 결과로 비교한다. 운영 사이트 초기 진단과 로컬 개선본 수치를 직접 같은 환경의 전후 성과로 혼용하지 않는다. 실사용자 Core Web Vitals, 전환율, 운영 비용 절감은 측정하지 않았다.

## 원본과 범위 보호

기존 README·App·Store 관련 미배포 수정은 이번 성능 변경과 별개다. 백엔드·주문·관리자 데이터, 인증, AWS 인프라, 외부 메시지 전송은 수정하지 않는다. 원본 파일을 삭제하지 않으므로 배포 저장 공간 감소를 성과로 주장하지 않는다.

## 참고

- https://web.dev/articles/browser-level-image-lazy-loading
- https://web.dev/articles/font-best-practices
- https://web.dev/articles/lazy-loading-video
- https://developer.chrome.com/docs/lighthouse/performance/performance-scoring

## 후속 검토

개선 후에도 모바일 일부 화면의 LCP는 3–5초다. 남은 렌더링 차단 CSS·초기 JavaScript 비용은 후속 검토 대상이며, 모든 화면 90점 이상이나 Core Web Vitals 통과를 주장하지 않는다. 외부 영상 iframe을 재생 클릭 후 로딩하는 방식은 사용자 경험을 바꾸므로 이번 변경에는 포함하지 않았다.
