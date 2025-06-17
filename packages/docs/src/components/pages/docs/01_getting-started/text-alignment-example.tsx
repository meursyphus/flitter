import React from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Center, 
  Container, 
  Text,
  TextAlign,
  TextOverflow,
  TextStyle,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  BoxShadow,
  Offset
} from '@meursyphus/flitter';

interface TextAlignmentExampleProps {
  title: string;
  description: string;
  sampleText: string;
}

export default function TextAlignmentExample({
  title,
  description,
  sampleText
}: TextAlignmentExampleProps) {
  return (
    <div className="my-8">
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>

      {/* 실제 렌더링 결과 - 다크 테마 대응 */}
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 backdrop-blur">
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md">
            <Widget
              width="100%"
              height="200px"
              renderer="svg"
              widget={
                Center({
                  child: Container({
                    width: 250,
                    padding: EdgeInsets.all(16),
                    decoration: new BoxDecoration({
                      color: '#1F2937', // gray-800
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        new BoxShadow({
                          color: 'rgba(0, 0, 0, 0.2)',
                          offset: new Offset({ x: 0, y: 4 }),
                          blurRadius: 6,
                        })
                      ]
                    }),
                    child: Text(sampleText, {
                      style: new TextStyle({
                        fontSize: 16,
                        color: '#E5E7EB', // gray-200
                        height: 1.5
                      }),
                      textAlign: TextAlign.center,
                    })
                  })
                })
              }
            />
          </div>
        </div>

        {/* 코드 표시 - 다크 테마 */}
        <div className="mt-6">
          <div className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300"><code>{`Center({
  child: Container({
    width: 250,
    padding: EdgeInsets.all(16),
    decoration: new BoxDecoration({
      color: '#1F2937', // gray-800
      borderRadius: BorderRadius.circular(12),
      boxShadow: [
        new BoxShadow({
          color: 'rgba(0, 0, 0, 0.2)',
          offset: new Offset({ x: 0, y: 4 }),
          blurRadius: 6,
          spreadRadius: -1
        })
      ]
    }),
    child: Text("${sampleText}", {
      style: new TextStyle({
        fontSize: 16,
        color: '#E5E7EB', // gray-200
        height: 1.5
      }),
      textAlign: TextAlign.center,
      maxLines: 3,
      overflow: TextOverflow.ellipsis
    })
  })
})`}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}