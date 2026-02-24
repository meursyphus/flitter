import Widget from '@meursyphus/flitter-react';
import {
  AnimationController,
  Container,
  GestureDetector,
  Center,
  Transform,
  Text,
  TextStyle,
  State,
  StatefulWidget,
  BuildContext,
  Animation,
  Tween,
  CurvedAnimation,
  Curves,
  BoxDecoration,
  BorderRadius,
  Column,
  MainAxisAlignment,
  SizedBox
} from '@meursyphus/flitter';

interface AnimationControllerExampleProps {
  title: string;
  description: string;
}

class _AnimationExample extends StatefulWidget {
  createState() {
    return new AnimationExampleState();
  }
}

// 커스텀 BoxDecoration Tween
class DecorationTween extends Tween<BoxDecoration> {
  constructor({ begin, end }: { begin: BoxDecoration; end: BoxDecoration }) {
    super({ begin, end });
  }

  protected lerp(t: number): BoxDecoration {
    return BoxDecoration.lerp(this.begin, this.end, t);
  }
}

class AnimationExampleState extends State<_AnimationExample> {
  controller!: AnimationController;
  sizeAnimation!: Animation<number>;
  decorationAnimation!: Animation<BoxDecoration>;
  rotationAnimation!: Animation<number>;
  
  initState(context: BuildContext) {
    super.initState(context);
    
    // AnimationController 생성 (duration은 밀리초 단위)
    this.controller = new AnimationController({
      duration: 2000  // 2초
    });
    
    // 크기 애니메이션
    this.sizeAnimation = new Tween({
      begin: 100,
      end: 200
    }).animated(new CurvedAnimation({
      parent: this.controller,
      curve: Curves.easeInOut
    }));
    
    // BoxDecoration 애니메이션 (색상 포함)
    this.decorationAnimation = new DecorationTween({
      begin: new BoxDecoration({
        color: '#3b82f6',
        shape: 'rectangle',
        borderRadius: BorderRadius.circular(16)
      }),
      end: new BoxDecoration({
        color: '#ef4444',
        shape: 'rectangle',
        borderRadius: BorderRadius.circular(16)
      })
    }).animated(new CurvedAnimation({
      parent: this.controller,
      curve: Curves.easeInOut
    }));
    
    // 회전 애니메이션
    this.rotationAnimation = new Tween({
      begin: 0,
      end: Math.PI * 2
    }).animated(this.controller);
    
    // 애니메이션 리스너 추가
    this.controller.addListener(() => {
      this.setState();
    });
  }
  
  dispose() {
    this.controller.dispose();
    super.dispose();
  }
  
  build(context: BuildContext) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector({
          onClick: () => {
            if (this.controller.isCompleted) {
              this.controller.reverse();
            } else {
              this.controller.forward();
            }
          },
          child: Transform.rotate({
            angle: this.rotationAnimation.value,
            child: Container({
              width: this.sizeAnimation.value,
              height: this.sizeAnimation.value,
              decoration: this.decorationAnimation.value,
              child: Center({
                child: Text(
                  this.controller.isCompleted ? "뒤로" : "앞으로",
                  {
                    style: new TextStyle({
                      color: '#ffffff',
                      fontSize: 18,
                      fontWeight: 'bold'
                    })
                  }
                )
              })
            })
          })
        }),
        SizedBox({ height: 20 }),
        Text(`애니메이션 상태: ${this.controller.isCompleted ? '완료' : this.controller.isDismissed ? '시작' : '진행중'}`, {
          style: new TextStyle({
            color: '#9ca3af',
            fontSize: 14
          })
        })
      ]
    });
  }
}

export default function AnimationControllerExample({ 
  title, 
  description 
}: AnimationControllerExampleProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      {/* Flitter 렌더링 영역 */}
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
          <Widget
            width="100%"
            height="300px"
            renderer="svg"
            widget={new _AnimationExample()}
          />
        </div>
      </div>
      
      {/* 코드 표시 */}
      <details className="mt-4">
        <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors">
          코드 보기
        </summary>
        <div className="mt-4 bg-gray-950 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300">
            <code>{`// 커스텀 BoxDecoration Tween
class DecorationTween extends Tween<BoxDecoration> {
  constructor({ begin, end }: { begin: BoxDecoration; end: BoxDecoration }) {
    super({ begin, end });
  }

  protected lerp(t: number): BoxDecoration {
    return BoxDecoration.lerp(this.begin, this.end, t);
  }
}

class AnimationExample extends StatefulWidget {
  createState() {
    return new AnimationExampleState();
  }
}

class AnimationExampleState extends State<AnimationExample> {
  controller!: AnimationController;
  sizeAnimation!: Animation<number>;
  decorationAnimation!: Animation<BoxDecoration>;
  rotationAnimation!: Animation<number>;
  
  initState(context: BuildContext) {
    super.initState(context);
    
    // AnimationController 생성 (duration은 밀리초 단위)
    this.controller = new AnimationController({
      duration: 2000  // 2초
    });
    
    // 크기 애니메이션
    this.sizeAnimation = new Tween({
      begin: 100,
      end: 200
    }).animated(new CurvedAnimation({
      parent: this.controller,
      curve: Curves.easeInOut
    }));
    
    // BoxDecoration 애니메이션 (색상 포함)
    this.decorationAnimation = new DecorationTween({
      begin: new BoxDecoration({
        color: '#3b82f6',
        shape: 'rectangle',
        borderRadius: BorderRadius.circular(16)
      }),
      end: new BoxDecoration({
        color: '#ef4444',
        shape: 'rectangle',
        borderRadius: BorderRadius.circular(16)
      })
    }).animated(new CurvedAnimation({
      parent: this.controller,
      curve: Curves.easeInOut
    }));
    
    // 회전 애니메이션
    this.rotationAnimation = new Tween({
      begin: 0,
      end: Math.PI * 2
    }).animated(this.controller);
    
    // 애니메이션 리스너 추가
    this.controller.addListener(() => {
      this.setState();
    });
  }
  
  dispose() {
    this.controller.dispose();
    super.dispose();
  }
  
  build(context: BuildContext) {
    return GestureDetector({
      onClick: () => {
        if (this.controller.isCompleted) {
          this.controller.reverse();
        } else {
          this.controller.forward();
        }
      },
      child: Transform.rotate({
        angle: this.rotationAnimation.value,
        child: Container({
          width: this.sizeAnimation.value,
          height: this.sizeAnimation.value,
          decoration: this.decorationAnimation.value,
          child: Center({
            child: Text(
              this.controller.isCompleted ? "뒤로" : "앞으로",
              {
                style: new TextStyle({
                  color: '#ffffff',
                  fontSize: 18,
                  fontWeight: 'bold'
                })
              }
            )
          })
        })
      })
    });
  }
}`}</code>
          </pre>
        </div>
      </details>
    </div>
  );
}