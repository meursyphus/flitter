# Flitter 문서 작성 가이드

## 📌 시작하기 전에 반드시 읽어주세요!
이 문서는 Flitter 문서(packages/docs) 작성을 위한 공식 가이드입니다.
**모든 문서 작성자는 이 가이드를 숙지하고 따라주세요.**

## 📋 개요
- **주의**: 한국어(ko) 문서를 기준으로 작성합니다.
- **작성 위치**: `content/docs/ko/` 디렉토리에 새로운 문서를 작성합니다.
## 🎨 커스텀 컴포넌트 작성 규칙 (중요!)

### 📍 컴포넌트 위치
- **theme**: 문서가 다크테마니까 컴포넌트도 이에 어울리는 색상으로 tailwind
- **경로**: `packages/docs/src/components/pages/docs/`
- **구조**: `content/docs2/ko`와 동일한 폴더 구조로 작성
- **예시**: 
  - MDX: `content/docs2/ko/01_getting-started/introduction.mdx`
  - 컴포넌트: `components/pages/docs/01_getting-started/IntroductionExample.tsx`

### ⚡ Flitter 예시 컴포넌트 작성 방법
모든 Flitter 예시는 실제로 렌더링되는 인터랙티브 컴포넌트로 제공해야 합니다:

```typescript
// 예시: TextAlignmentExample.tsx
import Widget from '@meursyphus/flitter-react';
import { Center, Container, Text, TextAlign, TextOverflow } from '@meursyphus/flitter';

interface TextAlignmentExampleProps {
  title: string;
  description: string;
}

export default function TextAlignmentExample({ 
  title, 
  description 
}: TextAlignmentExampleProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      
      {/* Flitter 렌더링 영역 */}
      <div style={{ height: '200px', border: '1px solid #ccc' }}>
        <Widget
          width="400px"
          height="200px"
          renderer="svg" // 또는 "canvas"
          widget={
            Center({
              child: Container({
                width: 200,
                child: Text("긴 텍스트를 자동으로 줄바꿈하면서 가운데 정렬하기", {
                  textAlign: TextAlign.center,
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis
                })
              })
            })
          }
        />
      </div>
      
      {/* 코드 표시 */}
      <pre><code>{`
Center({
  child: Container({
    width: 200,
    child: Text("긴 텍스트를 자동으로 줄바꿈하면서 가운데 정렬하기", {
      textAlign: TextAlign.center,
      maxLines: 3,
      overflow: TextOverflow.ellipsis
    })
  })
})
      `}</code></pre>
    </div>
  );
}
```

### 📋 MDX에서 사용하기
```mdx
import TextAlignmentExample from '@components/pages/docs/01_getting-started/TextAlignmentExample';

<TextAlignmentExample
  client:load
  title="텍스트 가운데 정렬 예시"
  description="Flitter로 텍스트를 쉽게 가운데 정렬하고 자동 줄바꿈을 구현합니다."
/>
```

⚠️ **중요**: 모든 커스텀 컴포넌트는 `client:load` 디렉티브를 반드시 포함해야 합니다. 이는 Astro가 클라이언트 사이드에서 컴포넌트를 렌더링하도록 지시합니다.

### ✅ 컴포넌트 작성 규칙
- **파일명**: 소문자와 하이픈 사용, 각 폴더 내에서 01부터 순번 시작
  - 폴더별 독립적인 번호 체계
  - 예시 구조:
    ```
    components/pages/docs/
    ├── 01_getting-started/
    │   ├── 01-hello-world-example.tsx
    │   ├── 02-basic-shapes-example.tsx
    │   └── 03-layout-example.tsx
    ├── 02_core-concepts/
    │   ├── 01-declarative-vs-imperative-example.tsx
    │   ├── 02-stateless-widget-example.tsx
    │   └── 03-stateful-widget-example.tsx
    └── 03_advanced-usage/
        ├── 01-render-object-example.tsx
        └── 02-custom-paint-example.tsx
    ```
