# Bar Chart

## Toast 스타일

### 구현

- [x] 기본 틀잡기 (bar, axis 등)
- [x] Axis 애니메이팅
- [ ] 레전드 클릭 → 필터
- [ ] 바 호버 → 데이터 라벨 표시
- [ ] 레전드 필터 시 스케일 변경 + 바 높이 트랜지션

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

### [선결] Provider 자식 전파 버그

#### 문제

`ProviderElement.performRebuild()` 가 새 위젯의 child 대신 기존 child의 widget을 넘김:

```typescript
// packages/core/src/provider/Provider.ts:77
// 현재 (버그):
this.child = this.updateChild(this.child, this.child.widget)!;
//                                        ^^^^^^^^^^^^^^^^^ 기존 자식의 옛 위젯 → no-op

// 수정:
this.child = this.updateChild(this.child, this.widget.child)!;
//                                        ^^^^^^^^^^^^^^^^^ 새 Provider 위젯의 child
```

#### 왜 문제인가

ComponentElement.performRebuild() 는 `this.build()` 결과(새 위젯)를 updateChild에 넘기는 게 정상.
그런데 ProviderElement은 `this.child.widget` (기존 자식이 이미 가진 위젯)을 넘기니까
부모가 리빌드해도 Provider 아래 트리가 절대 갱신 안 됨.

```
부모 setState → build() → 새 Provider({ value: 새값, child: new Chart() })
  → ProviderElement.update() → performRebuild()
  → updateChild(기존ChartElement, 기존ChartElement.widget)  // 같은 인스턴스 → no-op
  → Chart 이하 리빌드 안 됨 💀
```

**이래서 ChangeNotifierProvider든 StatefulWidget 래퍼든 Provider 통과 시 자식이 안 바뀜.**
현재 차트가 초기 렌더만 되고 리액티브가 안 되는 근본 원인.

#### 수정 범위

1줄 변경. `this.child.widget` → `this.widget.child`. Flutter의 ProxyElement과 동일하게 됨.
이 수정이 들어가야 아래 설계가 전부 동작함.

---

### 상태 관리 설계 (레전드 필터 + 스케일 재계산)

#### 결론: ChangeNotifierProvider + 컨트롤러 패턴

headless가 컨트롤러(ChangeNotifier)를 소유하고, 스타일 레이어는 커스텀 렌더러로 비주얼만 담당.
Flutter의 ScrollController/TabController 패턴과 동일.

#### 1. headless: BarChartController (ChangeNotifier 서브클래스)

```typescript
class BarChartController extends ChangeNotifier {
  #data: BarChartData;
  #getScale: (data: BarChartData) => BarChartScale;
  #filteredLegends = new Set<string>();

  constructor(data: BarChartData, getScale: GetScaleFn) {
    super();
    this.#data = data;
    this.#getScale = getScale;
  }

  // 파생 데이터 — build()에서 읽기만
  get filteredData(): BarChartData {
    return {
      labels: this.#data.labels,
      datasets: this.#data.datasets.filter(d => !this.#filteredLegends.has(d.legend))
    };
  }

  get scale(): BarChartScale {
    return this.#getScale(this.filteredData);
  }

  get allLegends(): string[] {
    return this.#data.datasets.map(d => d.legend);
  }

  isFiltered(name: string): boolean {
    return this.#filteredLegends.has(name);
  }

  toggleLegend(name: string) {
    this.#filteredLegends.has(name)
      ? this.#filteredLegends.delete(name)
      : this.#filteredLegends.add(name);
    this.notifyListeners();  // → setState → 전체 차트 리빌드
  }
}
```

#### 2. headless: _BarChart → StatefulWidget으로 변경

