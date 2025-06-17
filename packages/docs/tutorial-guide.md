# Flitter 튜토리얼 작성 가이드

## 📌 시작하기 전에 반드시 읽어주세요!
이 문서는 Flitter 튜토리얼(packages/docs/src/content/tutorial) 작성을 위한 공식 가이드입니다.
**모든 튜토리얼 작성자는 이 가이드를 숙지하고 따라주세요.**

## 📋 개요
- **주의**: 한국어(ko) 튜토리얼을 기준으로 작성합니다.
- **작성 위치**: `content/tutorial/ko/` 디렉토리에 새로운 튜토리얼을 작성합니다.
- **파일명**: 모든 파일명은 소문자와 하이픈 사용 (예: `001_hello-world.mdx`)

## 🗂️ 파일 및 폴더 구조 규칙

### 1. 폴더 명명 규칙
- **숫자 접두사 사용**: `02_quick-start`, `03_widget-interface-basics` 형식
- 숫자는 2자리로 통일: `02_`, `03_`, `04_` 등
- 폴더명은 kebab-case로 작성: `02_quick-start`
- 영어와 한국어 폴더 구조는 동일하게 유지

### 2. 파일 명명 규칙
- **MDX 확장자 사용**: `.mdx`
- **3자리 숫자 접두사**: `001_`, `002_`, `003_` 등
- **소문자와 하이픈 사용**: `001_installation.mdx`, `002_hello-world.mdx`
- **한국어는 더 서술적**: `001_container-everything-box.mdx`
- **모든 파일은 폴더 안에**: 모든 튜토리얼 파일은 반드시 챕터 폴더 안에 위치해야 함 (index.mdx 생성 금지)

### 3. 파일 구조 예시
```
content/tutorial/ko/
├── 02_quick-start/
│   ├── 001_installation.mdx
│   ├── 002_hello-world.mdx
│   └── 003_interactive-button.mdx
├── 03_widget-interface-basics/
│   ├── 001_what-are-widgets.mdx
│   └── 002_widget-tree-structure.mdx
└── 04_basic-widget-api/
    ├── 001_container-everything-box.mdx
    ├── 002_text-display-styling.mdx
    └── 003_row-column-linear-layout.mdx
```

## 📝 Frontmatter 규칙

### 기본 튜토리얼 페이지
```yaml
---
title: "설치 및 환경 설정"                 # 페이지 제목
description: "Flitter 개발을 위한 환경을 설정하고 첫 번째 프로젝트를 시작해보세요"
files:                                 # 시작 코드 파일들 (선택사항)
  App.js: |
    import Widget from "@meursyphus/flitter-react";
    // TODO: 여기에 첫 번째 위젯을 만들어보세요
    const widget = null;
    export default App;
solved_files:                          # 완성된 솔루션 파일들 (선택사항)
  App.js: |
    import Widget from "@meursyphus/flitter-react";
    import { Container, Text } from "@meursyphus/flitter";
    
    const widget = Container({
      child: Text("Hello World")
    });
    export default App;
---
```

### 중요 참고사항
- `files`와 `solved_files`는 인터랙티브 학습을 위한 선택사항 없으면 files: {} 이거라도 적으셈
- 모든 필드는 번역이 필요한 경우 각 언어에 맞게 작성

## 🎯 튜토리얼 콘텐츠 작성 규칙

### 1. 튜토리얼 구조 패턴
각 튜토리얼은 다음 구조를 따라야 합니다:

1. **제목과 개요**: 무엇을 배울지 간단히 소개
2. **학습 목표**: 체크리스트 형태로 구체적인 목표 제시
3. **사전 요구사항**: 필요한 경우만 포함
4. **핵심 개념 설명**: 이론적 배경
5. **단계별 실습**: 실제 코드 작성
6. **연습 문제**: TODO 형태의 실습
7. **예상 결과**: 완성 후 기대되는 결과
8. **추가 도전**: 심화 학습을 위한 과제
9. **흔한 실수**: 자주하는 실수와 해결법
10. **다음 단계**: 후속 학습 가이드

