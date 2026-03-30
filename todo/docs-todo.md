# Docs TODO

## 코드 복사 인프라

### 제너레이팅 스크립트
- [ ] `docs/scripts/generate-example-strings.mjs` — examples.tsx → 소스코드 문자열 자동 추출
- [ ] CodePreview 컴포넌트 — Preview/Code 탭 + 복사 버튼
- [ ] `ShowcaseExample`, `ChartExample` 타입에 `code?: string` 추가
- [ ] 예시 변경 시 자동 동기화 메커니즘 (pre-build hook or watch)

### 현재 상태
- examples.tsx에 ReactNode만 있고 소스코드 문자열 없음
- CodeBlock 컴포넌트 (Shiki 기반) 존재하지만 예시에 미연결
- 예시 17개 파일 (toast 10 + ag 7)

---

## AG/Toast 표현

- AG/Toast 번갈아 나열하지 않음
- 차트는 하나로 보여주고, 테마 바꾸고 싶으면 이렇게 하라는 가이드
- 예: "npx flitter-ui add bar-chart --style toast" 또는 소스에서 style import 변경

---

## Advanced 페이지 — 복잡한 시나리오 예시 작성

각 시나리오를 실제 코드 예시로 작성해야 함. 지금은 시나리오 카드(텍스트)만 있음.

### 작성 필요 예시 목록

1. **Cross-filtering** — 여러 차트 간 양방향 필터 (StatefulWidget + 공유 상태)
2. **Synchronized drilldown** — 클릭으로 하위 카테고리 확장 (위젯 트리 교체)
3. **Range navigation** — candlestick + navigator + range selector 양방향 바인딩
4. **Threshold interaction** — heatmap 임계값 슬라이더, 행별 다른 기준
5. **On-chart annotation** — 추세선, 피보나치, 지지/저항선 (CustomPaint + Stack)
6. **Interactive layout** — sankey/sunburst 노드 드래그 재배치
7. **Real-time streaming** — 데이터 스트리밍 + 유저 뷰포트 보존
8. **Multi-axis control** — 독립적 y축 줌/팬 + 공유 x축
9. **In-chart data editing** — waterfall/gantt 막대 드래그로 값 편집
10. **Detail-on-demand** — chart-in-chart 팝업 (treemap 호버 → 미니 candlestick)

### 각 예시에 필요한 것
- 라이브 데모 컴포넌트
- 전체 소스코드 (제너레이팅 스크립트로 자동 추출)
- 사용된 위젯 패턴 설명
- Recipes 페이지로 연결 (현재 sidebar에 coming soon으로 등록됨)

---

## 기타

- [ ] pre-existing 빌드 에러: `toast-sunburst-chart` Positioned 미정의
- [ ] LLM pack 재생성 (패키지명 수정 반영)
- [ ] README.md 업데이트 (style: "toast" → 실제 API 반영)
- [ ] 위젯 트리 시각화 — 차트가 어떤 위젯으로 구성되는지 보여주기
