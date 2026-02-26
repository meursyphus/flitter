# 차트 구현 트래커

## Docs 차트 목차 기획

> 공통 docs 구조. 차트별 페이지가 아닌 하나의 문서 흐름.

- [ ] Headless 아키텍처 (설계 철학, 위젯 트리 구조, Custom 렌더러 패턴)
- [ ] 차트 카테고리 분류 (Cartesian / Radial / Hierarchical / ...)
- [ ] 차트별 예제 목차:
  - [ ] Bar Chart (Toast / High)
  - [ ] Line Chart
  - [ ] Area Chart
  - [ ] Pie Chart
  - [ ] Scatter Chart
  - [ ] Radar Chart
  - [ ] Bubble Chart
  - [ ] Heatmap Chart
  - [ ] Candlestick Chart
  - [ ] Box Plot Chart
  - [ ] Waterfall Chart
  - [ ] Funnel Chart
  - [ ] Gauge Chart
  - [ ] Treemap Chart
  - [ ] Sunburst Chart
  - [ ] Sankey Chart
  - [ ] Stacked Bar Chart
  - [ ] Stacked Area Chart

---

## 진행 현황

> 상세 → `todo/{chart-name}.md`

| 차트 | Headless | Toast (pkg) | Toast (story) | High (pkg) | High (story) | 예제 |
|------|----------|-------------|---------------|------------|--------------|------|
| bar-chart | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| line-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| area-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| pie-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| scatter-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| radar-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| bubble-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| heatmap-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| candlestick-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| box-plot-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| waterfall-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| funnel-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| gauge-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| treemap-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| sunburst-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| sankey-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| stacked-bar-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| stacked-area-chart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> legacy 참고: dev/chart-storybook/src/charts/ 에 Toast 구현체 18개 있음

---

## 차트별 .md 가이드

각 `todo/{chart-name}.md` 구조:

### 1. 스타일 구현 (Toast / High 각각)
- config, factory, 컴포넌트들, plugin 등록

### 2. 스토리북 (Toast / High 각각)
- 기본, 변형, 다중 데이터셋, 커스텀 등

### 3. 예제 (공통 docs에 올릴 것)
- 스타일별 예제 코드

### 4. 노트
- 자유 기록 (구현 방안, 이슈, 아이디어 등)
