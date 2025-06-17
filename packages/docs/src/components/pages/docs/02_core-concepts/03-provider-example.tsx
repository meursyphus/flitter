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
  MainAxisAlignment,
  StatelessWidget,
  StatefulWidget,
  State,
  BoxDecoration,
  BorderRadius,
  Border,
  BorderSide,
  Provider,
  type BuildContext,
  type Widget as FlitterWidget,
  CrossAxisAlignment,
  MainAxisSize
} from '@meursyphus/flitter';

interface ProviderExampleProps {
  title: string;
  description: string;
}

// Provider Key
const COUNTER_KEY = Symbol('CounterProvider');

// 상태 타입 정의
interface CounterData {
  count: number;
}

// Provider 함수
function CounterProvider({ child, initialValue = 0 }: { child: FlitterWidget; initialValue?: number }) {
  return Provider({
    value: { count: initialValue },
    providerKey: COUNTER_KEY,
    child
  });
}

// of 메서드 추가
CounterProvider.of = (context: BuildContext): CounterData => {
  return Provider.of(COUNTER_KEY, context) as CounterData;
};

// 메인 앱 - StatefulWidget으로 상태 관리
class _CounterApp extends StatefulWidget {
  createState() {
    return new CounterAppState();
  }
}

class CounterAppState extends State<_CounterApp> {
  count = 0;
  
  increment() {
    this.setState(() => {
      this.count++;
    });
  }
  
  decrement() {
    this.setState(() => {
      this.count--;
    });
  }
  
  reset() {
    this.setState(() => {
      this.count = 0;
    });
  }
  
  build(context: BuildContext): FlitterWidget {
    return Provider({
      value: { count: this.count },
      providerKey: COUNTER_KEY,
      child: Center({
        child: Container({
          padding: EdgeInsets.all(24),
          child: Column({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row({
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  new _CounterDisplay(),
                  SizedBox({ width: 40 }),
                  new _ProviderOfExample()
                ]
              }),
              SizedBox({ height: 40 }),
              new _CounterControls({
                onIncrement: () => this.increment(),
                onDecrement: () => this.decrement(),
                onReset: () => this.reset()
              })
            ]
          })
        })
      })
    });
  }
}

// 카운터 디스플레이 위젯 - Provider.of 사용
class _CounterDisplay extends StatelessWidget {
  build(context: BuildContext): FlitterWidget {
    const data = Provider.of(COUNTER_KEY, context) as CounterData;
    
    return Container({
      padding: EdgeInsets.all(20),
      decoration: new BoxDecoration({
        color: 'rgba(59, 130, 246, 0.1)',
        borderRadius: BorderRadius.circular(12),
        border: new Border({
          top: new BorderSide({ color: 'rgba(59, 130, 246, 0.3)', width: 1 }),
          right: new BorderSide({ color: 'rgba(59, 130, 246, 0.3)', width: 1 }),
          bottom: new BorderSide({ color: 'rgba(59, 130, 246, 0.3)', width: 1 }),
          left: new BorderSide({ color: 'rgba(59, 130, 246, 0.3)', width: 1 })
        })
      }),
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text("현재 카운트", {
            style: new TextStyle({ 
              fontSize: 16, 
              color: 'rgba(255, 255, 255, 0.7)'
            })
          }),
          SizedBox({ height: 8 }),
          Text(`${data.count}`, {
            style: new TextStyle({ 
              fontSize: 48, 
              fontWeight: 'bold',
              color: '#3b82f6'
            })
          })
        ]
      })
    });
  }
}

// 카운터 컨트롤 위젯
interface CounterControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  onReset: () => void;
}

class _CounterControls extends StatelessWidget {
  constructor(private props: CounterControlsProps) {
    super();
  }
  