```typescript
class _BarChart extends StatefulWidget {
  createState() { return new _BarChartState(); }
}

class _BarChartState extends State<_BarChart> {
  controller!: BarChartController;

  initState() {
    this.controller = new BarChartController(this.widget.data, this.widget.getScale);
    this.controller.addListener(() => this.setState());
  }

  didUpdateWidget(oldWidget: _BarChart) {
    // 외부에서 data가 바뀌면 컨트롤러 갱신
    if (oldWidget.data !== this.widget.data) {
      this.controller.updateData(this.widget.data);
    }
  }

  dispose() {
    // controller cleanup if needed
    super.dispose();
  }

  build(context: BuildContext): Widget {
    return BarChartConfigProvider({
      value: {
        custom: this.widget.custom,
        data: this.controller.filteredData,   // 필터된 데이터
        scale: this.controller.scale,         // 재계산된 스케일
        title: this.widget.title,
        direction: this.widget.direction,
        config: this.widget.userConfig,
        controller: this.controller,          // 컨트롤러 노출
      },
      child: new Chart()
    });
  }
}
```

#### 3. headless: Legend에 GestureDetector + isFiltered 추가

```typescript
// chart.ts — Legend 클래스 변경
class Legend extends StatelessWidget {
  #name: string;
  #index: number;

  build(context: BuildContext): Widget {
    const config = BarChartConfigProvider.of(context);
    const { custom, controller } = config;
    return GestureDetector({
      onClick: () => controller.toggleLegend(this.#name),
      child: custom.legend(
        { name: this.#name, index: this.#index, isFiltered: controller.isFiltered(this.#name) },
        config
      )
    });
  }
}
```

headless가 클릭 동작을 처리 → 커스텀 렌더러는 비주얼만 제공.

#### 4. 커스텀 렌더러 시그니처 변경

```typescript
// types.ts
legend: CustomArgs<{ name: string; index: number; isFiltered: boolean }, TConfig>;

// BarChartContext에 controller 추가
type BarChartContext<TConfig = {}> = {
  // ... 기존 필드 ...
  controller: BarChartController;
};
```

#### 5. Toast 스타일 레이어 (변경 최소)

```typescript
// Toast는 커스텀 렌더러만 제공. 상태 관리 코드 없음.
const toastCustom = {
  legend: ({ name, index, isFiltered }, ctx) => {
    return Container({
      opacity: isFiltered ? 0.3 : 1.0,
      child: Row({
        children: [
          Container({ width: 12, height: 12, color: TOAST_COLORS[index] }),
          Text(name, { style: new TextStyle({ fontSize: 12 }) })
        ]
      })
    });
  },
  // ... 다른 커스텀 렌더러
};

// Toast 바 차트 — 그냥 headless 호출. StatefulWidget 래퍼 불필요.
export default function ToastBarChart(props) {
  return HeadlessBarChart({ ...props, custom: toastCustom });
}
```

#### 흐름

```
레전드 클릭
  → headless Legend의 GestureDetector onClick
  → controller.toggleLegend("매출")
  → notifyListeners()
  → _BarChartState.setState()     ← addListener에서 등록됨
  → _BarChartState.build() 재실행
  → controller.filteredData → 필터된 데이터
  → controller.scale → 재계산된 스케일
  → Provider({ value: 새 context }) → [Provider 버그 수정 후] 자식 트리 리빌드
  → Legend가 isFiltered=true → Toast 렌더러가 opacity 0.3 적용
  → Series가 새 data로 bar ratio 재계산 → 트랜지션 애니메이션
```

#### headless 수정 항목 정리

| 파일 | 변경 |
|------|------|
| `Provider.ts` (core) | `performRebuild` 1줄 수정 — 선결 조건 |
| `index.ts` | StatelessWidget → StatefulWidget, controller 생성 |
| `chart.ts` | Legend에 GestureDetector + isFiltered 전달 |
| `types.ts` | legend args에 `isFiltered` 추가, context에 `controller` 추가 |
| `controller.ts` (신규) | BarChartController 클래스 |
| `provider.ts` | BarChartContext 타입만 변경 |

#### 다른 차트에 적용

이 패턴은 **Cartesian 계열** (bar, line, area) 공통:
- `CartesianChartController extends ChangeNotifier` — 공통 필터 로직
- `BarChartController extends CartesianChartController` — bar 전용 로직
- headless가 controller 소유, 스타일은 비주얼만 제공
- 모든 차트에서 동일한 legend 필터링 UX 기본 제공

비 Cartesian (pie, sankey 등)도 같은 컨트롤러 패턴으로 확장 가능.
