# Flitter 위젯 문서화 동시 작업 가이드

## 공통 작업 지침

### 1. 위젯 구현 코드 위치
- **기본 위치**: `packages/flitter/src/component/[위젯명].ts`
- **Base 클래스**: `packages/flitter/src/component/base/Base[위젯명].ts`
- **타입 정의**: `packages/flitter/src/type/`
- **유틸리티**: `packages/flitter/src/utils/`

### 2. 문서 파일 위치
- **한글 문서**: `packages/docs/src/content/docs/ko/widgets/[위젯명]/index.mdx`
- **영어 문서**: `packages/docs/src/content/docs/en/widgets/[위젯명]/index.mdx`

### 3. 구현 코드 분석 방법
1. `[위젯명].ts` 파일에서 export되는 함수의 파라미터 확인
2. `Base[위젯명].ts` 파일에서 constructor의 props 인터페이스 확인
3. 각 prop의 타입과 기본값 확인
4. RenderObject의 동작 방식 파악

### 4. 문서 작성 표준 구조
```markdown
---
nav_group: "Widgets"
nav_group_order: 3
nav_title: [위젯명]
title: "[위젯명]"
description: "[위젯 설명]"
---

## 개요
[위젯 개요 설명]

## 언제 사용하나요?
- [사용 사례 1]
- [사용 사례 2]
- [사용 사례 3]

## 기본 사용법
```typescript
// 기본 예제 코드
```

## Props

### prop1 (필수/선택)
**값: 타입**
[prop 설명]

### prop2 (필수/선택)
**값: 타입**
[prop 설명]

## 실제 사용 예제

### 예제 1: [예제 제목]
```typescript
// 실제 사용 예제 코드
```

### 예제 2: [예제 제목]
```typescript
// 실제 사용 예제 코드
```

## 주의사항
- [주의사항 1]
- [주의사항 2]

## 관련 위젯
- **[위젯명]**: [설명]
```

### 5. 작업 후 필수 사항
- **각 위젯 완료 후 즉시 커밋**
- 커밋 메시지 형식: `docs: [위젯명] 위젯 API 문서 추가/보강 (한글/영어)`
- YouTube 영상 링크와 Flutter 참조 링크는 반드시 유지
- 한글과 영어 버전 모두 작성

---

## Claude 1 - Layout 위젯 담당

### 작업 목록
1. **Align, AspectRatio, Center, ConstrainedBox**
2. **ConstraintsTransformBox, Flex, FractionalTranslation, FractionallySizedBox**
3. **LimitedBox, OverflowBox, Spacer, UnconstrainedBox**

### 특별 주의사항
- Layout 위젯들은 constraints 시스템을 잘 설명해야 함
- BoxConstraints 타입과 관련 메서드 설명 포함
- 부모-자식 관계에서의 제약 조건 전파 설명

---

## Claude 2 - Animation & Clipping 위젯 담당

### 작업 목록
1. **AnimatedAlign, AnimatedFractionallySizedBox, AnimatedOpacity, AnimatedPadding**
2. **AnimatedPositioned, AnimatedRotation, AnimatedScale, AnimatedSlide**
3. **ClipOval, ClipPath, ClipRRect, ClipRect**
4. **AnimatedContainer 보강** (현재 개요만 있음)

### 특별 주의사항
- Animation 위젯들은 duration, curve 파라미터 상세 설명
- 모든 Curves 타입 나열 (linear, ease, easeIn, easeOut 등)
- Clipping 위젯들은 성능 영향 설명 포함

---

## Claude 3 - Rendering & Interactive 위젯 담당

### 작업 목록
1. **CustomPaint, DecoratedBox, Opacity, RichText**
2. **Transform, ZIndex**
3. **Draggable, IndexedStack**
4. **Grid, TextField, Builder** (신규 작성)
5. **SizedBox 보강** (현재 개요만 있음)

### 특별 주의사항
- CustomPaint는 Canvas API 사용법 포함
- Transform은 Matrix4 변환 예제 포함
- Interactive 위젯들은 이벤트 핸들링 상세 설명

---

## 참고할 잘 작성된 문서 예시
- Container: 모든 props 상세 설명, 다양한 실제 사용 예제
- Row/Column: mainAxisAlignment, crossAxisAlignment 시각적 설명
- GestureDetector: 모든 이벤트 핸들러 설명
- Image: objectFit, objectPosition 옵션 설명

## Git 작업 플로우
```bash
# 1. 위젯 문서 작성/수정
# 2. 변경사항 확인
git status

# 3. 파일 추가
git add packages/docs/src/content/docs/ko/widgets/[위젯명]/index.mdx
git add packages/docs/src/content/docs/en/widgets/[위젯명]/index.mdx

# 4. 커밋
git commit -m "docs: [위젯명] 위젯 API 문서 추가/보강 (한글/영어)"

# 5. TODO 체크 업데이트
```