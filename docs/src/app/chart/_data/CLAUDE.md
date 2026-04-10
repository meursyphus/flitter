# Chart _data 폴더 가이드

## 폴더 구조

```
_data/
├── types.ts                 # 공용 타입 정의
├── index.ts                 # 모든 차트 pages를 합쳐서 export
├── api/                     # 차트별 API 레퍼런스 데이터
│   ├── common.ts            # 공통 config (colors, font, title, legend, axis, grid, etc.)
│   ├── index.ts
│   └── {chart-name}.ts      # 차트별 dataFormat, config, customParts, context
├── gallery/                 # 갤러리 시스템
│   ├── entries/             # 차트×스타일 React 컴포넌트 (auto-generated)
│   ├── thumbnails/          # SVG 썸네일 (auto-generated)
│   ├── entries.generated.ts # 자동 생성 엔트리 목록
│   ├── types.ts
│   └── index.ts
├── bar-chart/
│   └── index.tsx            # overview 페이지 데이터
├── line-chart/
│   └── index.tsx
└── ...
```

## 타입 구조 (Discriminated Union)

`ChartPageData = OverviewPageData | GalleryIndexPageData | GalleryDetailPageData | ApiPageData`

`pageType` 필드로 구분됩니다.

### 공통 (ChartPageBase)

```ts
{ slug: string[], title: string, description: string }
```

### OverviewPageData (`pageType: "overview"`)

차트의 랜딩 페이지.

```ts
{
  pageType: "overview",
  quickStartCode?: string,
}
```

### GalleryIndexPageData (`pageType: "gallery-index"`)

갤러리 목록 페이지.

### GalleryDetailPageData (`pageType: "gallery-detail"`)

갤러리 개별 차트 상세 (Component, files, installCommand).

### ApiPageData (`pageType: "api"`)

차트별 API 레퍼런스.

```ts
{
  pageType: "api",
  parent?: string,
  dataFormat?: { typeName, typeDefinition, description },
  agConfig?: { sections: ConfigSection[] },
  toastConfig?: { sections: ConfigSection[] },
  customParts?: CustomElement[],
  context?: { typeName, properties: ContextProperty[] },
  overrideExample?: string,
}
```

## 새 차트 추가 방법

### 1. 폴더 생성 — `_data/{chart-name}/index.ts`

```ts
import type { ChartModule } from "../types";

export const pages: ChartModule = [
  {
    slug: ["{chart-name}"],
    title: "{Chart Name}",
    description: "한 줄 설명",
    pageType: "overview",
  },
];
```

### 2. `_data/index.ts`에 import 추가

```ts
import { pages as myChart } from "./{chart-name}";
// chartPages 배열에 ...myChart 추가
```

### 3. `docs/src/lib/navigation.ts`에 네비게이션 추가

```ts
{ title: "{Chart Name}", href: "/chart/{chart-name}" },
```

## 규칙

- 각 차트 폴더는 `export const pages: ChartModule`을 반드시 export
- slug[0]은 차트 폴더 이름과 일치 (예: `["bar-chart"]`)
- gallery entries와 thumbnails는 자동 생성됨
