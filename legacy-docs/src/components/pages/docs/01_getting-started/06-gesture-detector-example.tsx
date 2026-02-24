import React from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Container,
  Center,
  Column,
  Row,
  Text,
  TextStyle,
  GestureDetector,
  BoxDecoration,
  EdgeInsets,
  SizedBox,
  MainAxisAlignment,
  CrossAxisAlignment,
  StatefulWidget,
  State,
  BuildContext,
  Alignment,
  Draggable,
  Stack,
  BorderRadius
} from '@meursyphus/flitter';

// 클릭 카운터 예제
class ClickCounter extends StatefulWidget {
  createState() {
    return new ClickCounterState();
  }
}

class ClickCounterState extends State<ClickCounter> {
  count = 0;

  build(context: BuildContext) {
    return GestureDetector({
      onClick: () => {
        console.log('Click detected! Current count:', this.count);
        this.setState(() => {
          this.count++;
          console.log('New count:', this.count);
        });
      },
      child: Container({
        width: 120,
        height: 120,
        decoration: new BoxDecoration({
          color: '#3B82F6',
          borderRadius: BorderRadius.circular(12)
        }),
        child: Center({
          child: Column({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Click!', {
                style: new TextStyle({
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                })
              }),
              SizedBox({ height: 8 }),
              Text(`${this.count}`, {
                style: new TextStyle({
                  fontSize: 24,
                  color: '#FFFFFF'
                })
              })
            ]
          })
        })
      })
    });
  }
}

// 호버 효과 예제
class HoverEffect extends StatefulWidget {
  createState() {
    return new HoverEffectState();
  }
}

class HoverEffectState extends State<HoverEffect> {
  isHovered = false;

  build(context: BuildContext) {
    return GestureDetector({
      onMouseEnter: () => {
        this.setState(() => {
          this.isHovered = true;
        });
      },
      onMouseLeave: () => {
        this.setState(() => {
          this.isHovered = false;
        });
      },
      child: Container({
        width: 150,
        height: 60,
        decoration: new BoxDecoration({
          color: this.isHovered ? '#10B981' : '#6B7280',
          borderRadius: BorderRadius.circular(8)
        }),
        child: Center({
          child: Text('Hover me', {
            style: new TextStyle({
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: this.isHovered ? 'bold' : 'normal'
            })
          })
        })
      })
    });
  }
}

// 드래그 예제 - Draggable 위젯 사용
class DraggableDemo extends StatefulWidget {
  createState() {
    return new DraggableDemoState();
  }
}

class DraggableDemoState extends State<DraggableDemo> {
  dragPosition = { x: 0, y: 0 };

  build(context: BuildContext) {
    return Container({
      width: 300,
      height: 200,
      decoration: new BoxDecoration({
        color: '#1F2937',
        borderRadius: BorderRadius.circular(8)
      }),
      child: Stack({
        children: [
          // 배경 안내 텍스트
          Center({
            child: Text('Drag the circle around!', {
              style: new TextStyle({
                fontSize: 16,
                color: '#6B7280'
              })
            })
          }),
          // 드래그 가능한 원
          Draggable({
            onDragUpdate: ({ delta }) => {
              this.setState(() => {
                this.dragPosition = {
                  x: delta.x,
                  y: delta.y
                };
              });
            },
            child: Container({
              width: 60,
              height: 60,
              decoration: new BoxDecoration({
                color: '#8B5CF6',
                borderRadius: BorderRadius.circular(30)
              }),
              child: Center({
                child: Text('Drag', {
                  style: new TextStyle({
                    fontSize: 12,
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                  })
                })
              })
            })
          }),
          // 위치 표시
          Container({
            padding: EdgeInsets.all(8),
            child: Text(`x: ${this.dragPosition.x.toFixed(0)}, y: ${this.dragPosition.y.toFixed(0)}`, {
              style: new TextStyle({
                fontSize: 12,
                color: '#9CA3AF'
              })
            })
          })
        ]
      })
    });
  }
}

// 팩토리 함수로 export
const ClickCounterWidget = () => new ClickCounter();
const HoverEffectWidget = () => new HoverEffect();
const DraggableDemoWidget = () => new DraggableDemo();

interface GestureDetectorExampleProps {
  title: string;
  description: string;
  labels: {
    clickCounter: string;
    hoverEffect: string;
    dragAndDrop: string;
    clickMe: string;
    hoverMe: string;
    dragMe: string;
    count: string;
    normal: string;
    hovered: string;
    position: string;
    gestureTypes: string;
    examples: string;
    interactions: string;
    tryItOut: string;
  };
}

