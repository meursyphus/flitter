# flitter-chart shadcn 방식 전환 작업 계획

## 배경 및 목표

현재 flitter-chart는 headless 로직 + styled chart를 하나의 라이브러리로 제공하는 구조.
이를 **shadcn/ui 방식**으로 전환한다:

- **headless (순수 로직)** → npm 패키지 (`flitter-chart`)로 제공
- **스타일 코드 (toast, ag 등)** → CLI로 사용자 프로젝트에 복사. 사용자가 자유롭게 수정 가능

비유:
- `flitter-chart` headless = Radix (순수 로직, npm)
- 복사되는 스타일 코드 = shadcn (스타일 + UX, 사용자 소유)

---

## 현재 구조

```
packages/chart/              (npm: flitter-chart)
├── src/
│   ├── headless/            ← 순수 로직 (컨트롤러, 스케일, 프로바이더)
│   ├── shared/
│   │   ├── cartesian/       ← 축/그리드 기본 구조 컴포넌트
│   │   ├── bar-like/        ← BarBox, DataView, Grid
│   │   ├── line-like/
│   │   ├── point-like/
│   │   └── utils/           ← deepMerge, scale 계산
│   ├── styles/              ← toast, ag 테마 (삭제 대상)
│   └── charts/              ← styled chart 팩토리 (삭제 대상)

shared/chart-styles/         (내부용, 비공개)
├── charts/                  ← styled chart 구현체 25개
└── styles/                  ← toast, ag 글로벌 테마
```

---

## 새 구조

### npm 패키지 (`packages/chart` → `flitter-chart`)

순수 로직만 남긴다. 스타일이 조금이라도 개입된 것은 전부 제거.

```
packages/chart/src/
├── headless/                ← 유지 (22개 차트 로직)
│   ├── bar-chart/           (index, provider, chart, controller, types)
│   ├── line-chart/
│   ├── pie-chart/
│   └── ...
├── shared/
│   ├── cartesian/           ← 순수 구조만 유지 (Plot, getScale, Grid 레이아웃 등)
│   └── utils/               ← 유지 (deepMerge, scale 계산)
└── index.ts                 ← export: Headless, Cartesian, Utils + 모든 차트 타입
```

제거 대상 (npm에서 빠짐):
- `shared/bar-like/` → 템플릿으로 이동 (stacked 등 차트마다 다름)
- `shared/line-like/` → 템플릿으로 이동
- `shared/point-like/` → 템플릿으로 이동
- `styles/` → 템플릿으로 이동
- `charts/` → 템플릿으로 이동

### CLI (`packages/flitter`)

```
packages/flitter/
├── cli/
│   ├── index.ts             ← bin 엔트리포인트
│   ├── commands/
│   │   ├── init.ts          ← flitter.json 생성
│   │   └── add.ts           ← 차트 코드 복사
│   └── utils/
│       └── config.ts        ← flitter.json 읽기/쓰기
├── registry/
│   ├── registry.json        ← 메타데이터 (파일 목록, 의존성)
│   └── templates/           ← 실제 .ts 파일 (타입체크 가능)
│       ├── toast-base/
│       ├── toast-bar-chart/
│       ├── toast-line-chart/
│       ├── ag-base/
│       ├── ag-bar-chart/
│       └── ...
└── package.json             ← bin: { "flitter": "./cli/index.js" }
```

### 사용자 프로젝트 (생성 결과물)

`npx flitter add bar-chart --style toast` 실행 시:

```
src/components/chart/                ← flitter.json의 aliases.charts 경로
├── toast-base/                      ← 공통 (첫 toast 차트 add 시 자동 생성, 이미 있으면 스킵)
│   ├── config.ts                    ← ToastBaseConfig + defaultToastBaseConfig
│   ├── legend.ts                    ← toastLegend (전 차트 공통)
│   ├── title.ts
│   ├── tooltip.ts
│   ├── checkbox.ts
│   ├── colors.ts
│   ├── bar-like/                    ← BarBox, DataView, Grid (toast 버전)
│   ├── line-like/
│   ├── point-like/
│   └── cartesian/
│       ├── axis-label.ts
│       ├── axis-tick.ts
│       ├── axis-line.ts
│       ├── grid-line.ts
│       ├── x-axis.ts               ← 애니메이션 래퍼
│       ├── y-axis.ts
│       ├── layout.ts
│       └── axis-corner.ts
│
└── toast-bar-chart/                 ← 이번에 생성
    ├── index.ts                     ← Headless.BarChart에 custom 연결하는 팩토리
    ├── config.ts                    ← ToastBarChartConfig = ToastBaseConfig & { bar: {...} }
    └── parts/
        ├── bar.ts                   ← 바 스타일 (호버, 툴팁 포함)
        ├── bar-box.ts
        └── data-view.ts
```

### 내부 사용 (`shared/chart-styles`)

기존 `shared/chart-styles/`는 CLI로 생성한 코드를 활용하는 구조로 전환.
스토리북(`dev/chart-storybook/`)이 이 패키지를 참조.

---

## 생성되는 코드 형태

### import 규칙

```typescript
// npm 의존성 (수정 불가)
import { Headless, Cartesian, Utils } from "flitter-chart";
import type { BarChartCustom, BarChartContext, BarChartData } from "flitter-chart";
import { Container, Text, Row, StatefulWidget, State, ... } from "flitter-core";

// 복사된 코드 (수정 가능)
import { toastLegend, toastTitle } from "../toast-base";
import { toastXAxisLabel } from "../toast-base/cartesian/axis-label";
import { BarBox } from "../toast-base/bar-like/bar-box";
import { toastBar } from "./parts/bar";
import { defaultToastConfig, type ToastBarChartConfig } from "./config";
```

### toast-bar-chart/index.ts 예시

```typescript
import { Headless, Cartesian } from "flitter-chart";
import type { BarChartCustom, BarChartData } from "flitter-chart";
import { deepMerge } from "flitter-chart/utils";
import { toastLegend, toastTitle, toastScaleOptions } from "../toast-base";
import * as cartesian from "../toast-base/cartesian";
import { BarBox, DataView, Grid } from "../toast-base/bar-like";
import { BarGroup } from "./parts/bar-group";
import { type ToastBarChartConfig, defaultToastConfig } from "./config";
import { toastBar } from "./parts/bar";
import { toastBarBox } from "./parts/bar-box";
import { toastDataView } from "./parts/data-view";

const baseDefaults: Partial<BarChartCustom> = {
  barGroup: BarGroup,
  barBox: BarBox,
  dataView: DataView,
  plot: (...args) => Cartesian.Plot(args[0]),
  dataLabel: (...args) => Cartesian.DataLabel(args[0]),
  grid: Grid,
};

const toastCustom: Partial<BarChartCustom<ToastBarChartConfig>> = {
  layout: cartesian.toastLayout,
  bar: toastBar,
  dataView: toastDataView,
  barBox: toastBarBox,
  legend: toastLegend,
  title: toastTitle,
  axisCorner: cartesian.toastAxisCorner,
  xAxisLabel: cartesian.toastXAxisLabel,
  yAxisLabel: cartesian.toastYAxisLabel,
  xAxisTick: cartesian.toastXAxisTick,
  yAxisTick: cartesian.toastYAxisTick,
  xAxisLine: cartesian.toastXAxisLine,
  yAxisLine: cartesian.toastYAxisLine,
  gridXLine: cartesian.toastGridXLine,
  gridYLine: cartesian.toastGridYLine,
  xAxis: (args, context) =>
    cartesian.toastXAxis(args, { type: context.direction === "vertical" ? "label" : "value" }, context),
  yAxis: (args, context) =>
    cartesian.toastYAxis(args, { type: context.direction === "vertical" ? "value" : "label" }, context),
};

export default function ToastBarChart({
  data,
  config,
  direction = "vertical",
}: {
  data: BarChartData;
  config?: Partial<ToastBarChartConfig>;
  direction?: "vertical" | "horizontal";
}) {
  const mergedConfig = deepMerge(defaultToastConfig, config);
  return Headless.BarChart({
    data,
    direction,
    config: mergedConfig,
    custom: { ...baseDefaults, ...toastCustom } as BarChartCustom<ToastBarChartConfig>,
    getScale: (data, options) => Cartesian.getScale(data, options),
    getScaleOptions: (ctx) =>
      toastScaleOptions(ctx.direction === "vertical" ? ctx.height : ctx.width),
  });
}
```

---

## flitter.json (설정 파일)

shadcn의 `components.json`에 대응. 프로젝트 루트에 생성.