- **확장자**: `.tsx` 사용
- **라이브러리**: `@meursyphus/flitter-react` 활용
- **Props**: 다국어 지원을 위해 모든 텍스트는 props로 전달
- **다크 테마**: 문서는 다크 테마 환경이므로 배경색과 텍스트 색상 고려
  - 배경: `bg-gray-900/50`, 테두리: `border-gray-700`
  - 텍스트: `text-white`, `text-gray-400`
  - 코드 블록: `bg-gray-950`, `text-gray-300`
- **Widget 크기**: width는 "100%", height는 적절한 px 값 사용
- **가운데 정렬**: Flexbox를 사용하여 Widget을 가운데 배치
- **객체 생성 규칙**: 
  - 위젯: 팩토리 함수 사용 (예: `Container({...})`)
  - 타입/클래스: `new` 키워드 사용 (예: `new BoxDecoration({...})`, `new TextStyle({...})`)
  - Border는 4개 방향 모두 명시: `new Border({ top: new BorderSide(...), right: ..., bottom: ..., left: ... })`
  - BorderRadius는 `BorderRadius.circular()` 또는 `BorderRadius.only()` 사용
- **색상 값**: 
  - 모든 color는 string 타입 사용
  - HEX 형식: `'#1F2937'`
  - RGBA 형식: `'rgba(0, 0, 0, 0.2)'`
  - ❌ 잘못된 예: `0xFF1F2937`, `0x33000000`
- **코드 표시**: 실제 Flitter 코드를 함께 보여주기
- **Import 규칙**:
  - Widget은 `import Widget from '@meursyphus/flitter-react';` (default export)
  - 나머지는 named import: `import { Container, Text, ... } from '@meursyphus/flitter';`
- **MDX에서 사용 시 필수사항**:
  - 모든 커스텀 컴포넌트는 반드시 `client:load` 디렉티브 포함
  - 예: `<MyComponent client:load prop1="value" />`
  - 이를 빠뜨리면 컴포넌트가 렌더링되지 않음!
**위젯에 대한 내용을 소개할때는 이미 작성된 content/docs/ko/widgets를 참고하면 쉽게 인터페이스를 파악할 수 있습니다.**


## 🗂️ 파일 및 폴더 구조 규칙

### 1. 폴더 명명 규칙
- **숫자 접두사 사용**: `01_시작하기`, `02_핵심개념`, `03_위젯` 형식
- 숫자는 네비게이션 순서를 결정합니다
- 폴더명은 kebab-case로 작성: `01_getting-started`
- 숫자 접두사는 URL에서 자동으로 제거됩니다 (예: `01_getting-started` → `/docs/ko/getting-started`)

### 2. 파일 명명 규칙
- MDX 확장자 사용: `.mdx`
- 소문자와 하이픈 사용: `introduction.mdx`, `creating-your-first-app.mdx`
- 위젯 문서는 각각의 폴더 안에 `index.mdx` 파일로 생성
  ```
  07_widgets/
    Container/
      index.mdx
    Text/
      index.mdx
  ```

### 3. 순서 정하기
- 폴더: `01_`, `02_`, `03_` 등의 접두사로 순서 지정
- 파일: 폴더 내에서 파일명 앞에 숫자 추가 가능 (선택사항)
- 숫자가 작을수록 먼저 표시됩니다
- frontmatter의 nav_order는 사용하지 않습니다

## 📝 Frontmatter 규칙

### 기본 문서 페이지
```yaml
---
nav_title: "소개"                 # 네비게이션에 표시될 짧은 제목 (선택사항)
title: "Flitter 소개"             # 페이지 제목
description: "Flitter는 Flutter에서 영감을 받은 JavaScript 렌더링 엔진입니다" # SEO용 설명
---
```

### 위젯 문서 페이지
```yaml
---
nav_title: "Container"            # 네비게이션에 표시될 짧은 제목
title: "Container 위젯"           # 페이지 제목
description: "자식 위젯을 감싸고 스타일을 적용하는 기본 컨테이너 위젯"
---
```

