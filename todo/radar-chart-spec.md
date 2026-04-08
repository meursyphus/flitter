# Radar Chart Spec Notes

## Current Direction

- radar는 `angular` / `radial` 용어를 유지한다.
- cartesian chart의 `grid` 같은 역할이 있긴 하지만, radar에서는 그 묶음 이름을 `grid` 대신 `web`으로 둔다.
- `plot`은 바깥 `angularItems` 크기를 포함해서 내부 radar 영역 크기를 계산하는 layout owner 역할을 맡는다.
- `radialAxis`는 내부 값 축 라벨 배치와 `web` 레이어를 함께 다룬다.

## Types

```ts
type AngularItem = {
  angle: number
  label: Widget
}

type RadialItem = {
  ratio: number
  value: number
  label: Widget
}
```

```ts
plot: (args: {
  dataView: Widget
  tooltipArea: Widget
  radialAxis: Widget
  angularItems: AngularItem[]
}, context) => Widget

radialAxis: (args: {
  web: Widget
  items: RadialItem[]
}, context) => Widget

web: (args: {
  angularLines: { ratio: number; line: Widget }[]
  radialLines: { angle: number; line: Widget }[]
}, context) => Widget
```

## Widget Structure

```text
layout
  title
  legends
  plot
    inner radar square
      radialAxis
        web
          angularLines[]
          radialLines[]
        radialItems[]
      dataView
      tooltipArea
    angularItems[]
```

## Responsibility

- `plot`
  - `angularItems`를 먼저 측정한다.
  - 바깥 label 크기를 감안해 내부 radar 반경과 square를 계산한다.
  - 계산된 내부 영역 안에 `radialAxis`, `dataView`, `tooltipArea`를 겹쳐 놓는다.

- `radialAxis`
  - 내부 square를 기준으로 `radialItems`를 ratio 위치에 배치한다.
  - `radial` label gap 규칙도 여기서 처리한다.
  - `web`과 같은 좌표계를 공유한다.

- `web`
  - 실제 repetition/layout owner다.
  - `angularLines`를 ratio별로 축소 배치한다.
  - `radialLines`를 angle별로 회전 배치한다.
  - 결과적으로 spoke + polygon ring 전체를 합친 거미줄 레이어가 된다.

## Hover / Tooltip

- hover 판정은 style 내부 local state가 아니라 headless `dataView` 쪽에서 처리한다.
- `dataView`는 mouse move 기준으로 두 종류의 hover 정보를 계산한다.
- `hoveredRadar`
  - 가장 가까운 radar polygon 기준
  - AG-style dataset 강조와 dataset tooltip에 사용
- `hoveredPoint`
  - 가장 가까운 vertex 기준
  - Toast-style active point marker와 single-point tooltip에 사용
- tooltip 내용은 headless에서 `tooltip` / `tooltipArea` 슬롯으로 내려준다.

```ts
tooltip: (args: {
  label: string
  items: { legend: string; color: string; value: number }[]
}, context) => Widget

tooltipArea: (args: {
  hoveredRadar: { index: number; legend: string } | null
  hoveredPoint: { index: number; legend: string; pointIndex: number } | null
}, context) => Widget
```

- AG에서는 `hoveredRadar` 기준으로 dataset 전체 tooltip을 만들고 마우스를 따라다니게 둔다.
- Toast에서는 `hoveredPoint` 기준으로 point 1개 tooltip을 만들고 해당 vertex에 anchor시킨다.

## Naming Notes

- `grid`는 cartesian/사각 격자 느낌이 강해서 radar에는 덜 맞는다.
- `axisLayer`는 역할 설명은 되지만 이름이 너무 일반적이다.
- `web`은 radar/spider chart 문맥에서 ring + spoke 묶음을 자연스럽게 가리킨다.

## Reference

- `todo/pie-chart-spec.md`
- `packages/chart/registry/templates/charts/pie-chart/base/plot.ts`
- `packages/chart/src/headless/line-chart/chart.ts`