### 2. ❌ Flitter 문법 실수 주의사항

**절대 React 패턴 사용 금지:**
```typescript
// ❌ 잘못된 예제 - React hooks 절대 사용 금지!
const [count, setCount] = useState(0);
const [isVisible, setIsVisible] = useState(true);
let someState = false; // 이것도 금지!
```

**✅ 올바른 Flitter 패턴:**
```typescript
// ✅ 올바른 예제 - StatefulWidget 사용
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State<MyWidget> {
  count = 0;        // 클래스 속성으로 상태 관리
  isVisible = true; // 모든 상태는 클래스 속성
  
  build(context) {
    return Container({
      child: Text(`Count: ${this.count}`)
    });
  }
}
```

**❌ classToFunction 사용 금지 - 존재하지 않는 함수!**
```typescript
// ❌ 잘못된 예제 - classToFunction은 없는 함수!
import { classToFunction } from '@meursyphus/flitter'; // 에러!
export default classToFunction(MyWidget); // 에러!
```

**✅ 올바른 위젯 내보내기:**
```typescript
// ✅ 올바른 예제 - 수동으로 팩토리 함수 작성
class _MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

// 수동으로 팩토리 함수 작성
export default function MyWidget(props) {
  return new _MyWidget(props);
}
```

**❌ 이벤트 핸들링 실수:**
```typescript
// ❌ 잘못된 예제 - 직접 이벤트 핸들러 금지
Container({ 
  onClick: () => {}, // 이렇게 하면 안됨!
  child: Text("Click me") 
})
```

**✅ 올바른 이벤트 핸들링:**
```typescript
// ✅ 올바른 예제 - GestureDetector 사용
GestureDetector({
  onClick: () => {
    this.setState(() => {
      this.count++;
    });
  },
  child: Container({
    child: Text("Click me")
  })
})
```

**❌ 색상 값 실수:**
```typescript
// ❌ 잘못된 예제 - 16진수 숫자 형식 금지
color: 0xFF1F2937,    // 금지!
color: 0x33000000,    // 금지!
```

**✅ 올바른 색상 값:**
```typescript
// ✅ 올바른 예제 - 문자열 형식 사용
color: '#1F2937',           // HEX 문자열
color: 'rgba(0, 0, 0, 0.2)', // RGBA 문자열
```

**❌ 객체 생성 실수:**
```typescript
// ❌ 잘못된 예제 - 위젯에 new 사용 금지
new Container({ child: Text("Hello") })  // 금지!
new Text("Hello")                        // 금지!
```

**✅ 올바른 객체 생성:**
```typescript
// ✅ 올바른 예제
// 위젯: 팩토리 함수 사용
Container({ child: Text("Hello") })

// 타입/클래스: new 키워드 사용
new BoxDecoration({ color: '#FF0000' })
new TextStyle({ fontSize: 16 })
new EdgeInsets.all(10)
```

**❌ React Widget Import 실수:**
```typescript
// ❌ 잘못된 예제 - 구조분해할당 사용 금지!
import { Widget } from "@meursyphus/flitter-react";  // 금지!
import ReactWidget from "@meursyphus/flitter-react"; // 금지!
```

**✅ 올바른 React Widget Import:**
```typescript
// ✅ 올바른 예제 - default import 사용
import Widget from "@meursyphus/flitter-react";

// 사용법
export default function App() {
  return <Widget widget={myWidget} />;
}
```

**❌ Border 설정 실수:**
```typescript
// ❌ 잘못된 예제 - 부분적 Border 설정
border: new Border({ 
  top: new BorderSide({ color: '#000' }) // 다른 방향 누락!
})
```

**✅ 올바른 Border 설정:**
```typescript
// ✅ 올바른 예제 - 모든 방향 명시 또는 all() 사용
border: new Border({
  top: new BorderSide({ color: '#000', width: 1 }),
  right: new BorderSide({ color: '#000', width: 1 }),
  bottom: new BorderSide({ color: '#000', width: 1 }),
  left: new BorderSide({ color: '#000', width: 1 })
})

// 또는 간단하게
border: Border.all({ color: '#000', width: 1 })
```

