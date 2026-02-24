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
  Expanded,
  Flexible,
  StatefulWidget,
  State,
  type BuildContext
} from '@meursyphus/flitter';

interface ConstraintsRealWorldExampleProps {
  title: string;
  description: string;
}

class _ConstraintsRealWorldExample extends StatefulWidget {
  createState() {
    return new _ConstraintsRealWorldExampleState();
  }
}

class _ConstraintsRealWorldExampleState extends State<_ConstraintsRealWorldExample> {
  example = 'container-no-size';
  
  selectExample(ex: string) {
    this.setState(() => {
      this.example = ex;
    });
  }
  
  getExampleWidget() {
    switch (this.example) {
      case 'container-no-size':
        return Container({
          color: '#3B82F6',
          child: Text('Container without size\nFits child', {
            style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
          })
        });
        
      case 'container-with-size':
        return Container({
          width: 150,
          height: 80,
          color: '#10B981',
          child: Center({
            child: Text('Container\n150x80', {
              style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
            })
          })
        });
        
      case 'container-no-child':
        return Container({
          color: '#F59E0B',
          child: Center({
            child: Text('Expands to max', {
              style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
            })
          })
        });
        
      case 'sizedbox-force':
        return Column({
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox({
              width: 100,
              height: 50,
              child: Container({
                width: 200,  // 무시됨!
                height: 100, // 무시됨!
                color: '#DC2626',
                child: Center({
                  child: Text('Forced 100x50', {
                    style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
                  })
                })
              })
            }),
            SizedBox({ height: 10 }),
            Text('Child wants 200x100\nParent forces 100x50', {
              style: new TextStyle({ color: '#9CA3AF', fontSize: 11 })
            })
          ]
        });
        
      case 'column-infinite':
        return Container({
          height: 200,
          child: Column({
            children: [
              Container({
                height: 50,
                color: '#3B82F6',
                child: Center({
                  child: Text('Fixed height', {
                    style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
                  })
                })
              }),
              Expanded({
                child: Container({
                  color: '#10B981',
                  child: Center({
                    child: Text('Expanded\n(takes remaining)', {
                      style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
                    })
                  })
                })
              }),
              Container({
                height: 30,
                color: '#F59E0B',
                child: Center({
                  child: Text('Fixed', {
                    style: new TextStyle({ color: '#FFFFFF', fontSize: 12 })
                  })
                })
              })
            ]
          })
        });
        
      default:
        return Container({});
    }
  }
  
  getExampleDescription() {
    switch (this.example) {
      case 'container-no-size':
        return 'Container without width/height:\n자식 크기에 맞춤';
      case 'container-with-size':
        return 'Container with width/height:\n지정된 크기 사용 (제약 내에서)';
      case 'container-no-child':
        return 'Container without child:\n가능한 최대 크기로 확장';
      case 'sizedbox-force':
        return 'SizedBox는 크기를 강제:\n자식의 크기 요청 무시';
      case 'column-infinite':
        return 'Column 내부의 무한 높이 문제:\nExpanded로 해결';
      default:
        return '';
    }
  }
  
  build(context: BuildContext) {
    return Column({
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Example selector
        Container({
          margin: EdgeInsets.only({ bottom: 20 }),
          child: Column({
            children: [
              Row({
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  this.createButton('container-no-size', 'Container 1'),
                  SizedBox({ width: 8 }),
                  this.createButton('container-with-size', 'Container 2'),
                  SizedBox({ width: 8 }),
                  this.createButton('container-no-child', 'Container 3')
                ]
              }),
              SizedBox({ height: 8 }),
              Row({
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  this.createButton('sizedbox-force', 'SizedBox'),
                  SizedBox({ width: 8 }),
                  this.createButton('column-infinite', 'Column Issue')
                ]
              })
            ]
          })
        }),
        
        // Example widget
        Container({
          width: 300,
          height: 250,
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
            child: this.getExampleWidget()
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
          child: Text(this.getExampleDescription(), {
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
    const isSelected = this.example === value;
    return Container({
      padding: EdgeInsets.symmetric({ horizontal: 12, vertical: 6 }),
      decoration: new BoxDecoration({
        color: isSelected ? '#3B82F6' : '#374151',
        borderRadius: BorderRadius.circular(6)
      }),
      child: Text(label, {
        style: new TextStyle({
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: isSelected ? 'bold' : 'normal'
        })
      })
    });
  }
}

export default function ConstraintsRealWorldExample({ 
  title, 
  description 
}: ConstraintsRealWorldExampleProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <Widget
            width="100%"
            height="450px"
            renderer="svg"
            widget={new _ConstraintsRealWorldExample()}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-yellow-400 font-semibold mb-2">💡 레이아웃 디버깅 팁</h4>
            <pre className="text-sm text-gray-300">
              <code>{`// 제약 확인하기
class MyWidget extends RenderObjectWidget {
  performLayout() {
    print('Constraints: \${constraints}');
    // minWidth: 0, maxWidth: 300
    // minHeight: 0, maxHeight: 600
  }
}

// 문제 해결 체크리스트:
// 1. 부모가 주는 제약은 무엇인가?
// 2. 자식이 원하는 크기는 무엇인가?
// 3. 제약과 크기가 충돌하는가?`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}