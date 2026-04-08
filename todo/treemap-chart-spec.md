# Treemap Chart Spec Notes

## Current Direction

- treemap은 지금 flat node 초안에서 다시 잡아도 된다.
- treemap의 핵심은 axis chart가 아니라 `hierarchy + area layout`이다.
- 따라서 `bar-chart`와 비슷하게 가더라도 `labels: string[]`를 그대로 가져오면 의미가 어색하다.
- `bar-chart`에서 가져올 만한 감각은 `datasets[].legend`와 외부 주입 함수 패턴이다.
- treemap headless는 외부 `getLayout` / `getLayoutOptions`를 받는다.
- 현재 구현은 `datasets` top-level + node `children` 재귀 구조다.
- layout 결과는 rect 리스트가 아니라 `row/column + flex ratio` 트리다.

## Data Shape Draft

- top-level group은 `dataset`으로 둔다.
- 각 dataset의 `legend`는 treemap의 1-depth group label로 본다.
- 즉, bar-chart처럼 `datasets[]`는 유지하지만, `values[]` 대신 `children[]`를 둔다.
- `visible?: boolean`으로 dataset 초기 on/off를 줄 수 있다.

```ts
type TreemapNode = {
  label: string
  value?: number
  secondaryLabel?: string
  children?: TreemapNode[]
}

type TreemapDataset = {
  legend: string
  visible?: boolean
  value?: number
  secondaryLabel?: string
  children?: TreemapNode[]
}

type TreemapChartData = {
  datasets: TreemapDataset[]
}
```

- 색상은 data가 아니라 style config의 palette 책임으로 둔다.
- Storybook/example 데이터에서도 색을 명시하지 않는다.

- 예시 감각:

```ts
{
  datasets: [
    {
      legend: "Documents",
      children: [
        {
          label: "docs",
          children: [
            { label: "pages", value: 1.3 },
            { label: "keynote", value: 2.5 },
            { label: "numbers", value: 1.2 },
          ],
        },
        { label: "photos", value: 5.5 },
        { label: "videos", value: 20.7 },
      ],
    },
    {
      legend: "Application",
      value: 16.4,
    },
  ],
}
```

## Why Not `labels`

- treemap에는 bar / line 같은 공용 axis label 축이 없다.
- 여기서 `labels`를 두면 x축 category처럼 읽혀서 의미가 틀어진다.
- treemap의 label은 공통 차원 배열이 아니라 각 node 내부 속성으로 보는 편이 맞다.
- 필요하다면 `secondaryLabel` 같은 node-level 텍스트를 별도로 둔다.

## Layout Injection

- `bar-chart`의 `getScale`처럼 treemap도 layout 계산 함수를 외부에서 받을 수 있게 연다.
- 다만 이름은 `algorithm`보다 `layout`이 더 안정적이다.
- 이유:
  - headless가 필요한 건 알고리즘 이름이 아니라 최종 rect 계산 결과다.
  - 나중에 squarify / slice-and-dice / strip / custom layout을 모두 같은 계약으로 받을 수 있다.

```ts
type TreemapLayoutItem = {
  value: number
  index: number
}

type TreemapLayout = {
  kind: "leaf"
  index: number
} | {
  kind: "branch"
  direction: "row" | "column"
  children: {
    flex: number
    node: TreemapLayout
  }[]
}

type TreemapLayoutOptions = {
  mode?: "squarify" | "slice-vertical" | "slice-horizontal"
  preserveOrder?: boolean
}

type GetTreemapLayoutFn = (
  items: TreemapLayoutItem[],
  size: { width: number; height: number },
  options?: TreemapLayoutOptions,
) => TreemapLayout | null

type GetTreemapLayoutOptionsFn = (
  context: TreemapController,
) => TreemapLayoutOptions
```

- 기본값은 내부 node는 `squarify`, top-level group은 `slice-vertical` 방향을 우선 사용한다.

## Legend Meaning

- legend는 leaf item legend가 아니라 top-level group legend로 본다.
- 즉 `datasets[].legend` 토글은 대륙 / 부서 / 제품군 같은 큰 그룹 on/off 의미가 된다.
- 이건 bar-chart의 series toggle 감각과 가장 비슷하다.
- 반대로 leaf 하나하나를 legend에 올리는 건 treemap과 잘 안 맞는다.

## Label Meaning

- group label: dataset legend 또는 상위 node label
- tile label: leaf node label
- secondary label: value, percent, custom formatter 결과 등
- 작은 tile은 label을 숨기거나 축약해야 한다.

## Custom Widget Structure

```text
layout
  title
  legends[]
  plot
    treemap
      tree
        group
          groupTitle
          nodes
            tree
              node
                dataLabel
    tooltipArea
```

- `group`은 `title` 인스턴스와 `nodes` 인스턴스를 같이 받는다.
- AG에서는 `groupTitle`을 group 내부에 보여준다.
- Toast에서는 `groupTitle`을 style에서 숨긴다.
- `node`는 `dataLabel` 인스턴스를 받는다.
- hover 인터랙션은 headless `GestureDetector`에서 처리하고 style은 시각만 담당한다.
- layout tree는 headless가 만들고, 실제 배치는 `Flex + Flexible/Expanded`로 한다.

## Headless Responsibility

- dataset visible 상태 관리
- group / nested node 합계 집계
- visible dataset 필터링
- hovered node / anchor rect 상태
- top-level group layout tree 계산
- nested node layout tree 계산
- tooltip payload 생성용 상태 제공

## Open Questions

- 이후 재귀 depth를 열지
- legend 토글만 둘지, drilldown / breadcrumb까지 열어둘지
- 이후 `colorValue` 같은 색상용 보조 데이터 축을 열지
- tooltip 기본 단위를 `value`만 둘지 `value + percent of parent`까지 같이 줄지

## Reference

- `packages/chart/src/headless/bar-chart/types.ts`
- `todo/pie-chart-spec.md`
- `todo/radar-chart-spec.md`