## 📚 튜토리얼 작성 원칙

**⚠️ 중요: 튜토리얼은 완전하고 독립적이어야 합니다**

### 튜토리얼 완성도 원칙

1. **자체 완결성**: 튜토리얼은 그 자체로 완전해야 하며, 다른 문서를 참조하지 않고도 학습 목표를 달성할 수 있어야 합니다
2. **실습 중심**: 모든 개념과 기능을 실제 코드 예제와 함께 설명합니다
3. **단계별 학습**: 기초부터 고급까지 점진적으로 학습할 수 있도록 구성합니다
4. **즉시 적용 가능**: 배운 내용을 바로 실습할 수 있는 연습 문제와 예제를 제공합니다

### ❌ 금지사항: 외부 문서 참조

튜토리얼에서는 다음과 같은 문서 참조를 **절대 금지**합니다:

```markdown
❌ 금지된 패턴들:

"자세한 설명은 [Container 위젯 문서](/docs/ko/widgets/Container/)를 참고하세요"
"완전한 가이드는 [Text 위젯 문서](/docs/ko/widgets/Text/)에서 확인할 수 있습니다"
"심화 내용은 [상태 관리 가이드](/docs/ko/core-concepts/state-management/)를 참고하세요"
"설치 방법은 [설치 가이드](/docs/ko/getting-started/installation/)를 참고하세요"
```

### ✅ 올바른 튜토리얼 작성법

**모든 내용을 튜토리얼 안에서 완전히 설명합니다:**

1. **속성과 옵션을 모두 설명**: 해당 위젯의 주요 속성들을 예제와 함께 상세히 설명
2. **다양한 사용 사례 제시**: 기본부터 실전까지 여러 단계의 예제 제공
3. **실습 위주의 설명**: 이론보다는 실제 코드 작성과 결과 확인에 집중
4. **점진적 난이도 상승**: 간단한 예제부터 복잡한 실전 예제까지 단계별 진행

### 튜토리얼 구성 요소

각 튜토리얼은 다음을 모두 포함해야 합니다:

1. **개념 설명**: 해당 위젯/기능이 무엇인지 명확히 설명
2. **기본 사용법**: 가장 간단한 형태의 사용 예제
3. **주요 속성 설명**: 중요한 속성들을 예제와 함께 설명
4. **실전 예제**: 실제 앱에서 사용할 수 있는 완전한 예제
5. **연습 문제**: 학습자가 직접 시도해볼 수 있는 과제
6. **흔한 실수**: 자주 발생하는 오류와 해결 방법

### 사전 지식 참조 가이드

**⚠️ 중요: 튜토리얼 작성 전 필수 단계**

튜토리얼을 작성하기 전에 기존 문서들을 참조하여 내용을 수집하되, 
**튜토리얼 안에서 모든 내용을 완전히 다시 작성**해야 합니다:

1. **기존 문서 조사**: `packages/docs/src/content/docs/ko/` 경로에서 관련 문서를 찾아보세요
2. **위젯 문서 분석**: `packages/docs/src/content/docs/ko/8_widgets/` 에서 해당 위젯의 상세 정보를 수집하세요
3. **핵심 개념 파악**: `packages/docs/src/content/docs/ko/2_core-concepts/` 등에서 기본 개념을 이해하세요
4. **튜토리얼에 통합**: 수집한 정보를 바탕으로 튜토리얼 안에서 완전히 새로 작성하세요

## 🎯 작성해야 할 튜토리얼 목차 (TODO)

### 🚀 Chapter 1: 시작하기 (Getting Started)
**위치**: `content/tutorial/ko/1_getting-started/`

- [ ] `1_installation.mdx` - 설치 및 환경 설정
  - Node.js/npm 요구사항
  - Flitter 패키지 설치
  - React/Svelte 통합 설정
  - 개발 환경 확인

