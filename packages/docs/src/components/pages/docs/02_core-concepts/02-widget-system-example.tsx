import React from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Center, 
  Container, 
  Text, 
  Column, 
  Row,
  GestureDetector,
  EdgeInsets,
  TextStyle,
  SizedBox,
  StatelessWidget,
  StatefulWidget,
  State,
  BoxDecoration,
  BorderRadius,
  CrossAxisAlignment,
  Border,
  BorderSide,
  type BuildContext,
  type Widget as FlitterWidget
} from '@meursyphus/flitter';

interface WidgetSystemExampleProps {
  title: string;
  description: string;
  labels?: {
    statelessTitle?: string;
    statefulTitle?: string;
    greeting?: string;
    greetingMessage?: string;
    interactiveCard?: string;
    clickCount?: string;
    mouseHover?: string;
    mouseHoverPrompt?: string;
    keyDifferences?: string;
    statelessFeatures?: string[];
    statefulFeatures?: string[];
  };
}

// 글로벌 설정 객체 (React 컴포넌트 외부)
let globalLabels = {
  greeting: '안녕하세요',
  interactiveCard: '인터랙티브 카드',
  clickCount: '클릭 횟수',
  mouseHover: '마우스가 위에 있습니다!',
  mouseHoverPrompt: '마우스를 올려보세요'
};

// StatelessWidget 예제
class GreetingCard extends StatelessWidget {
  constructor(private props: { name: string; message: string }) {
    super();
  }

  build(context: BuildContext): FlitterWidget {
    return Container({
      padding: EdgeInsets.all(20),
      decoration: new BoxDecoration({
        color: '#1E3A8A',
        borderRadius: BorderRadius.circular(8)
      }),
      child: Column({
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(`${globalLabels.greeting}, ${this.props.name}님!`, {
            style: new TextStyle({ 
              fontSize: 20, 
              fontWeight: 'bold',
              color: '#FFFFFF' 
            })
          }),
          SizedBox({ height: 8 }),
          Text(this.props.message, {
            style: new TextStyle({ 
              fontSize: 16,
              color: '#DBEAFE'
            })
          })
        ]
      })
    });
  }
}

// StatefulWidget 예제
class InteractiveCard extends StatefulWidget {
  createState(): State<InteractiveCard> {
    return new InteractiveCardState();
  }
}

class InteractiveCardState extends State<InteractiveCard> {
  clickCount = 0;
  isHovered = false;

  build(context: BuildContext): FlitterWidget {
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
      onClick: () => {
        this.setState(() => {
          this.clickCount++;
        });
      },
      child: Container({
        padding: EdgeInsets.all(20),
        decoration: new BoxDecoration({
          color: this.isHovered ? '#581C87' : '#6B21A8',
          borderRadius: BorderRadius.circular(8),
          border: new Border({
            top: new BorderSide({ color: this.isHovered ? '#9333EA' : '#7C3AED', width: 2 }),
            right: new BorderSide({ color: this.isHovered ? '#9333EA' : '#7C3AED', width: 2 }),
            bottom: new BorderSide({ color: this.isHovered ? '#9333EA' : '#7C3AED', width: 2 }),
            left: new BorderSide({ color: this.isHovered ? '#9333EA' : '#7C3AED', width: 2 })
          })
        }),
        child: Column({
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(globalLabels.interactiveCard, {
              style: new TextStyle({ 
                fontSize: 20, 
                fontWeight: 'bold',
                color: '#FFFFFF' 
              })
            }),
            SizedBox({ height: 8 }),
            Text(`${globalLabels.clickCount}: ${this.clickCount}`, {
              style: new TextStyle({ 
                fontSize: 16,
                color: '#F3E8FF'
              })
            }),
            SizedBox({ height: 4 }),
            Text(this.isHovered ? globalLabels.mouseHover : globalLabels.mouseHoverPrompt, {
              style: new TextStyle({ 
                fontSize: 14,
                color: '#E9D5FF'
              })
            })
          ]
        })
      })
    });
  }
}

