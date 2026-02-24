import Widget from '@meursyphus/flitter-react';
import { 
  Container, 
  Column, 
  Row, 
  Text, 
  Center,
  SizedBox,
  EdgeInsets,
  MainAxisAlignment,
  CrossAxisAlignment,
  BorderRadius,
  BoxDecoration,
  Border,
  BorderSide,
  TextStyle,
  Padding,
  GestureDetector,
  StatefulWidget,
  State,
  type BuildContext
} from '@meursyphus/flitter';

interface SimpleColumnImplementationProps {
  title: string;
  description: string;
}

// 실제 SimpleColumn 구현을 시뮬레이션
class _SimpleColumnDemo extends StatefulWidget {
  createState() {
    return new _SimpleColumnDemoState();
  }
}

class _SimpleColumnDemoState extends State<_SimpleColumnDemo> {
  spacing = 10;
  
  increaseSpacing() {
    this.setState(() => {
      this.spacing = Math.min(30, this.spacing + 5);
    });
  }
  
  decreaseSpacing() {
    this.setState(() => {
      this.spacing = Math.max(0, this.spacing - 5);
    });
  }
  
  build(context: BuildContext) {
    return Center({
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Title
          Text('SimpleColumn 동작 시연', {
            style: new TextStyle({
              color: '#F3F4F6',
              fontSize: 16,
              fontWeight: 'bold'
            })
          }),
          
          SizedBox({ height: 20 }),
          
          // SimpleColumn simulation
          Container({
            padding: EdgeInsets.all(20),
            decoration: new BoxDecoration({
              border: new Border({
                top: new BorderSide({ width: 2, color: '#4B5563' }),
                right: new BorderSide({ width: 2, color: '#4B5563' }),
                bottom: new BorderSide({ width: 2, color: '#4B5563' }),
                left: new BorderSide({ width: 2, color: '#4B5563' })
              }),
              borderRadius: BorderRadius.circular(8)
            }),
            child: Column({
              children: [
                Container({
                  width: 120,
                  height: 40,
                  decoration: new BoxDecoration({
                    color: '#3B82F6',
                    borderRadius: BorderRadius.circular(4)
                  }),
                  child: Center({
                    child: Text('Child 1', {
                      style: new TextStyle({
                        color: '#FFFFFF',
                        fontSize: 14
                      })
                    })
                  })
                }),
                SizedBox({ height: this.spacing }),
                Container({
                  width: 150,
                  height: 50,
                  decoration: new BoxDecoration({
                    color: '#10B981',
                    borderRadius: BorderRadius.circular(4)
                  }),
                  child: Center({
                    child: Text('Child 2', {
                      style: new TextStyle({
                        color: '#FFFFFF',
                        fontSize: 14
                      })
                    })
                  })
                }),
                SizedBox({ height: this.spacing }),
                Container({
                  width: 100,
                  height: 35,
                  decoration: new BoxDecoration({
                    color: '#F59E0B',
                    borderRadius: BorderRadius.circular(4)
                  }),
                  child: Center({
                    child: Text('Child 3', {
                      style: new TextStyle({
                        color: '#FFFFFF',
                        fontSize: 14
                      })
                    })
                  })
                })
              ]
            })
          }),
          
          SizedBox({ height: 20 }),
          
          // Spacing controls
          Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              GestureDetector({
                onClick: () => this.decreaseSpacing(),
                child: Container({
                  padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
                  decoration: new BoxDecoration({
                    color: '#374151',
                    borderRadius: BorderRadius.circular(6)
                  }),
                  child: Text('- Spacing', {
                    style: new TextStyle({
                      color: '#FFFFFF',
                      fontSize: 13
                    })
                  })
                })
              }),
              SizedBox({ width: 16 }),
              Text(`Spacing: ${this.spacing}px`, {
                style: new TextStyle({
                  color: '#D1D5DB',
                  fontSize: 14
                })
              }),
              SizedBox({ width: 16 }),
              GestureDetector({
                onClick: () => this.increaseSpacing(),
                child: Container({
                  padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
                  decoration: new BoxDecoration({
                    color: '#374151',
                    borderRadius: BorderRadius.circular(6)
                  }),
                  child: Text('+ Spacing', {
                    style: new TextStyle({
                      color: '#FFFFFF',
                      fontSize: 13
                    })
                  })
                })
              })
            ]
          }),
          
          SizedBox({ height: 20 }),
          
          // Layout info
          Container({
            padding: EdgeInsets.all(12),
            decoration: new BoxDecoration({
              color: '#1F2937',
              borderRadius: BorderRadius.circular(8)
            }),
            child: Column({
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('레이아웃 계산 과정:', {
                  style: new TextStyle({
                    color: '#60A5FA',
                    fontSize: 13,
                    fontWeight: 'bold'
                  })
                }),
                SizedBox({ height: 8 }),
                Text('1. 각 자식에게 loose constraints 전달', {
                  style: new TextStyle({
                    color: '#D1D5DB',
                    fontSize: 12
                  })
                }),
                Text('2. 자식들의 크기 측정', {
                  style: new TextStyle({
                    color: '#D1D5DB',
                    fontSize: 12
                  })
                }),
                Text('3. Y 위치 계산 (이전 자식 높이 + spacing)', {
                  style: new TextStyle({
                    color: '#D1D5DB',
                    fontSize: 12
                  })
                }),
                Text('4. 전체 높이 = 모든 자식 높이 + spacing', {
                  style: new TextStyle({
                    color: '#D1D5DB',
                    fontSize: 12
                  })
                })
              ]
            })
          })
        ]
      })
    });
  }
}

export default function SimpleColumnImplementation({ 
  title, 
  description 
}: SimpleColumnImplementationProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <Widget
            width="100%"
            height="500px"
            renderer="svg"
            widget={new _SimpleColumnDemo()}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-green-400 font-semibold mb-2">SimpleColumn 구현 코드</h4>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`class SimpleColumn extends MultiChildRenderObjectWidget {
  createRenderObject() {
    return new RenderSimpleColumn();
  }
}

class RenderSimpleColumn extends RenderBox {
  performLayout() {
    let yOffset = 0;
    let maxWidth = 0;
    
    // 1. 각 자식 레이아웃
    for (const child of this.children) {
      // 자식에게 loose constraints 전달
      child.layout(constraints.loosen());
      
      // 자식 위치 설정
      child.offset = Offset(0, yOffset);
      
      // 다음 자식을 위한 Y 위치 업데이트
      yOffset += child.size.height + spacing;
      
      // 최대 너비 추적
      maxWidth = Math.max(maxWidth, child.size.width);
    }
    
    // 2. 자신의 크기 결정
    const totalHeight = yOffset - spacing; // 마지막 spacing 제거
    size = constraints.constrain(Size(maxWidth, totalHeight));
  }
}`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">실제 Column과의 차이</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// 실제 Column은 더 많은 기능 제공:

// 1. MainAxisAlignment
mainAxisAlignment: MainAxisAlignment.spaceEvenly

// 2. CrossAxisAlignment  
crossAxisAlignment: CrossAxisAlignment.stretch

// 3. Flex 자식 처리
Expanded({ flex: 2, child: ... })
Flexible({ flex: 1, child: ... })

// 4. 오버플로우 감지 및 처리
// 5. RTL (Right-to-Left) 지원
// 6. 성능 최적화 (레이아웃 캐싱 등)`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}