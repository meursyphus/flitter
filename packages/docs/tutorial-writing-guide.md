# Flitter 튜토리얼 작성 가이드

## 문서 구조

### 파일 위치
```
packages/docs/src/content/tutorial/
├── ko/           # 한국어 튜토리얼
└── en/           # 영어 튜토리얼
```

### 파일명 규칙
```
[섹션번호]_[섹션영문명]/
├── [순서번호]_[파일명].mdx
└── index.mdx (선택사항)
```

예시:
```
01_attractive-start/
├── 001_interactive-charts.mdx
├── 002_erd-editor.mdx
└── 003_realtime-dashboard.mdx
```

## MDX Frontmatter 구조

### 기본 Frontmatter (필수 필드)
```yaml
---
nav_group: "빠른 시작"         # 네비게이션 그룹명 (필수)
nav_order: 1                   # 그룹 내 순서 (선택사항)
title: "설치 및 환경 설정"      # 페이지 제목 (필수)
description: "Flitter 개발을 위한 환경을 설정하고 첫 번째 프로젝트를 시작해보세요"  # 페이지 설명 (필수)
files:                         # 코드 파일들 (필수)
  App.js: |
    import { useEffect, useRef } from "react";
    import { AppRunner } from "@meursyphus/flitter";
    
    export default function App() {
      const svgRef = useRef(null);
      const containerRef = useRef(null);
      
      useEffect(() => {
        // TODO: Initialize Flitter
      }, []);
      
      return (
        <div ref={containerRef} style={{ width: "500px", height: "300px" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        </div>
      );
    }
---
```

### 연습 문제가 있는 경우 (solved_files 추가)
```yaml
---
nav_group: "빠른 시작"
nav_order: 1
title: "설치 및 환경 설정"
description: "Flitter 개발을 위한 환경을 설정하고 첫 번째 프로젝트를 시작해보세요"
files:
  App.js: |
    import { useEffect, useRef } from "react";
    import { AppRunner } from "@meursyphus/flitter";
    
    export default function App() {
      const svgRef = useRef(null);
      const containerRef = useRef(null);
      
      useEffect(() => {
        // TODO: Initialize Flitter
      }, []);
      
      return (
        <div ref={containerRef} style={{ width: "500px", height: "300px" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        </div>
      );
    }

solved_files:                  # 완성된 코드 (선택사항)
  App.js: |
    import { useEffect, useRef } from "react";
    import { AppRunner, Container, Text, Center } from "@meursyphus/flitter";
    
    export default function App() {
      const svgRef = useRef(null);
      const containerRef = useRef(null);
      
      useEffect(() => {
        const widget = Container({
          width: 300,
          height: 200,
          color: "blue",
          child: Center({
            child: Text("설치 완료!")
          })
        });

        const runner = new AppRunner({
          view: svgRef.current
        });
        
        runner.onMount({
          resizeTarget: containerRef.current
        });
        
        runner.runApp(widget);
        
        return () => {
          runner.dispose();
        };
      }, []);
      
      return (
        <div ref={containerRef} style={{ width: "500px", height: "300px" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
        </div>
      );
    }
---
```

### Frontmatter 필드 설명

**필수 필드:**
- `nav_group`: 네비게이션에서 그룹화할 섹션명 (예: "빠른 시작", "위젯 인터페이스 기초")
- `title`: 페이지 제목 (브라우저 탭과 페이지 상단에 표시)
- `description`: 페이지 설명 (SEO 메타 태그와 미리보기에 사용)
- `files`: 튜토리얼에서 사용할 초기 코드 파일들

**선택사항 필드:**
- `nav_order`: 그룹 내에서의 순서 (지정하지 않으면 파일명 순서)
- `image`: 썸네일 이미지 경로
- `solved_files`: 연습 문제의 완성된 해답 코드

## 문서 내용 구조

### 1. 도입부 (Hook)
```markdown
# [제목]

[흥미를 끄는 첫 문장 - 시각적이거나 실용적인 결과물 언급]

[1-2문장으로 이 튜토리얼에서 배울 내용 요약]
```

### 2. 학습 목표
```markdown
## 이 튜토리얼에서 배울 것

- [ ] 구체적인 학습 목표 1
- [ ] 구체적인 학습 목표 2
- [ ] 구체적인 학습 목표 3
```

### 3. 즉시 체험 섹션 (해당하는 경우)
```markdown
## 바로 체험해보기

[CodeSandbox나 라이브 데모 링크]

위 데모를 직접 조작해보세요. [구체적인 상호작용 안내]
```

### 4. 단계별 설명
```markdown
## 1단계: [단계명]

[단계에 대한 간단한 설명]

```typescript
// 코드 예시 (주석으로 핵심 개념 설명)
const widget = Container({
  // Container는 Flitter의 기본 레이아웃 위젯입니다
  width: 200,
  height: 100,
  child: Text("Hello!")
});
```

### 핵심 개념 박스
> **💡 핵심 개념: [개념명]**
> 
> [개념에 대한 간단명료한 설명]
> 
> 실무에서는 [실제 활용 예시]

[단계 완료 후 결과물 설명]
```

