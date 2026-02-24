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
  Constraints,
  Size,
  UnconstrainedBox,
  ConstrainedBox,
  StatefulWidget,
  State,
  type BuildContext
} from '@meursyphus/flitter';

interface ConstraintsPatternsExampleProps {
  title: string;
  description: string;
}

class _ConstraintsPatternsExample extends StatefulWidget {
  createState() {
    return new _ConstraintsPatternsExampleState();
  }
}

class _ConstraintsPatternsExampleState extends State<_ConstraintsPatternsExample> {
  selectedPattern = 'tight';
  
  selectPattern(pattern: string) {
    this.setState(() => {
      this.selectedPattern = pattern;
    });
  }
  
  getPatternWidget() {
    const childWidget = Container({
      decoration: new BoxDecoration({
        color: '#10B981',
        borderRadius: BorderRadius.circular(4)
      }),
      child: Center({
        child: Text('Child', {
          style: new TextStyle({
            color: '#FFFFFF',
            fontSize: 14
          })
        })
      })
    });
    
    switch (this.selectedPattern) {
      case 'tight':
        return ConstrainedBox({
          constraints: Constraints.tight(new Size({ width: 150, height: 100 })),
          child: childWidget
        });
      case 'loose':
        return ConstrainedBox({
          constraints: Constraints.loose(new Size({ width: 150, height: 100 })),
          child: childWidget
        });
      case 'expand':
        return ConstrainedBox({
          constraints: new Constraints({
            minWidth: 200,
            maxWidth: 200,
            minHeight: 120,
            maxHeight: 120
          }),
          child: ConstrainedBox({
            constraints: Constraints.expand(),
            child: childWidget
          })
        });
      case 'unconstrained':
        return SizedBox({
          width: 150,
          height: 100,
          child: UnconstrainedBox({
            child: Container({
              width: 200,
              height: 120,
              decoration: new BoxDecoration({
                color: '#10B981',
                borderRadius: BorderRadius.circular(4)
              }),
              child: Center({
                child: Text('Overflow!', {
                  style: new TextStyle({
                    color: '#FFFFFF',
                    fontSize: 14
                  })
                })
              })
            })
          })
        });
      default:
        return childWidget;
    }
  }
  
  getPatternDescription() {
    switch (this.selectedPattern) {
      case 'tight':
        return 'minWidth = maxWidth = 150\nminHeight = maxHeight = 100\n자식은 정확히 150x100 크기여야 함';
      case 'loose':
        return 'minWidth = minHeight = 0\nmaxWidth = 150, maxHeight = 100\n자식은 0x0 ~ 150x100 사이 선택';
      case 'expand':
        return 'minWidth = maxWidth = infinity\nminHeight = maxHeight = infinity\n자식은 가능한 최대 크기로 확장';
      case 'unconstrained':
        return '부모: 150x100 제약\n자식: 제약 무시하고 200x120\n결과: 오버플로우 발생!';
      default:
        return '';
    }
  }
  
  build(context: BuildContext) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Pattern selector buttons
        Container({
          margin: EdgeInsets.only({ bottom: 20 }),
          child: Row({
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              this.createButton('tight', 'Tight'),
              SizedBox({ width: 10 }),
              this.createButton('loose', 'Loose'),
              SizedBox({ width: 10 }),
              this.createButton('expand', 'Expand'),
              SizedBox({ width: 10 }),
              this.createButton('unconstrained', 'Unconstrained')
            ]
          })
        }),
        
        // Visual representation
        Container({
          width: 250,
          height: 150,
          decoration: new BoxDecoration({
            border: new Border({
              top: new BorderSide({ width: 2, color: '#4B5563' }),
              right: new BorderSide({ width: 2, color: '#4B5563' }),
              bottom: new BorderSide({ width: 2, color: '#4B5563' }),
              left: new BorderSide({ width: 2, color: '#4B5563' })
            }),
            borderRadius: BorderRadius.circular(8)
          }),
          child: Center({
            child: this.getPatternWidget()
          })
        }),
        
        // Description
        Container({
          margin: EdgeInsets.only({ top: 20 }),
          padding: EdgeInsets.all(12),
          decoration: new BoxDecoration({
            color: '#1F2937',
            borderRadius: BorderRadius.circular(8)
          }),
          child: Text(this.getPatternDescription(), {
            style: new TextStyle({
              color: '#D1D5DB',
              fontSize: 13
            })
          })
        })
      ]
    });
  }
  
  createButton(value: string, label: string) {
    const isSelected = this.selectedPattern === value;
    return Container({
      padding: EdgeInsets.symmetric({ horizontal: 16, vertical: 8 }),
      decoration: new BoxDecoration({
        color: isSelected ? '#3B82F6' : '#374151',
        borderRadius: BorderRadius.circular(6)
      }),
      child: Text(label, {
        style: new TextStyle({
          color: '#FFFFFF',
          fontSize: 13,
          fontWeight: isSelected ? 'bold' : 'normal'
        })
      })
    });
  }
}

export default function ConstraintsPatternsExample({ 
  title, 
  description 
}: ConstraintsPatternsExampleProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <Widget
            width="100%"
            height="400px"
            renderer="svg"
            widget={new _ConstraintsPatternsExample()}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">Constraints 생성 방법</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// Tight - 정확한 크기
Constraints.tight(Size(100, 50))

// Loose - 최대 크기만
Constraints.loose(Size(100, 50))

// Expand - 최대로 확장
Constraints.expand()

// Custom - 직접 지정
new Constraints({
  minWidth: 50,
  maxWidth: 150,
  minHeight: 30,
  maxHeight: 100
})`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-green-400 font-semibold mb-2">위젯에서 사용하기</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// ConstrainedBox
ConstrainedBox({
  constraints: Constraints.tight(
    Size(100, 100)
  ),
  child: Container({...})
})

// UnconstrainedBox
UnconstrainedBox({
  child: Container({
    width: 1000, // 제약 무시!
    height: 1000
  })
})`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}