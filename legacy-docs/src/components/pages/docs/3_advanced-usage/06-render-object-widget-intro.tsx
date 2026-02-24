interface RenderObjectWidgetIntroProps {
  title: string;
  description: string;
}

export default function RenderObjectWidgetIntro({ 
  title, 
  description 
}: RenderObjectWidgetIntroProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="text-center mb-8">
              <h4 className="text-gray-100 text-lg font-bold">RenderObjectWidget 계층 구조</h4>
            </div>
            
            {/* Hierarchy diagram */}
            <div className="relative h-96 flex flex-col items-center">
              {/* RenderObjectWidget */}
              <div className="bg-purple-600 text-white px-5 py-3 rounded-lg font-bold text-sm">
                RenderObjectWidget
              </div>
              
              {/* Vertical line */}
              <div className="w-0.5 h-12 bg-gray-500 my-2"></div>
              
              {/* Horizontal line and branches */}
              <div className="relative">
                <div className="w-48 h-0.5 bg-gray-500"></div>
                <div className="absolute left-0 top-0 w-0.5 h-12 bg-gray-500"></div>
                <div className="absolute right-0 top-0 w-0.5 h-12 bg-gray-500"></div>
              </div>
              
              {/* Child widgets */}
              <div className="flex justify-between w-96 mt-3">
                {/* SingleChildRenderObjectWidget */}
                <div className="bg-blue-600 text-white p-3 rounded-lg text-center flex-1 mr-4">
                  <div className="font-bold text-sm mb-2">SingleChild</div>
                  <div className="font-bold text-sm mb-3">RenderObjectWidget</div>
                  <div className="space-y-1 text-xs text-blue-200">
                    <div>Container</div>
                    <div>Padding</div>
                    <div>Align</div>
                  </div>
                </div>
                
                {/* MultiChildRenderObjectWidget */}
                <div className="bg-emerald-600 text-white p-3 rounded-lg text-center flex-1">
                  <div className="font-bold text-sm mb-2">MultiChild</div>
                  <div className="font-bold text-sm mb-3">RenderObjectWidget</div>
                  <div className="space-y-1 text-xs text-emerald-200">
                    <div>Row</div>
                    <div>Column</div>
                    <div>Stack</div>
                  </div>
                </div>
              </div>
              
              {/* Methods box */}
              <div className="mt-8 w-full max-w-xs bg-gray-800 border-2 border-gray-600 rounded-lg p-4">
                <div className="text-amber-400 font-bold text-sm mb-3">주요 메서드:</div>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-gray-200">• createRenderObject()</div>
                    <div className="text-gray-400 ml-4">→ RenderObject 생성</div>
                  </div>
                  <div>
                    <div className="text-gray-200">• updateRenderObject()</div>
                    <div className="text-gray-400 ml-4">→ 속성 업데이트</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-purple-400 font-semibold mb-2">기본 구조</h4>
            <pre className="text-sm text-gray-300">
              <code>{`abstract class RenderObjectWidget {
  // RenderObject 생성
  createRenderObject(): RenderObject;
  
  // RenderObject 업데이트
  updateRenderObject(
    renderObject: RenderObject
  ): void;
}`}</code>
            </pre>
          </div>
          
          <div className="p-4 bg-gray-950 rounded">
            <h4 className="text-blue-400 font-semibold mb-2">사용 예시</h4>
            <pre className="text-sm text-gray-300">
              <code>{`class MyWidget extends 
    SingleChildRenderObjectWidget {
  
  createRenderObject() {
    return new MyRenderBox();
  }
  
  updateRenderObject(renderObject) {
    renderObject.color = this.color;
  }
}`}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}