### 5. 연습 문제 (선택사항)
```markdown
## 연습해보기

다음 요구사항을 만족하는 위젯을 만들어보세요:

1. [구체적인 요구사항 1]
2. [구체적인 요구사항 2]

**힌트:** [도움이 될 만한 힌트]

<details>
<summary>정답 보기</summary>

```typescript
// 해답 코드
```

</details>
```

### 6. 다음 단계 안내
```markdown
## 다음 단계

이제 [현재 학습한 내용]을 익혔습니다! 

다음 튜토리얼에서는 [다음에 배울 내용]을 알아보겠습니다.

👉 [다음 튜토리얼 링크 및 제목]
```

## 작성 스타일 가이드

### 톤앤매너
- **친근하고 격려적인 톤** 사용
- **"우리", "함께"** 등의 표현으로 동반자 느낌
- **성취감을 주는 표현** 사용 ("잘했습니다!", "완벽합니다!")

### 코드 예시 작성 규칙
1. **실행 가능한 완전한 코드** 제공
2. **핵심 부분에 주석** 추가
3. **점진적 복잡도 증가** (한 번에 너무 많은 개념 X)
4. **실무에서 사용할 만한 예시** 선택


### 주의사항 표시
```markdown
⚠️ **주의**: [주의할 점]

💡 **팁**: [유용한 팁]

🔥 **고급**: [고급 사용법]

🐛 **문제해결**: [자주 발생하는 문제와 해결법]
```

## 품질 체크리스트

### 내용 품질
- [ ] 학습 목표가 명확하게 제시되었는가?
- [ ] 모든 코드 예시가 실행 가능한가?
- [ ] 단계별로 점진적으로 난이도가 증가하는가?
- [ ] 핵심 개념이 적절히 설명되었는가?

### 사용자 경험
- [ ] 첫 문장이 흥미를 끄는가?
- [ ] 즉시 결과를 볼 수 있는 데모가 있는가?
- [ ] 연습 문제로 학습을 확인할 수 있는가?
- [ ] 다음 단계로 자연스럽게 이어지는가?

### 기술적 정확성
- [ ] Flitter의 올바른 패턴을 사용했는가?
- [ ] 코드 스타일이 일관적인가?
- [ ] 성능이나 보안상 문제가 없는가?
- [ ] 최신 버전의 API를 사용했는가?

### 국제화 지원
- [ ] 한국어/영어 버전이 모두 작성되었는가?
- [ ] 문화적 맥락을 고려했는가?
- [ ] 이미지의 텍스트도 현지화되었는가?

## 코드 스타일 가이드

### Flitter 위젯 사용 패턴
```typescript
// ✅ 좋은 예시 - Factory 함수 사용
const widget = Container({
  width: 200,
  height: 100,
  child: Text("Hello!")
});

// ❌ 나쁜 예시 - 클래스 직접 인스턴스화
const widget = new _Container({...});
```

### 상태 관리 패턴
```typescript
// ✅ 좋은 예시 - StatefulWidget 사용
class CounterWidget extends StatefulWidget {
  createState() {
    return new CounterState();
  }
}

class CounterState extends State<CounterWidget> {
  count = 0;
  
  build(context) {
    return GestureDetector({
      onClick: () => {
        this.setState(() => {
          this.count++;
        });
      },
      child: Text(`Count: ${this.count}`)
    });
  }
}

// ❌ 나쁜 예시 - React 훅 패턴 사용
const [count, setCount] = useState(0); // Flitter에서는 사용 안 함
```

### 이벤트 처리 패턴
```typescript
// ✅ 좋은 예시 - GestureDetector 사용
GestureDetector({
  onClick: () => { /* 클릭 처리 */ },
  onMouseEnter: () => { /* 호버 시작 */ },
  onMouseLeave: () => { /* 호버 끝 */ },
  child: Container({...})
})

// ❌ 나쁤 예시 - 직접 이벤트 핸들러
Container({
  onClick: () => {...} // Container는 직접 클릭 이벤트를 지원하지 않음
})
```

## 파일 관리

### 이미지 파일
```
tutorial/
├── images/
│   ├── ko/           # 한국어 이미지
│   └── en/           # 영어 이미지
├── demos/            # 데모 코드
└── examples/         # 예시 프로젝트
```

### 예시 프로젝트 구조
```
examples/
├── 01-hello-world/
│   ├── package.json
│   ├── src/
│   └── README.md
└── 02-interactive-chart/
    ├── package.json
    ├── src/
    └── README.md
```

이 가이드를 따라 일관성 있고 고품질의 Flitter 튜토리얼을 작성해주세요!