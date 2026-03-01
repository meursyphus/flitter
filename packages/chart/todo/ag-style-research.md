# AG Charts 스타일 리서치

> AG Charts (ag-grid.com/charts) 갤러리 및 GitHub 소스 기반 리서치
> GitHub: https://github.com/ag-grid/ag-charts
> 갤러리: https://ag-grid.com/charts/gallery/

---

## 1. 색상 팔레트 (Default Light Theme)

### Series Colors (Fills)
```
BLUE:    '#5090dc'
ORANGE:  '#ffa03a'
GREEN:   '#459d55'
CYAN:    '#34bfe1'
YELLOW:  '#e1cc00'
VIOLET:  '#9669cb'
GRAY:    '#b5b5b5'
MAGENTA: '#bd5aa7'
BROWN:   '#8a6224'
RED:     '#ef5452'
```

### Series Colors (Strokes) — 더 어두운 버전
```
BLUE:    '#2b5c95'
ORANGE:  '#cc6f10'
GREEN:   '#1e652e'
CYAN:    '#18859e'
YELLOW:  '#a69400'
VIOLET:  '#603c88'
GRAY:    '#575757'
MAGENTA: '#7d2f6d'
BROWN:   '#4f3508'
RED:     '#a82529'
```

### Dark Theme Strokes — 밝은 버전
```
BLUE:    '#74a8e6'
ORANGE:  '#ffbe70'
GREEN:   '#6cb176'
CYAN:    '#75d4ef'
YELLOW:  '#f6e559'
VIOLET:  '#aa86d8'
GRAY:    '#a1a1a1'
MAGENTA: '#ce7ab9'
BROWN:   '#997b52'
RED:     '#ff7872'
```

### 특수 색상
- **Up (bullish)**: fill `#459d55`, stroke `#1e652e` (GREEN)
- **Down (bearish)**: fill `#ef5452`, stroke `#a82529` (RED)
- **Neutral**: fill `#b5b5b5`, stroke `#575757` (GRAY)

---

## 2. 테마 설정값

### Light Theme
```
accentColor:          '#2196f3'
foregroundColor:      '#181d1f'
backgroundColor:      'white'
fontFamily:           'Verdana, sans-serif'
fontSize:             13  (BASE_FONT_SIZE)
fontWeight:           400
borderRadius:         4
```

### Dark Theme
```
foregroundColor:      '#fff'
backgroundColor:      '#192232'
```

### Axis / Grid 스타일
```
axis line:    enabled: true,  width: 1, color: foreground 32.5% mix
axis tick:    enabled: false, size: 6,  width: 1 (기본적으로 숨김!)
axis label:   fontSize: 13, fontFamily: Verdana, spacing: 11
grid line:    enabled: true,  width: 1, color: foreground 10% mix (점선)
chart padding: 20px all sides
```

### 주요 특징 (Toast와 차이점)
- **Axis tick 기본 숨김** (toast는 보임)
- **Grid line은 점선(dashed)** 스타일
- **fontFamily: Verdana** (toast는 시스템 폰트)
- **배경: white** (toast는 투명/없음)
- **라벨 간격(spacing): 11px**
- **borderRadius: 4** (tooltip 등에 적용)

---

## 3. 차트별 AG Charts 갤러리 링크

### Cartesian Charts (이미 Headless 있음)
| 차트 | 갤러리 링크 | 비고 |
|------|------------|------|
| Bar Chart | https://ag-grid.com/charts/gallery/ (Bar 탭) | vertical + horizontal |
| Stacked Bar Chart | 갤러리 Bar 탭 내 Stacked Bar Chart | grouped stacked도 있음 |
| Line Chart | https://ag-grid.com/charts/gallery/ (Line 탭) | gaps, multiple series, labels |
| Area Chart | https://ag-grid.com/charts/gallery/ (Area 탭) | stacked, 100%, markers, negative |
| Scatter Chart | https://ag-grid.com/charts/gallery/ (Scatter 탭) | labels, multiple axes |
| Bubble Chart | https://ag-grid.com/charts/gallery/ (Bubble 탭) | categories, images, patterns |
| Stacked Area Chart | 갤러리 Area 탭 내 Stacked Area Chart | 100% stacked 포함 |

### Enterprise Charts (Headless 있으나 Toast 미구현)
| 차트 | 갤러리 링크 | 비고 |
|------|------------|------|
| Waterfall | https://ag-grid.com/charts/gallery/simple-waterfall/ | Enterprise 전용 |
| Box Plot | https://ag-grid.com/charts/gallery/simple-box-plot/ | Enterprise 전용 |
| Candlestick | 갤러리 Candlestick 탭 | Enterprise, up/down 색상 |
| Radar Line | 갤러리 Radar Line 탭 | Enterprise 전용 |
| Radar Area | 갤러리 Radar Area 탭 | Enterprise 전용 |

