# Flitter 튜토리얼 작성 가이드

이 문서는 Flitter 튜토리얼을 작성할 때 따라야 할 올바른 문법과 패턴을 설명합니다.

## 중요: Flitter는 Flutter가 아닙니다!

Flitter는 Flutter를 영감으로 만들어졌지만, 웹 환경에 맞게 조정된 독자적인 API를 가지고 있습니다.

## 올바른 Flitter 문법

### 1. Container decoration

**❌ 잘못된 문법:**
```typescript
// Flutter 스타일 - Flitter에서는 작동하지 않음
Container({
  decoration: BoxDecoration({
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8)
  })
})
```

**✅ 올바른 문법:**
```typescript
// Flitter는 plain object를 사용
Container({
  decoration: {
    color: Colors.blue[500],
    borderRadius: 8,  // 숫자만 사용
    border: {
      color: Colors.gray[300],
      width: 1
    },
    boxShadow: [
      {
        color: "rgba(0, 0, 0, 0.2)",  // 문자열 색상도 지원
        offset: { x: 0, y: 2 },
        blurRadius: 4
      }
    ]
  }
})

// 또는 BoxDecoration 클래스 사용
Container({
  decoration: new BoxDecoration({
    color: Colors.blue[500],
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      new BoxShadow({
        color: "rgba(0, 0, 0, 0.2)",
        offset: { x: 0, y: 2 },
        blurRadius: 4
      })
    ]
  })
})
```

### 2. 색상 처리

**❌ 잘못된 문법:**
```typescript
// Flutter의 withOpacity - Flitter에 없음
Colors.black.withOpacity(0.5)
```

**✅ 올바른 문법:**
```typescript
// rgba 문자열 사용
"rgba(0, 0, 0, 0.5)"

// 또는 Colors 팔레트
Colors.gray[500]
Colors.blue[400]
```

### 3. StatefulWidget 패턴

**❌ 잘못된 문법:**
```typescript
// React 스타일 - 사용하지 마세요
const [count, setCount] = useState(0);
let isHovered = false;
```

**✅ 올바른 문법:**
```typescript
class MyWidget extends StatefulWidget {
  createState() {
    return new MyWidgetState();
  }
}

class MyWidgetState extends State {
  // 상태는 클래스 프로퍼티로
  count = 0;
  isHovered = false;
  
  // setState 사용
  handleClick = () => {
    this.setState(() => {
      this.count++;
    });
  }
  
  build(context) {
    return Container({...});
  }
}
```

### 4. 이벤트 처리

**❌ 잘못된 문법:**
```typescript
// 직접 이벤트 핸들러 - 작동하지 않음
Container({
  onClick: () => console.log("clicked")
})
```

**✅ 올바른 문법:**
```typescript
// GestureDetector 사용
GestureDetector({
  onClick: () => console.log("clicked"),
  onMouseEnter: () => console.log("hover start"),
  onMouseLeave: () => console.log("hover end"),
  child: Container({...})
})
```

### 5. EdgeInsets

**✅ 모든 올바른 사용법:**
```typescript
// 단일 값
EdgeInsets.all(20)

// 개별 값
EdgeInsets.only({ left: 10, right: 10, top: 5, bottom: 5 })

// 대칭 값
EdgeInsets.symmetric({ horizontal: 20, vertical: 10 })

// LTRB (Left, Top, Right, Bottom)
EdgeInsets.LTRB(10, 20, 10, 20)
```

### 6. 위젯 Export 패턴

**❌ 잘못된 문법:**
```typescript
// 클래스 직접 export
export class MyWidget extends StatelessWidget {}
```

**✅ 올바른 문법:**
```typescript
// Factory 함수로 export
class _MyWidget extends StatelessWidget {
  // ...
}

export default function MyWidget(props) {
  return new _MyWidget(props);
}

// 또는 classToFunction 사용
export default classToFunction(_MyWidget);
```

## 튜토리얼 구조

### 1. 제목과 설명
- 명확하고 구체적인 제목
- 무엇을 배우는지 한 문장으로 설명

### 2. 학습 목표 체크리스트
```markdown
## 이 튜토리얼에서 배울 것

- [ ] 첫 번째 학습 목표
- [ ] 두 번째 학습 목표
- [ ] 세 번째 학습 목표
```

### 3. 단계별 설명
- 개념 설명 → 코드 예제 → 실습 순서
- 각 단계마다 명확한 제목 사용

### 4. 중요 개념 강조
```markdown
> **💡 핵심 개념: 제목**
> 
> 중요한 개념 설명...

> **⚠️ 주의: 제목**
> 
> 피해야 할 실수...
```

### 5. 실습 과제
- TODO 주석으로 구현할 부분 표시
- 힌트 제공 (details 태그 사용)
- 단계별 가이드라인

### 6. 마무리
- 학습한 내용 요약
- 다음 단계 안내

## 일반적인 실수와 해결책

### 1. Colors.grey vs Colors.gray
- Flitter는 `Colors.gray` 사용 (미국식 철자)

### 2. decoration 타입
- plain object 또는 BoxDecoration 클래스 인스턴스 사용
- Flutter의 모든 decoration 클래스가 있는 것은 아님

### 3. import 구문
- 필요한 모든 클래스를 명시적으로 import
- `from "@meursyphus/flitter"` 사용

### 4. 위젯 생성
- StatefulWidget은 `new` 키워드 사용
- factory 함수 위젯은 함수 호출처럼 사용

## 코드 예제 작성 팁

1. **완전한 예제 제공**: import부터 export까지
2. **주석 활용**: 각 단계별 설명 추가
3. **점진적 복잡도**: 간단한 것부터 시작
4. **실용적 예제**: 실제로 사용할 만한 UI 구성

## 테스트 체크리스트

튜토리얼 작성 후 확인사항:
- [ ] 모든 코드가 실제로 실행되는가?
- [ ] import 구문이 올바른가?
- [ ] Flitter 고유 문법을 사용했는가?
- [ ] 초보자도 이해할 수 있는가?
- [ ] 다음 단계로의 연결이 자연스러운가?