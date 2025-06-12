# Flitter API 문서 작성 가이드라인

## 개요
이 문서는 Flitter 위젯 API 문서를 체계적이고 가독성 있게 작성하기 위한 가이드라인입니다.

## 위젯 분석 방법

### 1단계: 위젯 구현 파일 찾기
```
packages/flitter/src/component/[WidgetName].ts
packages/flitter/src/component/base/[WidgetName].ts
```

### 2단계: 위젯 인터페이스 분석
1. **Props 인터페이스 확인**
   - `interface [WidgetName]Props` 찾기
   - 각 prop의 타입과 optional 여부 확인
   - 기본값 확인 (생성자나 factory 함수에서)

2. **위젯 타입 확인**
   - StatelessWidget
   - StatefulWidget  
   - RenderObjectWidget (SingleChild/MultiChild)
   - 함수형 컴포넌트

3. **Static 메서드 확인**
   - 헬퍼 메서드 (예: `SizedBox.shrink()`)
   - 팩토리 메서드

### 3단계: 관련 코드 분석
1. **RenderObject 확인** (RenderObjectWidget인 경우)
   - `createRenderObject()` 메서드 확인
   - 실제 렌더링 로직 파악

2. **State 클래스 확인** (StatefulWidget인 경우)
   - State 클래스의 `build()` 메서드 분석
   - 상태 관리 로직 파악

## 문서 구조 템플릿

```markdown
# [위젯명]

## 개요
[위젯이 무엇을 하는지 한 문장으로 설명]

[위젯의 주요 사용 목적과 특징을 2-3문장으로 설명]

## 언제 사용하나요?
- [사용 케이스 1]
- [사용 케이스 2]
- [사용 케이스 3]

## 기본 사용법
\`\`\`typescript
// 가장 간단한 사용 예제
const widget = Container({
  width: 100,
  height: 100,
  color: Colors.blue
});
\`\`\`

## Props 상세 설명

### 필수 Props
#### propName: Type
- **설명**: [prop이 하는 역할]
- **기본값**: [있다면 기본값]
- **예제**:
  \`\`\`typescript
  Container({ propName: value })
  \`\`\`

### 선택적 Props
[위와 같은 형식으로 작성]

## 고급 사용법

### [기능 1]
[설명과 코드 예제]

### [기능 2]  
[설명과 코드 예제]

## Static 메서드
### WidgetName.methodName()
- **설명**: [메서드 설명]
- **사용법**:
  \`\`\`typescript
  const widget = SizedBox.shrink();
  \`\`\`

## 실제 사용 예제

### 예제 1: [예제 제목]
\`\`\`typescript
// 실무에서 사용할 법한 예제
const myLayout = Column({
  children: [
    Container({ /* ... */ }),
    SizedBox({ height: 20 }),
    Text("Hello")
  ]
});
\`\`\`

### 예제 2: [예제 제목]
[더 복잡한 예제]

## 주의사항
- [주의사항 1]
- [주의사항 2]

## 관련 위젯
- **[위젯명]**: [간단한 설명과 차이점]
- **[위젯명]**: [간단한 설명과 차이점]

## 내부 동작 원리 (선택)
[RenderObject나 특별한 로직이 있다면 간단히 설명]
```

## 작성 시 주의사항

### 1. 명확한 설명
- 기술적 용어는 최소화하고 필요시 설명 추가
- "Flutter의 X와 같다"는 설명은 보조적으로만 사용
- 독립적으로 이해 가능하도록 작성

### 2. 실용적인 예제
- 단순 문법 예제보다 실제 사용 시나리오 제시
- 다양한 props 조합 예제 포함
- 흔한 실수나 패턴 소개

### 3. 시각적 이해
- 레이아웃 위젯은 ASCII 다이어그램으로 구조 표현
- 필요시 Before/After 코드 비교

### 4. 완성도 체크리스트
- [ ] 위젯의 목적이 명확히 설명되었는가?
- [ ] 모든 props가 설명되었는가?
- [ ] 실제 사용 가능한 예제가 2개 이상 있는가?
- [ ] 관련 위젯과의 차이점이 설명되었는가?
- [ ] 초보자도 이해할 수 있는가?

## 분석 예시: Container 위젯

### 1. 파일 위치
- 구현: `packages/flitter/src/component/Container.ts`
- Base: `packages/flitter/src/component/base/Container.ts`

### 2. 인터페이스 분석
```typescript
interface ContainerProps {
  width?: number;
  height?: number;
  color?: string;
  margin?: EdgeInsets;
  padding?: EdgeInsets;
  alignment?: Alignment;
  decoration?: BoxDecoration;
  constraints?: BoxConstraints;
  transform?: Matrix4;
  transformAlignment?: Alignment;
  child?: Widget;
}
```

### 3. 문서화 포인트
- 각 prop의 시각적 효과 설명
- margin vs padding 차이 도식화
- decoration과 color 동시 사용 시 우선순위
- transform 사용 예제와 주의사항
- 일반적인 사용 패턴 (카드, 버튼 배경 등)

## 다음 단계

1. 이 가이드라인에 따라 우선순위 위젯부터 문서 작성
2. 각 위젯 문서는 `packages/docs/src/content/docs/ko/widgets/[WidgetName]/api-enhanced.md`로 저장
3. 작성 완료 후 기존 index.mdx와 비교하여 개선사항 확인
4. 최종적으로 index.mdx 파일 업데이트

## 우선순위 위젯 목록

### 1순위 (핵심 레이아웃)
- Container
- Row / Column
- Stack / Positioned
- Expanded / Flexible
- SizedBox
- Padding

### 2순위 (자주 사용)
- Text / RichText
- GestureDetector
- SingleChildScrollView
- AnimatedContainer
- Image

### 3순위 (고급 기능)
- IntrinsicHeight / IntrinsicWidth
- ConstrainedBox
- Transform
- ClipRRect
- CustomPaint