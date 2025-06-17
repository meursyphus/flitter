import React, { useState } from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Container,
  Center,
  Column,
  Row,
  Text,
  TextStyle,
  TextAlign,
  TextOverflow,
  BoxDecoration,
  EdgeInsets,
  SizedBox,
  MainAxisAlignment,
  CrossAxisAlignment,
  BorderRadius
} from '@meursyphus/flitter';

interface TextExampleProps {
  title: string;
  description: string;
}

const TextExample: React.FC<TextExampleProps> = ({ title, description }) => {
  const [showOverflow, setShowOverflow] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Text Styling */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">텍스트 스타일링</h4>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '200px' }}>
            <Widget
              width="100%"
              height="200px"
              renderer="svg"
              widget={
                Container({
                  color: '#1F2937',
                  padding: EdgeInsets.all(20),
                  child: Column({
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('기본 텍스트', {
                        style: new TextStyle({
                          fontSize: 16,
                          color: '#E5E7EB'
                        })
                      }),
                      Text('굵은 텍스트', {
                        style: new TextStyle({
                          fontSize: 18,
                          fontWeight: 'bold',
                          color: '#3B82F6'
                        })
                      }),
                      Text('이탤릭 텍스트', {
                        style: new TextStyle({
                          fontSize: 16,
                          fontStyle: 'italic',
                          color: '#10B981'
                        })
                      }),
                      Text('큰 텍스트', {
                        style: new TextStyle({
                          fontSize: 24,
                          color: '#F59E0B'
                        })
                      }),
                      Text('커스텀 폰트', {
                        style: new TextStyle({
                          fontSize: 16,
                          fontFamily: 'monospace',
                          letterSpacing: 2,
                          color: '#8B5CF6'
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
          <code className="text-gray-300 text-sm font-mono">{`Text('스타일이 적용된 텍스트', {
  style: new TextStyle({
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'monospace',
    letterSpacing: 2,
    color: '#3B82F6'
  })
})`}</code>
        </pre>
      </div>

      {/* Text Alignment */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">텍스트 정렬</h4>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '200px' }}>
            <Widget
              width="100%"
              height="200px"
              renderer="svg"
              widget={
                Container({
                  color: '#1F2937',
                  padding: EdgeInsets.all(20),
                  child: Column({
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container({
                        width: 300,
                        padding: EdgeInsets.all(8),
                        decoration: new BoxDecoration({
                          color: '#374151',
                          borderRadius: BorderRadius.circular(4)
                        }),
                        child: Text('왼쪽 정렬된 텍스트입니다', {
                          textAlign: TextAlign.left,
                          style: new TextStyle({
                            fontSize: 14,
                            color: '#E5E7EB'
                          })
                        })
                      }),
                      Container({
                        width: 300,
                        padding: EdgeInsets.all(8),
                        decoration: new BoxDecoration({
                          color: '#374151',
                          borderRadius: BorderRadius.circular(4)
                        }),
                        child: Text('가운데 정렬된 텍스트입니다', {
                          textAlign: TextAlign.center,
                          style: new TextStyle({
                            fontSize: 14,
                            color: '#E5E7EB'
                          })
                        })
                      }),
                      Container({
                        width: 300,
                        padding: EdgeInsets.all(8),
                        decoration: new BoxDecoration({
                          color: '#374151',
                          borderRadius: BorderRadius.circular(4)
                        }),
                        child: Text('오른쪽 정렬된 텍스트입니다', {
                          textAlign: TextAlign.right,
                          style: new TextStyle({
                            fontSize: 14,
                            color: '#E5E7EB'
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
      </div>

      {/* Text Overflow */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-300">텍스트 오버플로우 처리</h4>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowOverflow(!showOverflow)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {showOverflow ? '짧은 텍스트 보기' : '긴 텍스트 보기'}
          </button>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div style={{ height: '150px' }}>
            <Widget
              width="100%"
              height="150px"
              renderer="svg"
              widget={
                Container({
                  color: '#1F2937',
                  padding: EdgeInsets.all(20),
                  child: Column({
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container({
                        width: 200,
                        padding: EdgeInsets.all(8),
                        decoration: new BoxDecoration({
                          color: '#374151',
                          borderRadius: BorderRadius.circular(4)
                        }),
                        child: Text(
                          showOverflow 
                            ? '이것은 매우 긴 텍스트입니다. 컨테이너의 너비를 초과하면 자동으로 줄바꿈됩니다.'
                            : '짧은 텍스트',
                          {
                            style: new TextStyle({
                              fontSize: 14,
                              color: '#E5E7EB'
                            })
                          }
                        )
                      }),
                      Container({
                        width: 200,
                        padding: EdgeInsets.all(8),
                        decoration: new BoxDecoration({
                          color: '#374151',
                          borderRadius: BorderRadius.circular(4)
                        }),
                        child: Text(
                          showOverflow
                            ? '이것은 매우 긴 텍스트입니다. maxLines를 설정하면 지정된 줄 수만큼만 표시되고 나머지는 생략됩니다.'
                            : 'maxLines 설정',
                          {
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: new TextStyle({
                              fontSize: 14,
                              color: '#E5E7EB'
                            })
                          }
                        )
                      })
                    ]
                  })
                })
              }
            />
          </div>
        </div>

        <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
          <code className="text-gray-300 text-sm font-mono">{`// 자동 줄바꿈
Text('긴 텍스트가 자동으로 줄바꿈됩니다')

// 줄 수 제한과 말줄임표
Text('매우 긴 텍스트...', {
  maxLines: 2,
  overflow: TextOverflow.ellipsis
})`}</code>
        </pre>
      </div>

      {/* Tips */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
        <h5 className="text-sm font-semibold text-yellow-400 mb-2">💡 텍스트 처리 팁</h5>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• TextStyle로 폰트 크기, 굵기, 색상 등을 설정할 수 있습니다</li>
          <li>• textAlign으로 텍스트 정렬 방향을 설정합니다</li>
          <li>• maxLines와 overflow로 긴 텍스트를 처리합니다</li>
          <li>• Container의 너비를 설정하면 자동으로 줄바꿈이 됩니다</li>
          <li>• letterSpacing으로 글자 간격을 조절할 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
};

export default TextExample;