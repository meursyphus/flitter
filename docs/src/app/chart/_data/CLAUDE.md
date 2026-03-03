# Chart _data 폴더 가이드

## 폴더 구조

```
_data/
├── types.ts                 # 공용 타입 정의
├── index.ts                 # 모든 차트 pages를 합쳐서 export
├── bar-chart/
│   ├── index.ts             # overview + pages 배열 export
│   ├── toast/
│   │   └── index.ts         # toast style 데이터 (나중에 차트 컴포넌트도 여기)
│   └── advanced.ts          # advanced 페이지 데이터
├── line-chart/
│   └── index.ts             # overview만 있는 스켈레톤
└── ...
```

## 타입 구조 (Discriminated Union)

`ChartPageData = OverviewPageData | StylePageData | AdvancedPageData`

`pageType` 필드로 구분됩니다. 각 타입은 해당 페이지에 **필요한 필드만** 가집니다.

### 공통 (ChartPageBase)

```ts
{ slug: string[], title: string, description: string }
```

### OverviewPageData (`pageType: "overview"`)

차트의 랜딩 페이지. 스타일 소개 목록과 advanced 링크를 직접 가지고 있음.

```ts
{
  pageType: "overview",
  code?: { basic?: string },
  styles?: StyleSummary[],   // 스타일 소개 목록 (slug, title, tagline, inspiration)
  hasAdvanced?: boolean,     // advanced 페이지 존재 여부
}
```

### StylePageData (`pageType: "style"`)

특정 스타일의 상세 페이지. config, 예제 코드 등.

```ts
{
  pageType: "style",
  parent: string,            // overview의 slug[0] (예: "bar-chart")
  styleMeta: { tagline, features, inspiration? },
  code: {
    basic: string,           // 기본 사용 코드
    config: string,          // config 설정 코드
    fullConfigType: string,  // 전체 config 타입 정의
    examples: { title, code }[],
  },
  configSections: ConfigSection[],
}
```

### AdvancedPageData (`pageType: "advanced"`)

headless API, custom renderer 문서.

```ts
{
  pageType: "advanced",
  parent: string,
  code: { basic: string },
  customElements: CustomElement[],
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

## Style 페이지 추가

### 1. `_data/{chart-name}/toast/index.ts` 생성

`StylePageData`를 반환하는 함수를 export합니다.
basicCode는 overview와 공유하므로 인자로 받습니다.

```ts
import type { StylePageData, ConfigSection } from "../../types";

export function toastStyle(basicCode: string): StylePageData {
  return {
    slug: ["{chart-name}", "toast"],
    pageType: "style",
    parent: "{chart-name}",
    // ... styleMeta, code, configSections
  };
}
```

### 2. overview에 styles 등록

```ts
// {chart-name}/index.ts
{
  pageType: "overview",
  styles: [
    { slug: ["{chart-name}", "toast"], title: "Toast Style", tagline: "..." },
  ],
  hasAdvanced: true,
}
```

### 3. navigation.ts에 children 추가

```ts
{
  title: "{Chart Name}",
  href: "/chart/{chart-name}",
  children: [
    { title: "Toast", href: "/chart/{chart-name}/toast", kind: "style" },
    { title: "Advanced", href: "/chart/{chart-name}/advanced" },
  ],
},
```

## Advanced 페이지 추가

`_data/{chart-name}/advanced.ts`를 만듭니다.

```ts
import type { AdvancedPageData } from "../types";

export const advancedPage: AdvancedPageData = {
  slug: ["{chart-name}", "advanced"],
  pageType: "advanced",
  parent: "{chart-name}",
  code: { basic: `...` },
  customElements: [
    { element: "bar", args: "{ value: number }", description: "개별 바" },
  ],
};
```

## 규칙

- 각 차트 폴더는 `export const pages: ChartModule`을 반드시 export
- slug[0]은 차트 폴더 이름과 일치 (예: `["bar-chart"]`)
- style/advanced의 `parent`는 overview의 slug[0]과 일치
- basicCode는 overview와 style에서 공유 → index.ts에서 정의, style 함수에 인자로 전달
- style 폴더에 나중에 차트 React 컴포넌트도 함께 배치 가능