### 중요 참고사항
- 네비게이션 그룹은 폴더 구조에서 자동으로 추출됩니다
- 파일 순서는 파일명의 숫자 접두사로 결정됩니다
- `title`과 `description`은 필수입니다
- `nav_title`은 선택사항입니다 (짧은 제목이 필요한 경우)

## 📚 문서 내용 구성 가이드

### 1. 개념 설명 페이지
각 개념 페이지는 다음 구조를 따라야 합니다:

1. **개요**: 개념에 대한 간단한 소개
2. **왜 중요한가?**: 이 개념을 이해해야 하는 이유
3. **핵심 개념**: 주요 용어와 아이디어 설명
4. **코드 예제**: 실제 동작하는 예제 코드
5. **실습 예제**: 점진적으로 복잡해지는 여러 예제
6. **주의사항**: 흔한 실수나 중요한 팁
7. **다음 단계**: 관련된 다른 주제로의 링크

### 2. 위젯 문서 페이지
각 위젯 문서는 다음 구조를 따라야 합니다:

1. **개요**: 위젯의 목적과 Flutter 문서 링크
2. **언제 사용하나요?**: 5-6개의 사용 사례 bullet points
3. **기본 사용법**: StatefulWidget을 사용한 완전한 예제
4. **Props**: 각 속성에 대한 상세 설명 (타입, 기본값, 예제)
5. **실용적인 예제들**: 다양한 사용 사례를 보여주는 여러 예제
6. **중요 참고사항**: 주요 고려사항과 제한사항
7. **관련 위젯**: 유사하거나 함께 사용하는 위젯 링크

### 3. 코드 예제 작성 규칙

**반드시 Flitter/Flutter 패턴 사용:**
```typescript
// ✅ 올바른 예제 - StatefulWidget 사용
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State<MyWidget> {
  isExpanded = false;  // 클래스 속성으로 상태 관리
  
  build(context: BuildContext): Widget {
    return GestureDetector({
      onClick: () => {
        this.setState(() => {
          this.isExpanded = !this.isExpanded;
        });
      },
      child: Container({ /* ... */ })
    });
  }
}

export default classToFunction(MyWidget);
```

**절대 React 패턴 사용 금지:**
```typescript
// ❌ 잘못된 예제 - React hooks
const [isExpanded, setIsExpanded] = useState(false);
```

### 4. ❌ classToFunction 사용 금지!

**중요**: `classToFunction`은 존재하지 않는 함수입니다. 사용하지 마세요!

```typescript
// ❌ 잘못된 예제 - classToFunction은 없는 함수!
import { classToFunction } from '@meursyphus/flitter'; // 에러!
export default classToFunction(MyWidget); // 에러!
```

**올바른 방법**:
```typescript
// ✅ 올바른 예제 - 직접 팩토리 함수 작성
class _MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

// 수동으로 팩토리 함수 작성
export default function MyWidget(props?: MyWidgetProps): Widget {
  return new _MyWidget(props);
}

// 또는 Widget 컴포넌트에서 직접 사용
widget={new MyWidget()}
```

## 🎯 작성해야 할 주요 콘텐츠

### 1. 시작하기 (01_getting-started)
- [x] **introduction.mdx - 왜 Flitter를 사용해야 하는가?**
  - **타겟 독자와 문제 상황**
    - SaaS 기업의 다이어그램/차트 개발팀 소개
    - 복잡해지는 코드 난이도로 고생하는 개발팀들
    - Flutter 문법으로 해결하고 싶은 팀을 위한 솔루션
  - **Flitter vs Other Libraries**
    - D3.js vs Flitter: 복잡한 계산 문제 예시 코드 비교
    - Konva, Fabric.js, Paper.js, Raphael.js와의 비교
    - 듀얼 렌더러(Canvas/SVG) 지원 강조
    - SSR 모드: SVG 서버 렌더링 → 클라이언트 하이드레이션
    - 성능 최적화와 렌더링 최적화 사례
    - SSR & Hydration이 되는 유일한 솔루션 강조
  - **실제 검증 사례**
    - easyrd.dev 프로젝트 소개
    - headless-chart 활용 사례
  - **주요 사용 시나리오**
    - 다이어그램 편집기 기능
    - 워크플로우 시각화 도구
    - 인터랙티브 대시보드
    - HTML로는 그려지지 않는 복잡한 그래픽
