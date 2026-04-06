# Pie Chart Spec Notes

## Current Notes

- `dataLabel`은 slice 내부 전용이다.
- pie headless는 `slice` custom 인스턴스를 만들 때 내부 `dataLabel` 인스턴스를 함께 넘기는 방향으로 잡는다.
- 바깥 label/tick은 `radialLabel`, `radialTick` custom 슬롯으로 분리한다.
- `plot`은 `dataView`, `tooltipArea`와 함께 `radialItems`를 받는다.
- `radialItems` 형태는 아래처럼 둔다.

```ts
{
  angle: number
  tick: Widget
  label: Widget
}[]
```

- 여기서 `angle`은 slice의 `midAngle` 의미로 둔다.
- pie 공용 `base plot`에서 바깥 tick/label 배치와 가운데 pie 최대 영역 계산을 담당한다.

## Reference

- 각 custom 인스턴스가 어떤 인자를 받아야 하는지 정할 때는 `bar-chart` headless 구조를 참고한다.
- 특히 `xAxisLabel`, `yAxisLabel`, `xAxisTick`, `yAxisTick` 슬롯 구성을 같이 본다.
- 참고 파일: `packages/chart/src/headless/bar-chart/types.ts`
