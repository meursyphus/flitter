# Bar Chart

## Toast 스타일

### 구현

- [x] 기본 틀잡기 (bar, axis 등)
- [x] Axis 애니메이팅
- [x] scale 재설계 (controller + LayoutBuilder + 자동 재계산)
- [x] 음수 값 지원 (0선 기준 양수↑ 음수↓, Expanded + FractionallySizedBox 조합)
- [x] 레전드 클릭 → 필터
- [ ] 바 호버 → 데이터 라벨 표시
- [x] 레전드 필터 시 스케일 변경
- [ ] 레전드 필터 시 바 높이 트랜지션

### 스토리북

### 예제 (공통 docs용)

---

## High 스타일

### 구현

- [ ] 기본 틀잡기
- [ ] 나머지 구현 항목 확인

### 스토리북

### 예제 (공통 docs용)

---

## 노트

### 위젯 구조

```
BarChart (factory)
  └── ChangeNotifierProvider (controller 생성/관리)
      └── Provider (static config: custom, title, config)
          └── Chart
              └── SizeTracker (LayoutBuilder → controller.setSize)
                  └── Layout (custom.layout)
                      ├── Title (custom.title)
                      ├── Legend × N (custom.legend)
                      └── Plot (custom.plot)
                          ├── XAxis / YAxis (custom.xAxis/yAxis)
                          ├── Series → BarGroup × N → Bar × N
                          ├── Grid (custom.grid)
                          └── AxisCorner (custom.axisCorner)
```

### Provider 구조 (BarChartProvider)

ChangeNotifierProvider 하나만 사용. controller가 곧 context.
`BarChartProvider.of(context)` → controller 리턴 → `ctx.data`, `ctx.scale`, `ctx.custom` 바로 접근.

### context 접근 패턴

**읽기 (context에서 바로):**
- `context.data` — 레전드 필터 적용된 데이터
- `context.scale` — 자동 계산된 scale
- `context.legends` — 전체 레전드 목록 (필터 무관)
- `context.width / height` — 차트 크기
- `context.direction` — vertical / horizontal
- `context.custom / title / config` — 설정

**쓰기 (context.controller):**
- `controller.toggleSeries(legend)` — 레전드 필터 토글
- `controller.hoverBar(index, legend)` / `controller.unhoverBar()` — 호버
- `controller.isSeriesVisible(legend)` — 레전드 visible 여부

### controller 설계

controller(ChangeNotifier)가 모든 상태 + 파생 데이터를 관리.

**상태 (private):**
- `#rawData`, `#hiddenSeries`, `#hoveredBar`, `#width/#height`, `#direction`, `#scale`

**public 프로퍼티 (static config):**
- `custom`, `title`, `config` — ChangeNotifierProvider의 update에서 동기화

**자동 scale 재계산:**
- `#recalcScale()` private 메서드
- `setSize`, `data` setter, `direction` setter, `toggleSeries` 등 상태 변경 시 자동 호출
- `#getScaleOptions?.(this)` 호출 → scale 옵션(roughStepCount 등) 결정 (없으면 기본값 `{ roughStepCount: 10 }`)
- `#getScale(filteredData, options)` 호출
- 매번 `notifyListeners`는 상태 변경 메서드에서 1회만 호출 (#recalcScale 자체는 notify 안 함)

**scale 커스터마이징 (2단계):**
- `getScale` (props) — **핵심 로직**. 데이터→스케일 계산 함수. StackedBarChart면 완전히 다른 함수로 교체.
- `getScaleOptions` (props) — **스타일 의존 파라미터**. `(controller) => { roughStepCount }`. 스타일별로 tickSpacing 등이 다를 때 오버라이드.
- toast 기본: `axisLength / 40px` 기반 roughStepCount 계산
- headless 기본: `{ roughStepCount: 10 }` (getScaleOptions 미지정 시)

**외부에 노출하지 않는 것:**
- `#getScale` — private
- `#getScaleOptions` — private
- `#recalcScale` — private
- `#rawData` — private (data getter/setter로만 접근)

### getScale 시그니처

`shared/cartesian/getScale`에 `roughStepCount` 옵션 추가 (기본값 10). 기존 호출 코드 호환.

```
getScale({ datasets }, { roughStepCount = 10 })
```

rough step → SNAP_VALUES [1,2,5,10]로 정규화 → min/max도 step 배수로 정리.

### LayoutBuilder

flitter-core에 구현됨 (`packages/core/src/component/base/BaseLayoutBuilder.ts`).
layout 단계에서 builder 호출 → constraints 제공 → child 위젯 트리를 layout 시점에 빌드.
SizeTracker에서 사용: `controller.setSize(constraints.maxWidth, constraints.maxHeight)` 한 줄만.

### ChangeNotifierProvider

flitter-core에 구현됨 (`packages/core/src/provider/ChangeNotifierProvider.ts`).
`create`: initState에서 ChangeNotifier 생성 + addListener.
`update`: didUpdateWidget에서 호출, 외부 prop 변경을 controller에 동기화.

### 바 높이 트랜지션

- FractionallySizedBox → AnimatedFractionallySizedBox 교체로 해결 가능
- Flutter 참고: AnimatedSize (render object 레벨 자동 감지) 도 있지만 당장은 implicit animation으로 충분
