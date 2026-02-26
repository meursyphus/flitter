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

### 상태 관리 설계 (레전드 필터 + 스케일 재계산)

#### 현재 구조의 한계

- headless `_BarChart.build()`에서 스케일 한 번 계산 → Provider로 내려줌
- Provider는 정적 lookup (`Provider.of`). 값 변경해도 자동 리빌드 없음
- 레전드는 순수 표시용. 필터링 로직/상태 없음

#### 결론: 내부 상태는 headless가 아닌 스타일 레이어(Toast/High)에서 각자 관리

이유:
- UX가 스타일마다 다름 (Toast: 부드러운 트랜지션, High: 즉시 반영 등)
- headless가 상태 가지면 스타일 레이어 자유도 줄어듦
- headless는 순수 로직(getScale 등) + 레이아웃 골격만 제공

#### 방법: StatefulWidget 래퍼 + 클로저 기반 콜백

Toast가 headless를 감싸는 StatefulWidget을 두고, custom 렌더러가 클로저로 setState를 캡처:

```typescript
// Toast 레이어
class _ToastBarChart extends StatefulWidget { ... }

class _ToastBarChartState extends State<_ToastBarChart> {
  filteredLegends = new Set<string>();

  build(context: BuildContext): Widget {
    const { data, ...rest } = this.widget;

    // 1) 필터된 데이터
    const filteredData = {
      ...data,
      datasets: data.datasets.filter(d => !this.filteredLegends.has(d.legend))
    };

    // 2) 필터 기준으로 스케일 재계산 (매 build마다)
    const scale = getScale({ datasets: filteredData.datasets });

    // 3) 레전드 렌더러 — 클로저로 this.setState 캡처
    const legendRenderer = ({ name, index }, ctx) => {
      const isFiltered = this.filteredLegends.has(name);
      return GestureDetector({
        onClick: () => {
          this.setState(() => {
            isFiltered
              ? this.filteredLegends.delete(name)
              : this.filteredLegends.add(name);
          });
        },
        child: toastLegendVisual({ name, index }, ctx, isFiltered)
      });
    };

    // 4) headless에 필터된 데이터 + 재계산된 스케일 전달
    return HeadlessBarChart({
      data: filteredData,
      scale,                     // ← getScale prop으로 오버라이드
      custom: { ...toastCustom, legend: legendRenderer },
      ...rest,
    });
  }
}
```

#### 흐름

```
레전드 클릭
  → setState({ filteredLegends 토글 })
  → build() 재실행
  → filteredData 재계산
  → getScale(filteredData) → 새 스케일
  → HeadlessBarChart에 새 data + scale 전달
  → Provider 값 갱신 → 하위 위젯 전부 리빌드
  → AnimatedBarGroup이 이전 ratio → 새 ratio 트랜지션
```

#### headless 수정 필요?

거의 없음. 현재 headless는 이미:
- `getScale` 외부 주입 가능 (prop)
- `custom` 렌더러 오버라이드 가능
- `data`는 외부에서 받음

유일하게 확인할 것: headless `_BarChart`가 `scale` prop을 직접 받을 수 있는지.
현재는 `getScale(data)` 호출 결과를 쓰는데, 외부에서 계산된 scale을 바로 넘기는 경로가 있으면 OK.
없으면 headless에 `scale` prop 추가 or `getScale`에 filteredData를 넘기면 됨.

#### 대안: ChangeNotifierProvider (더 복잡한 차트용)

```typescript
class BarChartStateNotifier extends ChangeNotifier {
  filteredLegends = new Set<string>();

  toggleLegend(name: string) {
    this.filteredLegends.has(name)
      ? this.filteredLegends.delete(name)
      : this.filteredLegends.add(name);
    this.notifyListeners(); // → ChangeNotifierProvider가 자동 setState
  }
}
```

장점: 여러 위젯에서 동일 상태 접근 가능 (Provider.of로)
단점: 오버엔지니어링 우려. bar chart 수준에서는 StatefulWidget + 클로저로 충분.
향후 복잡한 차트(sankey 노드 드래그 등)에서 고려.

#### ReactiveChangeNotifier (참고)

Flitter에 Proxy 기반 자동 반응형도 있음. 속성 변경만으로 notifyListeners 자동 호출.
편하지만 암시적이라 디버깅 어려울 수 있음. 명시적 setState 패턴 우선.
