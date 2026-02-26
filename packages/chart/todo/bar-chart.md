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

#### 결론: ChangeNotifierProvider + 컨트롤러 패턴

- tick의 step은 레이아웃 constraint에 따라 달라져야 한다
- headless에 상태 관리 인프라 (ChangeNotifierProvider + 컨트롤러), toast/high는 표현만
  - hiddenSeries, visibleData, scale 재계산 → headless (데이터 로직)
  - 트랜지션 duration/curve, AnimatedFractionallySizedBox 등 → toast/high (표현 로직)
- 바 높이 트랜지션: FractionallySizedBox → AnimatedFractionallySizedBox 교체로 해결 가능
- LayoutBuilder 필요: constraint 기반 tick step 동적 결정용 (flitter core에 미구현 → 새로 만들어야 함)
- Flutter 참고: AnimatedSize (render object 레벨 자동 감지) 도 있지만 당장은 implicit animation으로 충분