### 기타 (Headless 있으나 Toast/Ag 모두 미구현)
| 차트 | 갤러리 링크 | 비고 |
|------|------------|------|
| Pie Chart | https://ag-grid.com/charts/gallery/ (Pie 탭) | variable radius, donut 내 pie |
| Heatmap | 갤러리에 별도 탭 없음 | AG에서는 Heatmap 없음 |
| Gauge | 갤러리에 별도 탭 없음 | AG에서는 Gauge 없음 |
| Funnel | 갤러리에 별도 탭 없음 | AG에서는 Funnel 없음 |
| Treemap | 갤러리에 별도 탭 없음 | AG에서는 Treemap 있음 (Enterprise) |
| Sunburst | 갤러리에 별도 탭 없음 | AG에서는 Sunburst 있음 (Enterprise) |
| Sankey | 갤러리에 별도 탭 없음 | AG에서는 Sankey 없음 |

---

## 4. AG 스타일 구현 시 공통 작업

### shared/styles/ag/ 구조 (toast와 동일 패턴)
```
src/shared/styles/ag/
  config.ts        AgBaseConfig 타입 + 기본값
  index.ts         모든 공통 파트 export
  axis-label.ts    agXAxisLabel, agYAxisLabel
  axis-tick.ts     agXAxisTick, agYAxisTick (기본 숨김)
  axis-line.ts     agXAxisLine, agYAxisLine
  grid-line.ts     agGridXLine, agGridYLine (점선)
  legend.ts        AG 스타일 레전드
  title.ts         AG 스타일 타이틀 (+ subtitle 지원)
  layout.ts        AG 스타일 레이아웃
  tooltip.ts       AG 스타일 툴팁
```

### AgBaseConfig 주요 필드
```typescript
type AgBaseConfig = {
  colors: {
    fills: string[];       // 10색 팔레트
    strokes: string[];     // 10색 stroke
  };
  font: {
    family: string;        // 'Verdana, sans-serif'
    size: number;          // 13
    weight: number;        // 400
  };
  background: {
    color: string;         // 'white'
  };
  title: {
    enabled: boolean;
    text: string;
    fontSize: number;      // 18
    fontWeight: number;    // 700
    color: string;
  };
  subtitle: {
    enabled: boolean;      // AG는 subtitle 지원
    text: string;
    fontSize: number;
    color: string;         // muted color
  };
  legend: {
    enabled: boolean;
    position: 'bottom' | 'right' | 'top' | 'left';
  };
  axis: {
    line: { color: string; width: number; };
    tick: { enabled: boolean; size: number; width: number; color: string; };
    label: { fontSize: number; color: string; spacing: number; };
  };
  grid: {
    line: { color: string; width: number; dash: number[]; };  // 점선!
  };
  padding: { top: number; right: number; bottom: number; left: number; };
  tooltip: {
    backgroundColor: string;
    textColor: string;
    borderRadius: number;  // 4
    padding: number;
  };
  animation: {
    duration: number;
  };
};
```

### AG vs Toast 핵심 차이
| 항목 | Toast | AG |
|------|-------|----|
| 배경 | 없음/투명 | white (light) / #192232 (dark) |
| 폰트 | 시스템 폰트 | Verdana, sans-serif |
| 폰트 크기 | 12px | 13px |
| Axis tick | 보임 | 기본 숨김 |
| Grid line | 실선 | 점선 (dashed) |
| Subtitle | 없음 | 있음 |
| 색상 수 | 가변 | 10색 고정 팔레트 |
| borderRadius | 8 | 4 |
| Axis label color | 커스텀 | foreground mix |

---

## 5. 구현 우선순위

### Phase 1: 공통 인프라
1. `shared/styles/ag/` 폴더 생성 + AgBaseConfig 정의
2. 공통 파트 구현 (axis, grid, legend, title, layout, tooltip)

### Phase 2: 기존 Headless 있는 Cartesian 차트 (7개)
1. bar-chart/styles/ag/
2. stacked-bar-chart/styles/ag/
3. line-chart/styles/ag/
4. area-chart/styles/ag/
5. scatter-chart/styles/ag/
6. bubble-chart/styles/ag/
7. stacked-area-chart/styles/ag/

### Phase 3: Toast도 없는 차트 (Toast 먼저 → Ag)
1. pie-chart
2. radar-chart
3. heatmap-chart
4. candlestick-chart
5. box-plot-chart
6. waterfall-chart
7. funnel-chart
8. gauge-chart
9. treemap-chart
10. sunburst-chart
11. sankey-chart