- [ ] **설치 및 설정**
  - npm install 가이드
  - 기본 프로젝트 설정
- [ ] **Hello World - 텍스트 가운데 배치** (컴포넌트 예시: 1)
  - D3로 할 때: 복잡한 좌표 계산 코드
  - Flitter로 할 때: Center + Text로 간단 해결
  - 선언형 vs 명령형 차이 체감
- [ ] **기본 요소들**
  - 기본 도형 (2): Rectangle, Circle
  - 레이아웃 (3): Center, Align, Column, Row
  - 텍스트 처리 (4): 자동 줄바꿈, 스타일링
  - 간단한 스타일링 (5): 색상, 크기
- [ ] **기본 상호작용**
  - GestureDetector (6): 클릭 이벤트 쉽게 달기

### 2. 핵심 개념 이해 (02_core-concepts)
- [x] **선언형 렌더링** (컴포넌트 예시: 01)
  - Imperative vs Declarative 심화 비교
  - React 개발자들이 이해하기 쉬운 설명
- [x] **위젯 시스템** (컴포넌트 예시: 02-03)
  - StatelessWidget (02): 정적 컴포넌트
  - StatefulWidget (03): 상태 있는 컴포넌트
  - 라이프사이클: initState, dispose, didUpdateWidget 등
- [ ] **상태 관리** (컴포넌트 예시: 10)
  - Provider (10): 복잡한 상태 공유
  - 컴포넌트 간 데이터 전달
- [ ] **애니메이션 기초** (컴포넌트 예시: 11)
  - AnimationController (11): Tween 참고
  - 기본 애니메이션 구현

### 3. 고급 활용 (03_advanced-usage)
- [ ] **01_render-object란-무엇인가.mdx - RenderObject 시스템의 이해** (컴포넌트 예시: 01-02)
  - **Widget Tree → Element Tree → RenderObject Tree** (01)
    - 도식으로 보는 세 개의 트리 구조
    - Widget은 설계도, Element는 인스턴스, RenderObject는 실제 렌더링
    - 각 트리의 역할과 관계
  - **Layout과 Paint의 분리** (02)
    - performLayout(): 크기와 위치 계산
    - paint(): 실제 화면에 그리기
    - 왜 분리되어 있는가? (성능 최적화)
  - **소스 코드 위치**
    - `packages/flitter/src/renderobject/` 디렉토리 참고

- [ ] **02_constraints-시스템-이해하기.mdx - 레이아웃의 핵심 원리** (컴포넌트 예시: 03-05)
  - **Constraints go down, Sizes go up** (03)
    - 도식으로 보는 제약 전달 과정
    - BoxConstraints의 minWidth, maxWidth, minHeight, maxHeight
    - 부모가 자식의 크기를 어떻게 제한하는가
  - **다양한 Constraints 패턴** (04)
    - Constraints.tight(Size): 정확한 크기 강제
    - Constraints.loose(Size): 최대 크기만 제한
    - Constraints.expand(): 가능한 최대로 확장
    - UnconstrainedBox: 제약 무시하기
  - **실제 예제로 이해하기** (05)
    - Container의 width/height가 어떻게 동작하는가
    - SizedBox vs Container의 차이
    - 흔한 레이아웃 문제와 해결
  - **소스 코드 위치**
    - `packages/flitter/src/type/constraints.ts` 참고

- [ ] **03_column-직접-만들어보기.mdx - RenderObjectWidget 실습** (컴포넌트 예시: 06-08)
  - **RenderObjectWidget 소개** (06)
    - SingleChildRenderObjectWidget vs MultiChildRenderObjectWidget
    - createRenderObject() 메서드의 역할
    - updateRenderObject()로 속성 업데이트
  - **SimpleColumn 구현하기** (07)
    - MultiChildRenderObjectWidget 상속
    - RenderSimpleColumn 클래스 작성
    - performLayout()에서 자식들 배치하기
    - 실제 Column의 간소화된 버전
  - **페인팅 위젯 만들기** (08)
    - paint() 메서드 구현
    - SVG와 Canvas 렌더러 모두 지원하기
    - 필요한 부분만 구현하면 됨
  - **소스 코드 위치**
    - `packages/flitter/src/component/Column.ts` 참고
    - `packages/flitter/src/renderobject/` 디렉토리 참고