const GestureDetectorExample: React.FC<GestureDetectorExampleProps> = ({ title, description, labels }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Click Example */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">{labels.clickCounter}</h4>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '150px' }}>
            <Widget
              width="100%"
              height="150px"
              renderer="svg"
              widget={
                Container({
                  color: '#1F2937',
                  child: Center({
                    child: ClickCounterWidget()
                  })
                })
              }
            />
          </div>
        </div>

        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <code className="text-gray-300 text-sm font-mono">{`GestureDetector({
  onClick: () => {
    this.setState(() => {
      this.count++;
    });
  },
  child: Container({
    // 클릭할 수 있는 영역
  })
})`}</code>
        </pre>
      </div>

      {/* Hover Example */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">{labels.hoverEffect}</h4>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '100px' }}>
            <Widget
              width="100%"
              height="100px"
              renderer="canvas"
              widget={
                Container({
                  color: '#1F2937',
                  child: Center({
                    child: Row({
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        HoverEffectWidget(),
                        HoverEffectWidget(),
                        HoverEffectWidget()
                      ]
                    })
                  })
                })
              }
            />
          </div>
        </div>

        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <code className="text-gray-300 text-sm font-mono">{`GestureDetector({
  onMouseEnter: () => {
    this.setState(() => {
      this.isHovered = true;
    });
  },
  onMouseLeave: () => {
    this.setState(() => {
      this.isHovered = false;
    });
  },
  child: Container({
    color: this.isHovered ? '#10B981' : '#6B7280'
  })
})`}</code>
        </pre>
      </div>

      {/* Drag Example */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">{labels.dragAndDrop}</h4>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '250px' }}>
            <Widget
              width="100%"
              height="250px"
              renderer="canvas"
              widget={
                Container({
                  color: '#111827',
                  child: Center({
                    child: DraggableDemoWidget()
                  })
                })
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-green-400">🎆 Draggable 위젯 사용 (추천)</h5>
          <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
            <code className="text-gray-300 text-sm font-mono">{`// 1. import에서 Draggable 가져오기
import { Draggable } from '@meursyphus/flitter';

// 2. 간단한 사용법
Draggable({
  onDragUpdate: ({ delta }) => {
    this.setState(() => {
      this.position = {
        x: delta.x,  // 전체 이동 거리
        y: delta.y
      };
    });
  },
  child: Container({
    width: 60,
    height: 60,
    decoration: new BoxDecoration({
      color: '#8B5CF6',
      borderRadius: BorderRadius.circular(30)
    })
  })
})`}</code>
          </pre>
          
          <h5 className="text-sm font-semibold text-yellow-400">🔧 Draggable의 내부 구현 (참고용)</h5>
          <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
            <code className="text-gray-300 text-sm font-mono">{`// Draggable은 내부적으로 이렇게 구현되어 있음
build(context: BuildContext): Widget {
  return Transform.translate({
    offset: this.delta,  // 자동 위치 계산
    child: GestureDetector({
      onDragStart: this.handleMouseDown,
      onDragMove: this.handleMouseMove,  
      onDragEnd: this.handleMouseUp,
      child: this.widget.feedback
    })
  });
}

// GestureDetector를 사용하여 구현`}</code>
          </pre>

          <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
            <h6 className="text-sm font-semibold text-green-400 mb-2">✨ Draggable의 장점</h6>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• <strong>Transform 자동 처리:</strong> 위치 계산과 이동을 내부에서 처리</li>
              <li>• <strong>상태 관리:</strong> origin, delta, lastDelta 등을 자동 관리</li>
              <li>• <strong>Flutter 호환:</strong> Flutter의 Draggable과 동일한 API</li>
              <li>• <strong>더 적은 코드:</strong> 복잡한 로직을 위젯이 대신 처리</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-400 mb-3">🎯 {labels.gestureTypes}</h5>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <strong>마우스 이벤트:</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• onClick: 클릭 시</li>
              <li>• onDoubleClick: 더블클릭 시</li>
              <li>• onMouseEnter: 마우스 진입 시</li>
              <li>• onMouseLeave: 마우스 벗어날 시</li>
              <li>• onMouseMove: 마우스 이동 시</li>
            </ul>
          </div>
          <div>
            <strong>터치/드래그 이벤트:</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• onPanStart: 드래그 시작</li>
              <li>• onPanUpdate: 드래그 중</li>
              <li>• onPanEnd: 드래그 종료</li>
              <li>• onLongPress: 길게 누르기</li>
              <li>• onTap: 탭 (모바일)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-blue-400 mb-2">💡 {labels.tryItOut}</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• GestureDetector는 StatefulWidget과 함께 사용하여 상태를 관리합니다</li>
          <li>• 이벤트 핸들러 안에서는 반드시 setState를 사용하여 상태를 업데이트합니다</li>
          <li>• Canvas 렌더러에서 더 나은 성능을 제공합니다</li>
          <li>• 여러 GestureDetector를 중첩할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default GestureDetectorExample;