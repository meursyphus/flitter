import React, { useState } from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Container,
  Center,
  Row,
  Column,
  Stack,
  Positioned,
  MainAxisAlignment,
  CrossAxisAlignment,
  MainAxisSize,
  SizedBox,
  Expanded,
  Text,
  TextStyle,
  BoxDecoration,
  EdgeInsets,
  Alignment
} from '@meursyphus/flitter';

interface LayoutExampleProps {
  title: string;
  description: string;
}

const LayoutExample: React.FC<LayoutExampleProps> = ({ title, description }) => {
  const [selectedLayout, setSelectedLayout] = useState<'row' | 'column' | 'stack'>('row');

  const layoutExamples = {
    row: {
      title: 'Row 레이아웃',
      description: '가로 방향으로 위젯을 배치합니다',
      code: `Row({
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Container({ 
      width: 60, 
      height: 60, 
      decoration: new BoxDecoration({ color: '#3B82F6' }) 
    }),
    Container({ 
      width: 60, 
      height: 80, 
      decoration: new BoxDecoration({ color: '#10B981' }) 
    }),
    Container({ 
      width: 60, 
      height: 100, 
      decoration: new BoxDecoration({ color: '#F59E0B' }) 
    })
  ]
})`,
      widget: Row({
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container({
            width: 60,
            height: 60,
            decoration: new BoxDecoration({ color: '#3B82F6' })
          }),
          Container({
            width: 60,
            height: 80,
            decoration: new BoxDecoration({ color: '#10B981' })
          }),
          Container({
            width: 60,
            height: 100,
            decoration: new BoxDecoration({ color: '#F59E0B' })
          })
        ]
      })
    },
    column: {
      title: 'Column 레이아웃',
      description: '세로 방향으로 위젯을 배치합니다',
      code: `Column({
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Container({ 
      width: 100, 
      height: 40, 
      decoration: new BoxDecoration({ color: '#3B82F6' }) 
    }),
    Container({ 
      width: 80, 
      height: 40, 
      decoration: new BoxDecoration({ color: '#10B981' }) 
    }),
    Container({ 
      width: 60, 
      height: 40, 
      decoration: new BoxDecoration({ color: '#F59E0B' }) 
    })
  ]
})`,
      widget: Column({
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container({
            width: 100,
            height: 40,
            decoration: new BoxDecoration({ color: '#3B82F6' })
          }),
          Container({
            width: 80,
            height: 40,
            decoration: new BoxDecoration({ color: '#10B981' })
          }),
          Container({
            width: 60,
            height: 40,
            decoration: new BoxDecoration({ color: '#F59E0B' })
          })
        ]
      })
    },
    stack: {
      title: 'Stack 레이아웃',
      description: '위젯을 겹쳐서 배치합니다',
      code: `Stack({
  children: [
    Container({ 
      width: 120, 
      height: 120, 
      decoration: new BoxDecoration({ color: '#3B82F6' }) 
    }),
    Positioned({
      top: 20,
      left: 20,
      child: Container({ 
        width: 80, 
        height: 80, 
        decoration: new BoxDecoration({ color: '#10B981' }) 
      })
    }),
    Positioned({
      top: 40,
      left: 40,
      child: Container({ 
        width: 40, 
        height: 40, 
        decoration: new BoxDecoration({ color: '#F59E0B' }) 
      })
    })
  ]
})`,
      widget: Stack({
        children: [
          Container({
            width: 120,
            height: 120,
            decoration: new BoxDecoration({ color: '#3B82F6' })
          }),
          Positioned({
            top: 20,
            left: 20,
            child: Container({
              width: 80,
              height: 80,
              decoration: new BoxDecoration({ color: '#10B981' })
            })
          }),
          Positioned({
            top: 40,
            left: 40,
            child: Container({
              width: 40,
              height: 40,
              decoration: new BoxDecoration({ color: '#F59E0B' })
            })
          })
        ]
      })
    }
  };

  const currentLayout = layoutExamples[selectedLayout];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Layout Type Selector */}
      <div className="flex gap-2">
        {Object.entries(layoutExamples).map(([key, layout]) => (
          <button
            key={key}
            onClick={() => setSelectedLayout(key as typeof selectedLayout)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLayout === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {layout.title}
          </button>
        ))}
      </div>

      {/* Layout Demo */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Visual Result */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">결과</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div style={{ height: '200px' }}>
              <Widget
                width="100%"
                height="200px"
                renderer="svg"
                widget={
                  Container({
                    color: '#1F2937',
                    child: Center({
                      child: currentLayout.widget
                    })
                  })
                }
              />
            </div>
          </div>
          <p className="text-sm text-gray-400">{currentLayout.description}</p>
        </div>

        {/* Code */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">코드</h4>
          <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
            <code className="text-gray-300 text-sm font-mono">{currentLayout.code}</code>
          </pre>
        </div>
      </div>

      {/* Expanded Example */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">Expanded 위젯 활용</h4>
        <p className="text-sm text-gray-400">
          Expanded 위젯을 사용하면 남은 공간을 자동으로 채울 수 있습니다.
        </p>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '150px' }}>
            <Widget
              width="100%"
              height="150px"
              renderer="svg"
              widget={
                Container({
                  color: '#1F2937',
                  padding: EdgeInsets.all(16),
                  child: Row({
                    children: [
                      Container({
                        width: 60,
                        height: 60,
                        decoration: new BoxDecoration({
                          color: '#3B82F6'
                        }),
                        child: Center({
                          child: Text('고정', {
                            style: new TextStyle({
                              fontSize: 12,
                              color: '#FFFFFF'
                            })
                          })
                        })
                      }),
                      SizedBox({ width: 8 }),
                      Expanded({
                        child: Container({
                          height: 60,
                          decoration: new BoxDecoration({
                            color: '#10B981'
                          }),
                          child: Center({
                            child: Text('Expanded', {
                              style: new TextStyle({
                                fontSize: 12,
                                color: '#FFFFFF'
                              })
                            })
                          })
                        })
                      }),
                      SizedBox({ width: 8 }),
                      Container({
                        width: 60,
                        height: 60,
                        decoration: new BoxDecoration({
                          color: '#F59E0B'
                        }),
                        child: Center({
                          child: Text('고정', {
                            style: new TextStyle({
                              fontSize: 12,
                              color: '#FFFFFF'
                            })
                          })
                        })
                      })
                    ]
                  })
                })
              }
            />
          </div>
        </div>

        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <code className="text-gray-300 text-sm font-mono">{`Row({
  children: [
    Container({ 
      width: 60, 
      height: 60, 
      decoration: new BoxDecoration({ color: '#3B82F6' }) 
    }), // 고정 너비
    SizedBox({ width: 8 }),
    Expanded({
      child: Container({ 
        height: 60, 
        decoration: new BoxDecoration({ color: '#10B981' }) 
      }) // 남은 공간 채우기
    }),
    SizedBox({ width: 8 }),
    Container({ 
      width: 60, 
      height: 60, 
      decoration: new BoxDecoration({ color: '#F59E0B' }) 
    }) // 고정 너비
  ]
})`}</code>
        </pre>
      </div>

      {/* Alignment Properties */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-400 mb-3">📐 정렬 속성 이해하기</h5>
        <div className="space-y-3 text-sm text-gray-300">
          <div>
            <strong>MainAxisAlignment (주축 정렬):</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• start: 시작점에 정렬</li>
              <li>• end: 끝점에 정렬</li>
              <li>• center: 중앙 정렬</li>
              <li>• spaceBetween: 요소 사이 균등 배치</li>
              <li>• spaceEvenly: 전체 공간 균등 배치</li>
              <li>• spaceAround: 요소 주변 균등 배치</li>
            </ul>
          </div>
          <div>
            <strong>CrossAxisAlignment (교차축 정렬):</strong>
            <ul className="mt-1 ml-4 space-y-1">
              <li>• start: 시작점에 정렬</li>
              <li>• end: 끝점에 정렬</li>
              <li>• center: 중앙 정렬</li>
              <li>• stretch: 교차축 방향으로 늘리기</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutExample;