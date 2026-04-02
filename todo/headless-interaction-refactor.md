# Headless Interaction Refactor Plan

## 목적
헤드리스에서 인터랙션(GestureDetector, hover 상태)을 관리하여, 스타일(toast/ag)에서 중복 코드를 제거하고 커스텀을 쉽게 만든다. 이 패턴을 bar-chart에서 먼저 적용하고, 이후 다른 차트에도 일관되게 퍼트린다.

## 변경 사항

### 1. `unhoverBar(index, legend)` 시그니처 변경
- **현재**: `unhoverBar()` — 무조건 null로 리셋
- **변경**: `unhoverBar(index: number, legend: string)` — 현재 호버 중인 바와 일치할 때만 해제
- `unhoverAllBars()` 추가 — dataView onMouseLeave용 (전체 해제)
- 위치: `packages/chart/src/headless/bar-chart/controller.ts`

### 2. `bar` 커스텀 빌더 변경
- **시그니처 변경**: `isHovered: boolean` 인자 추가
  ```typescript
  // before
  bar: (args: { value, label, legend, index }, context) => Widget
  // after
  bar: (args: { value, label, legend, index, isHovered: boolean }, context) => Widget
  ```
- **헤드리스가 GestureDetector 감쌈**: bar 위젯 반환 후 헤드리스가 자동으로
  ```typescript
  GestureDetector({
    onMouseEnter: () => context.hoverBar(index, legend),
    onMouseLeave: () => context.unhoverBar(index, legend),
    child: custom.bar({ ...args, isHovered }, context)
  })
  ```
- **Toast/AG bar 구현에서 GestureDetector 제거**: 순수 시각만 담당
  - Toast: `_HoverableBar` StatefulWidget의 로컬 hover 상태 제거, `isHovered`로 decoration 분기
  - AG: GestureDetector 제거, `isHovered`와 `context.hoveredBar`로 opacity 계산

### 3. `legend` 커스텀 빌더 변경
- **시그니처 변경**: `isVisible: boolean` 인자 추가
  ```typescript
  // before
  legend: (args: { name, index }, context) => Widget
  // after
  legend: (args: { name, index, isVisible: boolean }, context) => Widget
  ```
- **헤드리스가 GestureDetector 감쌈**:
  ```typescript
  GestureDetector({
    onClick: () => context.toggleSeries(name),
    child: custom.legend({ ...args, isVisible }, context)
  })
  ```
- **Toast/AG legend 구현에서 GestureDetector, toggleSeries 호출 제거**: 순수 시각만 담당

### 4. `dataView` onMouseLeave 감싸기
- 헤드리스가 dataView 위젯을 GestureDetector로 감쌈:
  ```typescript
  GestureDetector({
    onMouseLeave: () => context.unhoverAllBars(),
    behavior: "translucent",
    child: custom.dataView(args, context)
  })
  ```
- AG의 `AgTooltipOverlay` 내부 onMouseLeave GestureDetector → 헤드리스가 대신 처리하므로 제거 가능

### 5. `tooltip` 커스텀 슬롯 추가
- **목적**: tooltip 내용물(모양) 생성을 custom 슬롯으로 열어둠. 현재 toast/ag 각각 하드코딩된 `tooltipContent()` 함수를 호출하는데, 이를 `context.custom.tooltip()`으로 통일.
- **헤드리스가 직접 배치하지 않음** — 어느 위젯이 소비할지(bar vs dataView)는 스타일 결정
- **시그니처**:
  ```typescript
  tooltip: (args: { label: string; items: { legend: string; color: string; value: number }[] }, context) => Widget
  ```
- **Toast**: `toastBar` 내부에서 `tooltipContent(...)` 직접 호출 → `context.custom.tooltip(...)` 호출로 변경
- **AG**: `AgTooltipOverlay` 내부에서 `tooltipContent(...)` 직접 호출 → `context.custom.tooltip(...)` 호출로 변경
- 각 스타일의 `index.ts`에서 custom 조립 시 `tooltip: toastTooltipContent` / `tooltip: agTooltipContent` 등록

## 적용 순서
1. headless controller 변경 (unhoverBar 시그니처, unhoverAllBars)
2. headless types.ts 변경 (bar, legend 시그니처, tooltip 슬롯 추가)
3. headless chart.ts 변경 (GestureDetector 감싸기)
4. toast 스타일 적용 (bar, legend에서 GestureDetector 제거, tooltip custom 연동)
5. ag 스타일 적용 (bar, legend에서 GestureDetector 제거, tooltip custom 연동)
6. base 디폴트에 tooltip 기본 구현 추가
7. preset sync: `pnpm --dir shared/chart-presets run sync -- --chart bar-chart`

## 다른 차트 확장 시 참고
- 같은 패턴을 line-chart, area-chart, stacked-bar-chart 등에 적용
- hoveredBar → hoveredPoint / hoveredSegment 등으로 네이밍만 변경
- legend, dataView의 GestureDetector 감싸기는 동일 패턴