- [ ] `2_hello-world.mdx` - 첫 번째 Flitter 앱
  - 기본 프로젝트 구조
  - Container와 Text로 "Hello World" 만들기
  - 브라우저에서 결과 확인
  - 위젯 트리 이해

- [ ] `3_basic-interactions.mdx` - 기본 상호작용
  - GestureDetector로 클릭 처리
  - StatefulWidget 첫 만나기
  - setState() 사용법
  - 간단한 카운터 만들기

### 📦 Chapter 2: 기본 위젯 익히기 (Basic Widgets)
**위치**: `content/tutorial/ko/2_basic-widgets/`

- [ ] `1_container-styling.mdx` - Container로 스타일링
  - 색깔 있는 사각형 만들기
  - padding, margin으로 간격 조정
  - 테두리와 둥근 모서리
  - 간단한 박스 레이아웃

- [ ] `2_text-styling.mdx` - Text 위젯 마스터
  - 텍스트 크기와 색상
  - 폰트 굵기와 스타일
  - 텍스트 정렬 (왼쪽, 가운데, 오른쪽)
  - 라벨과 제목 만들기

- [ ] `3_row-column-layout.mdx` - Row와 Column 레이아웃
  - 가로/세로로 위젯 나열하기
  - 간격과 정렬 조정
  - 간단한 네비게이션 바 만들기
  - 기본 레이아웃 패턴

- [ ] `4_stack-positioning.mdx` - Stack과 위치 지정
  - 위젯 겹쳐서 배치하기
  - 절대 위치로 정확한 배치
  - 배지나 라벨 오버레이
  - 간단한 카드 레이아웃

### 🎨 Chapter 3: 레이아웃 위젯 (Layout Widgets)
**위치**: `content/tutorial/ko/3_layout-widgets/`

- [ ] `1_expanded-flexible.mdx` - Expanded와 Flexible
  - 공간을 나누어 차지하기
  - 남은 공간을 채우는 박스
  - 간단한 프로그레스 바 만들기
  - 비율로 영역 나누기

- [ ] `2_padding-margin.mdx` - Padding과 여백 관리
  - 박스 안쪽/바깥쪽 여백
  - 대칭/비대칭 여백 설정
  - 카드 형태의 레이아웃
  - 여백으로 시각적 그룹핑

- [ ] `3_sized-constrained-box.mdx` - 크기 제약 위젯들
  - 정확한 크기의 박스 만들기
  - 최소/최대 크기 제한하기
  - 정사각형, 직사각형 유지하기
  - 고정 크기 아이콘 영역

- [ ] `4_align-center.mdx` - 정렬 위젯들
  - 박스를 중앙에 배치하기
  - 모서리와 가장자리 정렬
  - 9개 기본 위치 (상하좌우, 모서리)
  - 라벨과 아이콘 정렬

### 🎭 Chapter 4: 상호작용 위젯 (Interactive Widgets)
**위치**: `content/tutorial/ko/4_interactive-widgets/`

- [ ] `1_gesture-detector-complete.mdx` - GestureDetector 완전 정복
  - 모든 제스처 이벤트 (클릭, 더블클릭, 롱프레스)
  - 마우스 이벤트 (호버, 엔터, 리브)
  - 드래그 이벤트 처리
  - 제스처 조합과 우선순위

- [ ] `2_draggable-drag.mdx` - Draggable
  - 드래그 가능한 위젯 만들기

- [ ] `3_stateful-widget-patterns.mdx` - StatefulWidget 패턴들
  - State 라이프사이클 이해
  - initState(), dispose() 활용
  - didUpdateWidget() 처리
  - 복잡한 상태 관리


### 🎪 Chapter 5: 애니메이션 위젯 (Animation Widgets)
**위치**: `content/tutorial/ko/5_animation-widgets/`

- [ ] `1_animated-container.mdx` - AnimatedContainer 활용
  - 암시적 애니메이션 이해
  - duration과 curve 설정
  - 크기, 색상, 위치 애니메이션
  - 연쇄 애니메이션 구현

- [ ] `2_animated-widgets-collection.mdx` - 다양한 Animated 위젯들
  - AnimatedOpacity로 투명도 애니메이션
  - AnimatedPadding으로 여백 애니메이션
  - AnimatedAlign으로 위치 애니메이션
  - AnimatedScale, AnimatedRotation 등

- [ ] `3_animation-controller.mdx` - AnimationController 마스터
  - 명시적 애니메이션 제어
  - Tween과 CurvedAnimation
  - AnimationBuilder 패턴
  - 복잡한 애니메이션 시퀀스

- [ ] `4_custom-animations.mdx` - 커스텀 애니메이션
  - AnimatedWidget 상속
  - CustomPaint와 애니메이션 결합
  - 물리 기반 애니메이션
  - 성능 최적화 기법

### 🎨 Chapter 6: 그래픽과 페인팅 (Graphics & Painting)
**위치**: `content/tutorial/ko/6_graphics-painting/`

- [ ] `1_custom-paint-basics.mdx` - CustomPaint 기초
  - 선 그리기 (수평선, 수직선)
  - 원과 사각형 그리기
  - 색상과 선 굵기 설정
  - 간단한 도형 조합

- [ ] `2_data-visualization-basics.mdx` - 데이터 시각화 기초
  - 숫자를 막대 길이로 표현하기
  - 여러 개의 막대 나란히 그리기
  - 색상으로 데이터 구분하기
  - 라벨과 제목 추가하기

- [ ] `3_interactive-graphics.mdx` - 상호작용하는 그래픽
  - 클릭으로 색상 변경하기
  - 마우스 호버 효과
  - 간단한 토글 기능
  - 실시간 데이터 업데이트

- [ ] `4_simple-charts.mdx` - 간단한 차트 만들기
  - 기본 막대차트 구현
  - 원형 진행률 표시기
  - 간단한 라인 그래프
  - Chart.js 대신 Flitter로


## ⚠️ 주의사항

1. **React 패턴 절대 금지**: 모든 예제는 Flitter/Flutter 스타일로만 작성
2. **한국어 우선**: 모든 튜토리얼은 한국어(ko)로 먼저 작성
3. **실제 동작하는 코드**: 모든 예제는 반드시 실제로 동작해야 함
4. **점진적 학습**: 쉬운 내용에서 어려운 내용으로 단계적 진행
5. **문서 참조**: 복잡한 속성은 위젯 문서 참조로 처리
6. **파일명 소문자**: 모든 파일명은 소문자와 하이픈만 사용
7. **TODO 형태 실습**: 학습자가 직접 코드를 완성할 수 있는 형태

## 🚀 다음 단계

1. [ ] 기존 튜토리얼 분석 및 개선점 파악
2. [ ] 신규 챕터 5-9 상세 계획 수립
3. [ ] 우선순위에 따른 튜토리얼 작성 시작
4. [ ] 인터랙티브 코드 예제 강화
5. [ ] 영어 번역 작업 (ko → en)


# Flitter 튜토리얼 작성 가이드

## 중요한 문법 규칙

### 1. React 통합 패턴
- flitter-react를 사용할 때는 `<Widget widget={...} />`이 export default여야 함
```javascript
import Widget from '@meursyphus/flitter-react';

export default function App() {
  return <Widget widget={widget} />;
}
```

### 2. EdgeInsets 사용법
- padding은 `EdgeInsets.all()` 형태로 사용
- 잘못된 예: `padding: { all: 20 }`
- 올바른 예: `padding: EdgeInsets.all(20)`

### 3. 올바른 예시 찾기
- `packages/docs/src/components/pages/docs/` 디렉토리에서 컴포넌트 사용법 참고
- 실제 사용 예시를 찾아서 문법 확인 필수

### 4. Flitter vs React 문법
- Flitter는 Flutter 스타일을 따름
- React hooks (useState, useEffect 등) 사용 금지
- StatefulWidget/StatelessWidget 패턴 사용

### 5. 주의사항
- classToFunction, Alignment 같은 존재하지 않는 API 사용 금지
- 실제 Flitter API 문서와 예시 코드 참고 필수