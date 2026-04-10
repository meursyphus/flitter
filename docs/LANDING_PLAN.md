# Landing Page Redesign Plan

## Design Principles

- **글자는 적을수록 좋다** — 웹은 문서가 아니다
- **카드 배치 절대 금지** — 밋밋하고 어차피 읽지 않음
- **포인트 + 폰트 계층으로 리듬감** — 심심하지 않게
- **영역은 이미지/영상/컴포넌트로 채운다** — 텍스트로 설명하지 않기
- 참고: AG Grid (인터랙티브 데모 중심), TanStack (사이드바 레이아웃)

## Design Tone

- **라이트 테마** 기반
- 폰트: Pretendard 대신 Helvetica (Neue) 계열 또는 별도 선정 (랜딩 전용 폰트 가능)
- 악센트: 블루 계열
- 사이드바 레이아웃 유지
- 헤더 리뉴얼: 로고 새로 (main 브랜치 로고 참고, 블루 계열, SVG, 귀여운 느낌)

## Main Landing

### 역할
- Flitter = 웹용 렌더링 엔진이라는 정체성
- 하위 제품(Chart, Diagram 등)으로의 진입점
- 엔진 자체의 힘을 인터랙티브로 보여주기

### 구조 — main 브랜치 랜딩 구성을 따라감
1. **Intro** — 타이틀 + 코드 데모 (라이트 테마 버전으로)
2. **Showcase** — 차트 캐러셀 (shared/chart-presets 활용, 크기/등장 타이밍 조정)
3. **Why** — Flutter vs Flitter 비교 (이미지 기반)
4. **Coding** — Lottie + GSAP 스크롤 연동 인터랙션 (라이트 테마 버전)
5. **Last** — CTA

### 변경사항 vs main 브랜치
- 다크 → 라이트 테마
- 멀티컬러 → 블루 계열 통일
- 차트 캐러셀: 외부 이미지 → shared/chart-presets 컴포넌트 사용
- 로고: 새 SVG 로고 (블루, 귀여운)
- 폰트 변경

## Chart Landing

### 핵심 메시지 (딱 두 가지)
1. **원하는 거 커스텀해라** — 모든 요소가 위젯, 마음대로 교체
2. **코드 다운받아 써라 (like shadcn)** — `npx flitter-ui add bar-chart`

### 구성
1. **큰 배너** — 여기가 차트 영역임을 확실히. 강한 폰트 계층, 리듬감. CLI 명령어 노출.
2. **베네핏** — 설명조 금지. 커스텀 + 코드 소유를 비주얼로 보여주기.
3. **복잡한 차트 데모 1** — (직접 기획 예정, 영역만 확보)
4. **복잡한 차트 데모 2** — (직접 기획 예정, 영역만 확보)

### 제거 대상 (현재 차트 랜딩에서)
- "How It's Different" config vs widget 비교 → 설명조
- "What You Can Build" 6개 카드 그리드 → 카드 금지
- "Works With AI Assistants" 배너 → 띠배너 느낌

## Bonus Tasks

### 갤러리 썸네일 스크립트 (generate-gallery-thumbnails.mts)
- 현재: linkedom SSR → SVG 출력 (Canvas 차트 미지원)
- 변경: Playwright로 교체하여 정확한 렌더링