- [ ] **04_custom-paint로-쉽게-그리기.mdx - 그리기 작업 단순화** (컴포넌트 예시: 09-11)
  - **CustomPaint 위젯의 등장 배경** (09)
    - RenderObjectWidget은 복잡함
    - 그리기만 커스텀하고 싶을 때
    - 일급 함수로 paint 동작 전달
  - **CustomPaint 사용하기** (10)
    - painter 속성에 함수 전달
    - Canvas API 활용하기
    - shouldRepaint로 최적화
  - **실용적인 예제** (11)
    - 간단한 차트 그리기
    - 애니메이션과 결합
    - 복잡한 도형 그리기
  - **소스 코드 위치**
    - `packages/flitter/src/component/CustomPaint.ts` 참고

- [ ] **05_실전-활용-사례.mdx - 고급 기능 활용** (컴포넌트 예시: 12-14)
  - **노드 기반 다이어그램** (12)
    - 커스텀 RenderObject로 노드 구현
    - 연결선 그리기
    - 드래그 앤 드롭 처리
  - **고성능 차트 렌더링** (13)
    - 대량 데이터 포인트 처리
    - 레이어 분리로 최적화
    - 부분 업데이트 전략
  - **인터랙티브 비주얼라이제이션** (14)
    - 복잡한 애니메이션
    - 제스처와 렌더링 결합
    - 실시간 업데이트

### 4. 실전 활용 예시 (04_examples)
- [ ] **차트 구현 사례**
  - 기본 바 차트 구현 코드
  - 인터랙티브 라인 차트
  - D3 vs Flitter 코드 비교
- [ ] **다이어그램 구현 사례**
  - 플로우차트 노드 구현
  - 드래그 앤 드롭 다이어그램
  - SaaS 워크플로우 예제
- [ ] **실제 프로젝트 분석**
  - easyrd.dev: 어떻게 활용했는지 (gif 삽입 예정)
  - headless-chart: 구현 패턴 분석 (gif 삽입 예정)
  - 커뮤니티 프로젝트 사례들

### 5. 위젯 레퍼런스 (05_widgets) - 이미 작성됨
모든 위젯에 대한 상세 문서 (현재 52개 위젯)
- 기본 위젯 (Container, Text, Image 등)
- 레이아웃 위젯 (Row, Column, Stack 등)
- 상호작용 위젯 (GestureDetector, Button 등)
- 애니메이션 위젯 (AnimatedContainer 등)

## 💡 로직 참고

실제 구현 로직을 참고하려면 `packages/flitter/src/` 디렉토리를 확인하세요:
- `/component/`: 위젯 구현
- `/renderobject/`: 렌더 객체
- `/animation/`: 애니메이션 시스템
- `/type/`: 타입 정의
- `/widget/`: 위젯 베이스 클래스

## ⚠️ 주의사항

1. **React 패턴 사용 금지**: 모든 예제는 Flitter/Flutter 스타일로 작성
2. **한국어 우선**: 모든 문서는 한국어(ko)로 먼저 작성
3. **실제 동작하는 코드**: 모든 예제는 실제로 동작해야 함
4. **일관성 유지**: 용어와 스타일을 일관되게 사용
5. **점진적 학습**: 쉬운 내용에서 어려운 내용으로 진행

## 🚀 다음 단계

1. 현재 문서 구조 분석 완료
2. 각 섹션별 상세 콘텐츠 작성 계획 수립
3. 우선순위에 따라 문서 작성 시작
4. 코드 예제와 인터랙티브 데모 추가
5. 번역 작업 (ko → 다른 언어들)