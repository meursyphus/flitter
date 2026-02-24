import React from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Container, 
  Center, 
  Row, 
  Column,
  MainAxisAlignment,
  CrossAxisAlignment,
  SizedBox,
  Text,
  TextStyle,
  BoxDecoration,
  BorderRadius,
  Radius,
  EdgeInsets,
  Border,
  BorderSide
} from '@meursyphus/flitter';

interface BasicShapesExampleProps {
  title: string;
  description: string;
}

const BasicShapesExample: React.FC<BasicShapesExampleProps> = ({ title, description }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Basic Shapes */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">기본 도형들</h4>
        
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
                    child: Row({
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        // Rectangle
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                color: '#3B82F6'
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('사각형', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        }),
                        
                        // Rounded Rectangle
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                color: '#10B981',
                                borderRadius: BorderRadius.circular(16)
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('둥근 사각형', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        }),
                        
                        // Circle
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                color: '#F59E0B',
                                borderRadius: BorderRadius.circular(40)
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('원', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        })
                      ]
                    })
                  })
                })
              }
            />
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <pre className="text-gray-300 text-sm font-mono overflow-x-auto">
{`// 사각형
Container({
  width: 80,
  height: 80,
  decoration: new BoxDecoration({
    color: '#3B82F6'
  })
})

// 둥근 사각형
Container({
  width: 80,
  height: 80,
  decoration: new BoxDecoration({
    color: '#10B981',
    borderRadius: BorderRadius.circular(16)
  })
})

// 원
Container({
  width: 80,
  height: 80,
  decoration: new BoxDecoration({
    color: '#F59E0B',
    borderRadius: BorderRadius.circular(40)
  })
})`}
          </pre>
        </div>
      </div>

      {/* Advanced Shapes */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">고급 스타일링</h4>
        
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
                    child: Row({
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        // Border only
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                border: new Border({
                                  top: new BorderSide({ color: '#EF4444', width: 3 }),
                                  right: new BorderSide({ color: '#EF4444', width: 3 }),
                                  bottom: new BorderSide({ color: '#EF4444', width: 3 }),
                                  left: new BorderSide({ color: '#EF4444', width: 3 })
                                }),
                                borderRadius: BorderRadius.circular(8)
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('테두리', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        }),
                        
                        // Gradient (simulated with opacity)
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                color: '#8B5CF6',
                                borderRadius: BorderRadius.circular(12)
                              }),
                              child: Container({
                                margin: EdgeInsets.all(20),
                                decoration: new BoxDecoration({
                                  color: 'rgba(255, 255, 255, 0.3)',
                                  borderRadius: BorderRadius.circular(4)
                                })
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('중첩', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        }),
                        
                        // Complex shape
                        Column({
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container({
                              width: 80,
                              height: 80,
                              decoration: new BoxDecoration({
                                color: '#14B8A6',
                                border: new Border({
                                  top: new BorderSide({ color: '#0F766E', width: 2 }),
                                  right: new BorderSide({ color: '#0F766E', width: 2 }),
                                  bottom: new BorderSide({ color: '#0F766E', width: 2 }),
                                  left: new BorderSide({ color: '#0F766E', width: 2 })
                                }),
                                borderRadius: BorderRadius.only({
                                  topLeft: Radius.circular(0),
                                  topRight: Radius.circular(20),
                                  bottomRight: Radius.circular(0),
                                  bottomLeft: Radius.circular(20)
                                })
                              })
                            }),
                            SizedBox({ height: 8 }),
                            Text('복합', {
                              style: new TextStyle({
                                fontSize: 14,
                                color: '#E5E7EB'
                              })
                            })
                          ]
                        })
                      ]
                    })
                  })
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-400 mb-2">💡 팁</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Container의 decoration 속성으로 다양한 도형을 만들 수 있습니다</li>
          <li>• borderRadius로 모서리를 둥글게 만들 수 있습니다</li>
          <li>• Border로 테두리를 추가할 수 있습니다</li>
          <li>• 색상은 HEX('#3B82F6') 또는 RGBA('rgba(0,0,0,0.5)') 형식을 사용합니다</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicShapesExample;