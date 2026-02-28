# Chart Package Architecture

## Chart 폴더 구조 원칙

각 차트는 `src/charts/{chart-name}/` 아래에 동일한 구조를 따른다.

### 폴더 구조

```
src/charts/{chart-name}/
├── index.ts          # 공개 진입점 (factory function)
├── plugin.ts         # 스타일 레지스트리 (StyleConfig 패턴)
├── headless.ts       # headless 컴포넌트/타입 re-export
└── {style-name}/     # 스타일별 구현 폴더 (예: toast/)
    ├── config.ts     # 스타일 전용 config 타입 + 기본값
    ├── index.ts      # custom 객체, getScaleOptions 등 export
    └── parts/        # 개별 시각 요소 렌더러
        ├── layout.ts
        ├── {data-part}.ts   # 차트 고유 데이터 파트 (bar, line, scatter 등)
        ├── legend.ts
        ├── title.ts
        ├── x-axis.ts, y-axis.ts
        ├── x-axis-label.ts, y-axis-label.ts
        ├── x-axis-tick.ts, y-axis-tick.ts
        ├── x-axis-line.ts, y-axis-line.ts
        ├── grid-x-line.ts, grid-y-line.ts
        └── axis-corner.ts
```

### 각 파일의 역할

#### `index.ts` - 공개 진입점
- `style` 파라미터로 스타일 선택
- `plugin.ts`에서 해당 스타일의 `StyleConfig`를 가져옴
- `HeadlessXxxChart`에 resolved config와 custom을 전달

```typescript
export default function XxxChart<S extends keyof XxxChartStyleMap>({
  style, config, data, custom, getScaleOptions, ...rest
}: { ... }): Widget {
  const sc = xxxChartStyleConfigs[style];
  return HeadlessXxxChart({
    data,
    config: sc.createConfig(config),
    custom: { ...sc.custom, ...custom },
    getScaleOptions: getScaleOptions ?? sc.getScaleOptions,
    ...rest,
  });
}
```

#### `plugin.ts` - 스타일 레지스트리
- `StyleConfig<TConfig>` 타입: `{ custom, createConfig, getScaleOptions }`
- 스타일 이름 → Config 타입 매핑 (`XxxChartStyleMap`)
- `deepMerge`로 config 병합

```typescript
export type StyleConfig<TConfig> = {
  custom: Partial<XxxChartCustom<TConfig>>;
  createConfig: (config?: Partial<TConfig>) => TConfig;
  getScaleOptions: GetScaleOptionsFn;
};

export type XxxChartStyleMap = {
  toast: ToastXxxChartConfig;
};

export const xxxChartStyleConfigs: { [S in keyof XxxChartStyleMap]: StyleConfig<XxxChartStyleMap[S]> } = {
  toast: {
    custom: toastCustom,
    createConfig: (config) => deepMerge(defaultToastConfig, config),
    getScaleOptions: toastGetScaleOptions,
  },
};
```

#### `headless.ts` - headless re-export
- `@headless/{chart-name}`에서 컴포넌트, 타입, 컨트롤러 re-export
- charts 레벨에서의 headless 접근 레이어

```typescript
export { default as HeadlessXxxChart } from "@headless/xxx-chart";
export type { XxxChartCustom, XxxChartData, ... } from "@headless/xxx-chart/types";
export { XxxChartController } from "@headless/xxx-chart/controller";
```

#### `{style}/index.ts` - 스타일 custom 객체
- `toastCustom` 객체: 모든 custom 렌더러 매핑
- `toastGetScaleOptions`: 스케일 옵션 계산 함수
- `defaultToastConfig` re-export
- **팩토리 함수를 export하지 않는다** - custom 객체와 config만 export

```typescript
export const toastCustom: Partial<XxxChartCustom<ToastXxxChartConfig>> = {
  layout: toastLayout,
  // ... 각 파트 매핑
};

export const toastGetScaleOptions: GetScaleOptionsFn = (ctx) => ({ ... });

export { defaultToastConfig, type ToastXxxChartConfig } from "./config";
```

#### `{style}/config.ts` - 스타일 config
- `ToastBaseConfig`을 확장한 차트 전용 config 타입
- 기본값 객체

### 새 스타일 추가 시

1. `{style-name}/` 폴더 생성 (config.ts, index.ts, parts/)
2. `plugin.ts`의 `StyleMap`에 새 스타일 추가
3. `index.ts`는 수정 불필요 (제네릭으로 자동 확장)

### 핵심 설계 원칙

- **관심사 분리**: headless(로직) / style(시각) / plugin(연결) 분리
- **팩토리 금지**: toast/index.ts에서 위젯 팩토리 함수 대신 config 객체만 export
- **deepMerge 사용**: config 병합 시 spread 대신 `deepMerge` 사용 (중첩 객체 보존)
- **shared 위임**: 공통 요소(axis, grid, legend 등)는 `@shared/toast/`에 위임
- **context 기반**: custom 함수는 `(args, context)` 형태로 config와 controller에 접근