  build(context: BuildContext): FlitterWidget {
    return Row({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        GestureDetector({
          onClick: () => this.props.onDecrement(),
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
            decoration: new BoxDecoration({
              color: '#ef4444',
              borderRadius: BorderRadius.circular(8)
            }),
            child: Text("- 1", {
              style: new TextStyle({ 
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 'bold'
              })
            })
          })
        }),
        SizedBox({ width: 20 }),
        GestureDetector({
          onClick: () => this.props.onReset(),
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
            decoration: new BoxDecoration({
              color: '#6b7280',
              borderRadius: BorderRadius.circular(8)
            }),
            child: Text("리셋", {
              style: new TextStyle({ 
                color: '#ffffff',
                fontSize: 18
              })
            })
          })
        }),
        SizedBox({ width: 20 }),
        GestureDetector({
          onClick: () => this.props.onIncrement(),
          child: Container({
            padding: EdgeInsets.symmetric({ horizontal: 20, vertical: 10 }),
            decoration: new BoxDecoration({
              color: '#10b981',
              borderRadius: BorderRadius.circular(8)
            }),
            child: Text("+ 1", {
              style: new TextStyle({ 
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 'bold'
              })
            })
          })
        })
      ]
    });
  }
}

// Provider.of 예제 위젯
class _ProviderOfExample extends StatelessWidget {
  build(context: BuildContext): FlitterWidget {
    return Container({
      padding: EdgeInsets.all(16),
      decoration: new BoxDecoration({
        color: 'rgba(255, 255, 255, 0.05)',
        borderRadius: BorderRadius.circular(8),
        border: new Border({
          top: new BorderSide({ color: 'rgba(255, 255, 255, 0.1)', width: 1 }),
          right: new BorderSide({ color: 'rgba(255, 255, 255, 0.1)', width: 1 }),
          bottom: new BorderSide({ color: 'rgba(255, 255, 255, 0.1)', width: 1 }),
          left: new BorderSide({ color: 'rgba(255, 255, 255, 0.1)', width: 1 })
        })
      }),
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text("Provider.of 사용 예제", {
            style: new TextStyle({ 
              fontSize: 14, 
              color: 'rgba(255, 255, 255, 0.6)'
            })
          }),
          SizedBox({ height: 8 }),
          new _ProviderValueText()
        ]
      })
    });
  }
}

// Provider 값을 표시하는 별도 위젯
class _ProviderValueText extends StatelessWidget {
  build(context: BuildContext): FlitterWidget {
    const data = CounterProvider.of(context);
    return Text(`카운트 값: ${data.count}`, {
      style: new TextStyle({ 
        fontSize: 20, 
        color: '#ffffff'
      })
    });
  }
}

// Factory functions
function CounterApp(props: any): FlitterWidget {
  return new _CounterApp();
}

export default function ProviderExample({ 
  title, 
  description 
}: ProviderExampleProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      
      <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
        <div className="flex justify-center p-8">
          <Widget
            width="100%"
            height="400px"
            renderer="canvas"
            widget={CounterApp({})}
          />
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="bg-gray-950 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">1. Provider Key 정의</h4>
          <pre className="overflow-x-auto">
            <code className="text-sm text-gray-300">{`const COUNTER_KEY = Symbol('CounterProvider');`}</code>
          </pre>
        </div>
        
        <div className="bg-gray-950 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">2. Provider로 값 제공하기</h4>
          <pre className="overflow-x-auto">
            <code className="text-sm text-gray-300">{`Provider({
  value: { count: this.count },
  providerKey: COUNTER_KEY,
  child: MyApp({})
})`}</code>
          </pre>
        </div>
        
        <div className="bg-gray-950 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">3. Provider.of로 값 가져오기</h4>
          <pre className="overflow-x-auto">
            <code className="text-sm text-gray-300">{`// 직접 사용
const data = Provider.of(COUNTER_KEY, context) as CounterData;

// Provider 함수의 of 메서드 사용 (편의성)
const data = CounterProvider.of(context);`}</code>
          </pre>
        </div>
        
        <div className="bg-gray-950 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Provider 함수 패턴</h4>
          <pre className="overflow-x-auto">
            <code className="text-sm text-gray-300">{`function CounterProvider({ child }: { child: Widget }) {
  return Provider({
    value: { count: 0 },
    providerKey: COUNTER_KEY,
    child
  });
}

CounterProvider.of = (context: BuildContext) => {
  return Provider.of(COUNTER_KEY, context) as CounterData;
};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}