```json
{
  "$schema": "...",
  "tsx": true,
  "framework": "react",
  "aliases": {
    "charts": "@/components/chart"
  }
}
```

- `npx flitter init`으로 생성
- 이미 존재하면 덮어쓰지 않음
- 나중에 chart 외 다른 flitter 패키지도 추가 가능한 구조

---

## CLI 명령어

### `npx flitter init`

1. 프레임워크 감지 (React/Svelte)
2. `flitter.json` 생성
3. 이미 있으면 스킵

### `npx flitter add bar-chart --style toast`

1. `flitter.json` 읽기
2. `registry.json`에서 해당 차트 항목 찾기
3. `registryDependencies` 확인 → `toast-base/` 없으면 먼저 복사
4. `registry/templates/`에서 .ts 파일 읽기
5. import 경로 변환 (사용자 tsconfig alias에 맞게)
6. `aliases.charts` 경로에 파일 쓰기 (예: `src/components/chart/toast-bar-chart/`)
7. 이미 존재하는 폴더면 덮어쓸지 사용자에게 확인
8. `flitter-chart` npm 의존성 없으면 설치

---

## registry.json 구조

```json
{
  "items": [
    {
      "name": "toast-base",
      "files": [
        "toast-base/config.ts",
        "toast-base/legend.ts",
        "toast-base/title.ts",
        "toast-base/tooltip.ts",
        "toast-base/checkbox.ts",
        "toast-base/colors.ts",
        "toast-base/bar-like/bar-box.ts",
        "toast-base/bar-like/data-view.ts",
        "toast-base/bar-like/grid.ts",
        "toast-base/cartesian/axis-label.ts",
        "toast-base/cartesian/axis-tick.ts",
        "toast-base/cartesian/axis-line.ts",
        "toast-base/cartesian/grid-line.ts",
        "toast-base/cartesian/x-axis.ts",
        "toast-base/cartesian/y-axis.ts",
        "toast-base/cartesian/layout.ts",
        "toast-base/cartesian/axis-corner.ts"
      ]
    },
    {
      "name": "bar-chart",
      "style": "toast",
      "dependencies": ["flitter-chart"],
      "registryDependencies": ["toast-base"],
      "files": [
        "toast-bar-chart/index.ts",
        "toast-bar-chart/config.ts",
        "toast-bar-chart/parts/bar.ts",
        "toast-bar-chart/parts/bar-box.ts",
        "toast-bar-chart/parts/data-view.ts"
      ]
    },
    {
      "name": "line-chart",
      "style": "toast",
      "dependencies": ["flitter-chart"],
      "registryDependencies": ["toast-base"],
      "files": [
        "toast-line-chart/index.ts",
        "toast-line-chart/config.ts",
        "toast-line-chart/parts/line.ts",
        "toast-line-chart/parts/point.ts",
        "toast-line-chart/parts/data-view.ts"
      ]
    }
  ]
}
```

---

## 작업 목록 (순서대로)

### Phase 1: npm 패키지 정리 (`packages/chart`)

- [ ] 1-1. `shared/cartesian/`에서 순수 구조 컴포넌트와 스타일 개입 컴포넌트 분리
  - 순수 구조 (npm 유지): Plot, getScale, Grid 레이아웃, XAxis/YAxis 구조, DataLabel
  - 스타일 개입 (제거): XAxisLabel 기본 스타일, XAxisTick 기본 스타일 등
- [ ] 1-2. `shared/bar-like/`, `line-like/`, `point-like/` 제거 (템플릿으로 이동)
- [ ] 1-3. `styles/` 전체 제거
- [ ] 1-4. `charts/` 전체 제거
- [ ] 1-5. `index.ts` export 정리: Headless, Cartesian, Utils + 모든 차트 타입 export
- [ ] 1-6. 빌드 확인 (`npm run flitter:build` 또는 chart 빌드)

### Phase 2: 템플릿 코드 작성 (`packages/flitter/registry/templates/`)

- [ ] 2-1. `toast-base/` 작성
  - config.ts (ToastBaseConfig + defaults)
  - legend.ts, title.ts, tooltip.ts, checkbox.ts, colors.ts
  - bar-like/ (BarBox, DataView, Grid — toast 버전)
  - line-like/ (toast 버전)
  - point-like/ (toast 버전)
  - cartesian/ (axis-label, axis-tick, axis-line, grid-line, x-axis, y-axis, layout, axis-corner)