// Factory functions
function GreetingCardWidget(props: { name: string; message: string }): FlitterWidget {
  return new GreetingCard(props);
}

function InteractiveCardWidget(): FlitterWidget {
  return new InteractiveCard();
}

export default function WidgetSystemExample({ 
  title, 
  description,
  labels = {} 
}: WidgetSystemExampleProps) {
  // 기본값 설정
  const defaultLabels = {
    statelessTitle: labels.statelessTitle || 'StatelessWidget',
    statefulTitle: labels.statefulTitle || 'StatefulWidget',
    greeting: labels.greeting || '안녕하세요',
    greetingMessage: labels.greetingMessage || 'StatelessWidget은 상태가 없고 props만 받습니다.',
    interactiveCard: labels.interactiveCard || '인터랙티브 카드',
    clickCount: labels.clickCount || '클릭 횟수',
    mouseHover: labels.mouseHover || '마우스가 위에 있습니다!',
    mouseHoverPrompt: labels.mouseHoverPrompt || '마우스를 올려보세요',
    keyDifferences: labels.keyDifferences || '핵심 차이점',
    statelessFeatures: labels.statelessFeatures || [
      '상태가 없음 (정적)',
      'props만 받아서 UI 구성',
      '성능이 더 좋음',
      '단순한 UI 컴포넌트에 적합'
    ],
    statefulFeatures: labels.statefulFeatures || [
      '내부 상태 관리 가능',
      'setState()로 UI 업데이트',
      '라이프사이클 메서드 제공',
      '인터랙티브한 컴포넌트에 적합'
    ]
  };
  
  // 글로벌 레이블 업데이트
  globalLabels.greeting = defaultLabels.greeting;
  globalLabels.interactiveCard = defaultLabels.interactiveCard;
  globalLabels.clickCount = defaultLabels.clickCount;
  globalLabels.mouseHover = defaultLabels.mouseHover;
  globalLabels.mouseHoverPrompt = defaultLabels.mouseHoverPrompt;
  
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* StatelessWidget 예제 */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">{defaultLabels.statelessTitle}</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-center">
              <Widget
                width="100%"
                height="150px"
                renderer="svg"
                widget={
                  Center({
                    child: GreetingCardWidget({
                      name: "개발자",
                      message: defaultLabels.greetingMessage
                    })
                  })
                }
              />
            </div>
          </div>
          <pre className="mt-4 bg-gray-950 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300">{`class GreetingCard extends StatelessWidget {
  constructor(private props: { name: string; message: string }) {
    super();
  }

  build(context: BuildContext): Widget {
    return Container({
      padding: EdgeInsets.all(20),
      child: Column({
        children: [
          Text(\`안녕하세요, \${this.props.name}님!\`),
          Text(this.props.message)
        ]
      })
    });
  }
}`}</code>
          </pre>
        </div>

        {/* StatefulWidget 예제 */}
        <div>
          <h4 className="text-lg font-medium mb-4 text-white">{defaultLabels.statefulTitle}</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-center">
              <Widget
                width="100%"
                height="150px"
                renderer="svg"
                widget={
                  Center({
                    child: InteractiveCardWidget()
                  })
                }
              />
            </div>
          </div>
          <pre className="mt-4 bg-gray-950 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-gray-300">{`class InteractiveCard extends StatefulWidget {
  createState(): State<InteractiveCard> {
    return new InteractiveCardState();
  }
}

class InteractiveCardState extends State<InteractiveCard> {
  clickCount = 0;
  
  build(context: BuildContext): Widget {
    return GestureDetector({
      onClick: () => {
        this.setState(() => {
          this.clickCount++;
        });
      },
      child: Text(\`클릭 횟수: \${this.clickCount}\`)
    });
  }
}`}</code>
          </pre>
        </div>
      </div>

      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/50 rounded-lg">
        <h4 className="text-lg font-medium mb-3 text-blue-200">💡 {defaultLabels.keyDifferences}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">{defaultLabels.statelessTitle}</h5>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {defaultLabels.statelessFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-300 mb-2">{defaultLabels.statefulTitle}</h5>
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              {defaultLabels.statefulFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}