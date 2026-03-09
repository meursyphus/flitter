# Non-Dual Style Audit

## 1. Checklist

상세 스펙은 `NON_DUAL_STYLE_AUDIT/` 폴더의 각 차트별 md 참조.

| Chart | AG | Toast |
|---|---|---|
| `BarChart` | [x] | [x] |
| `StackedBarChart` | [x] | [x] |
| `LineChart` | [x] | [x] |
| `AreaChart` | [x] | [x] |
| `StackedAreaChart` | [x] | [x] |
| `ScatterChart` | [x] | [x] |
| `BubbleChart` | [x] | [x] |
| `PieChart` | [ ] | [x] |
| `RadarChart` | [ ] | [ ] |
| `BoxPlotChart` | [x] | [x] | [ ] 사람 리터치 필요 |
| `CandlestickChart` | [ ] | [ ] |
| `ComboChart` | [ ] | [ ] |
| `DonutChart` | [ ] | [ ] |
| `FunnelChart` | [ ] | [ ] |
| `GanttChart` | [ ] | [ ] |
| `GaugeChart` | [ ] | [ ] |
| `HeatmapChart` | [ ] | [x] |
| `HistogramChart` | [ ] | [ ] |
| `NetworkChart` | [ ] | [ ] |
| `PolarAreaChart` | [ ] | [ ] |
| `ProgressChart` | [ ] | [ ] |
| `SankeyChart` | [ ] | [ ] |
| `SunburstChart` | [ ] | [ ] |
| `TreemapChart` | [ ] | [ ] |
| `WaterfallChart` | [ ] | [ ] |

## 2. Work Order

작업 방식:
1. bar-chart의 preset 구조 + 스토리 구조를 먼저 파악
2. 각 차트를 외부 레퍼런스(AG Charts, Toast UI Chart)와 대조
3. 기존 코드 탐색하며 현재 상태 파악
4. preset 구현 → storybook 확인 → 체크
5. 작업 중 발견한 이슈나 노트는 해당 차트 md에 기록

상세 UX/디자인 스펙은 미리 쓰지 않는다.
에이전트가 레퍼런스 코드(bar-chart) + 외부 사이트를 보고 직접 파악해서 진행.

진행 시:
- 외부 레퍼런스(AG Charts, Toast UI Chart) 스크린샷 찍어서 비교
- 스토리북(chart-story, localhost:6007)에서도 스크린샷 찍어서 레퍼런스와 대조
- 분석하면서 파악한 UX 포인트는 해당 차트의 `NON_DUAL_STYLE_AUDIT/<Chart>.md`에 정리
- 레퍼런스처럼 나올 때까지 반복

_(순서 TBD)_

## 3. Reference

### Style 특징

**AG**
- hover → 나머지 dimming (opacity)
- tooltip → transition으로 이동
- motion → 최소

**Toast**
- hover → 테두리 강조 + white outline/shadow
- tooltip → geometry 위치 기반 배치
- animation → mount/update reveal

### 참고 차트

BarChart를 기준으로 AG/Toast 양쪽 구조를 파악할 것.

- AG preset: `shared/chart-presets/bar-chart/`
- Toast preset: `shared/chart-presets/toast-bar-chart/`
- Toast story: `dev/chart-storybook/src/stories/BarChart.stories.tsx`
- AG story: `dev/chart-storybook/src/stories/BarChart.ag.stories.tsx`
- 비교 story: `dev/chart-storybook/src/stories/BarChart.styles.stories.tsx`

### 외부 레퍼런스

- AG Charts: https://www.ag-grid.com/charts/gallery/
- Toast UI Chart: https://nhn.github.io/tui.chart/latest/

### 동기화

registry → shared/chart-presets 동기화:
```bash
# 전체 동기화
cd shared/chart-presets && npm run sync

# 특정 차트만
npm run sync -- --chart bar-chart
npm run sync -- --chart bar-chart --style toast

# 변경된 것만
npm run sync -- --changed
```

### 주의사항

- shared shell 사용할 것 (ag: `_styles/ag/`, toast: `_styles/toast/`)
- config는 base config 기본 테마 사용할 것 (ag: `_styles/ag/cartesian/config.ts`, toast: `_styles/toast/cartesian/config.ts`)
- config shape는 AG ↔ Toast 최대한 동일하게
- hover/tooltip은 각 style의 shared pieces 우선 사용
- 차트별 특수 사정 없으면 새로 만들지 말 것