- [ ] 2-2. `toast-bar-chart/` 작성 (index.ts, config.ts, parts/)
- [ ] 2-3. `toast-line-chart/` 작성
- [ ] 2-4. `toast-stacked-bar-chart/` 작성
- [ ] 2-5. `toast-area-chart/` 작성
- [ ] 2-6. `toast-stacked-area-chart/` 작성
- [ ] 2-7. `toast-scatter-chart/` 작성
- [ ] 2-8. `toast-bubble-chart/` 작성
- [ ] 2-9. `toast-pie-chart/` 작성
- [ ] 2-10. `toast-radar-chart/` 작성
- [ ] 2-11. `ag-base/` 작성
- [ ] 2-12. `ag-bar-chart/` 작성
- [ ] 2-13. `ag-line-chart/` 및 나머지 ag 차트 작성
- [ ] 2-14. 모든 템플릿의 import 경로를 새 규칙에 맞게 변환
  - `@styles/toast` → `../toast-base`
  - `@headless/*` → `flitter-chart`
  - `@shared/cartesian` → `flitter-chart` (순수 구조) 또는 `../toast-base/cartesian` (스타일)
  - `@shared/bar-like` → `../toast-base/bar-like`
- [ ] 2-15. tsconfig.json에 templates 포함시켜 타입체크 통과 확인

### Phase 3: 레지스트리 메타데이터

- [ ] 3-1. `registry.json` 작성 (모든 차트의 파일 목록, 의존성)
- [ ] 3-2. 파일 목록이 실제 templates/ 구조와 일치하는지 검증 스크립트

### Phase 4: CLI 개발 (`packages/flitter/cli/`)

- [ ] 4-1. CLI 프로젝트 설정 (Commander.js, tsconfig, bin 등록)
- [ ] 4-2. `init` 커맨드 구현
  - 프레임워크 감지
  - flitter.json 생성
  - 중복 실행 방지
- [ ] 4-3. `add` 커맨드 구현
  - registry.json 읽기
  - registryDependencies 해석 (toast-base 등 자동 복사)
  - templates/ 파일 읽기 → 대상 경로에 쓰기
  - 이미 존재하는 폴더 처리 (확인 프롬프트)
  - npm 의존성 설치 (flitter-chart)
- [ ] 4-4. import 경로 변환 로직 (사용자 tsconfig alias 반영)
- [ ] 4-5. CLI 로컬 테스트 (`npx tsx cli/index.ts add bar-chart --style toast`)

### Phase 5: 내부 통합

- [ ] 5-1. `shared/chart-styles/`를 CLI 생성 코드 기반으로 전환
  - CLI로 생성한 파일을 chart-styles 패키지로 사용
  - 스토리북이 이 패키지를 참조
- [ ] 5-2. 기존 `shared/chart-styles/` 레거시 코드 정리/삭제
- [ ] 5-3. 스토리북(`dev/chart-storybook/`) 동작 확인

### Phase 6: 문서

- [ ] 6-1. 사용 가이드 (init → add → 사용 → 커스터마이징)
- [ ] 6-2. 마이그레이션 가이드 (기존 사용자용)
- [ ] 6-3. 새 스타일 만들기 가이드

---

## 핵심 결정 사항 요약

| 항목 | 결정 |
|------|------|
| 설정 파일 | `flitter.json` (chart 전용 아닌 flitter 통합) |
| 기본 출력 경로 | `@/components/chart` (shadcn의 `@/components/ui` 대응) |
| CLI 위치 | `packages/flitter` (bin 등록) |
| 템플릿 관리 | 실제 .ts 파일 (JSON 문자열 아님, 타입체크 가능) |
| npm에 남는 것 | headless, shared/cartesian 순수 구조, shared/utils |
| 복사되는 것 | 스타일 개입된 것 전부 (toast-base, ag-base, 각 차트 parts) |
| bar-like/line-like/point-like | 차트마다 다를 수 있으므로 복사 코드 (toast-base 내) |
| 공통 코드 (toast-base) | registryDependencies로 자동 복사, 이미 있으면 스킵 |
| 내부 사용 (chart-styles) | CLI 생성 결과물을 chart-styles 패키지로 사용 |
