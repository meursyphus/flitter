import { useState } from 'react';

interface LayoutPaintExampleProps {
  title: string;
  description: string;
}

export default function LayoutPaintExample({ 
  title, 
  description 
}: LayoutPaintExampleProps) {
  const [showLayout, setShowLayout] = useState(true);

  const togglePhase = () => {
    setShowLayout(!showLayout);
  };

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col items-center space-y-6">
          {/* Phase indicator */}
          <div className={`px-6 py-3 rounded-full text-white font-bold ${
            showLayout ? 'bg-blue-600' : 'bg-red-600'
          }`}>
            {showLayout ? 'Layout Phase' : 'Paint Phase'}
          </div>
          
          {/* Visual representation */}
          <div className="w-80 h-48 border-2 border-gray-600 rounded-lg relative bg-gray-800">
            {showLayout ? (
              <div className="absolute left-3 top-3">
                <div className="text-blue-400 font-bold text-sm mb-2">performLayout()</div>
                <div className="text-gray-400 text-xs space-y-1">
                  <div>1. 자식 크기 측정</div>
                  <div>2. 자신의 크기 결정</div>
                  <div>3. 자식 위치 결정</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-red-600 text-white px-6 py-4 rounded-lg mb-3 font-bold">
                    paint()
                  </div>
                  <div className="text-red-400 text-sm">실제 픽셀 그리기</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Toggle button */}
          <button
            onClick={togglePhase}
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            클릭하여 전환
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">Layout Phase</h4>
            <pre className="text-sm text-gray-300">
              <code>{`performLayout() {
  // 1. 자식에게 제약 전달
  child.layout(constraints);
  
  // 2. 자신의 크기 결정
  size = computeSize(child.size);
  
  // 3. 자식 위치 결정
  child.offset = computeOffset();
}`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-red-400 font-semibold mb-2">Paint Phase</h4>
            <pre className="text-sm text-gray-300">
              <code>{`paint(context, offset) {
  // 1. 배경 그리기
  context.drawRect(rect, paint);
  
  // 2. 자식 그리기
  child.paint(context, childOffset);
  
  // 3. 전경 그리기
  context.drawBorder(border);
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}