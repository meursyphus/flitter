interface CustomPaintBackgroundProps {
  title: string;
  description: string;
}

export default function CustomPaintBackground({ 
  title, 
  description 
}: CustomPaintBackgroundProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="max-w-lg w-full space-y-6">
            {/* RenderObject 방식 (복잡) */}
            <div className="bg-red-600 p-4 rounded-lg">
              <h4 className="text-white font-bold text-lg mb-3">❌ RenderObject 방식</h4>
              <div className="bg-black/30 p-3 rounded space-y-2">
                <div className="text-red-200 text-sm">1. RenderObjectWidget 상속</div>
                <div className="text-red-200 text-sm">2. createRenderObject() 구현</div>
                <div className="text-red-200 text-sm">3. RenderBox 클래스 작성</div>
                <div className="text-red-200 text-sm">4. paint() 메서드 오버라이드</div>
                <div className="text-red-200 text-sm">5. 레이아웃 로직 구현</div>
                <div className="text-white font-bold text-sm mt-3">총 50+ 줄의 보일러플레이트 코드! 😫</div>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gray-500"></div>
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-500"></div>
              </div>
            </div>
            
            {/* CustomPaint 방식 (간단) */}
            <div className="bg-emerald-600 p-4 rounded-lg">
              <h4 className="text-white font-bold text-lg mb-3">✅ CustomPaint 방식</h4>
              <div className="bg-black/30 p-3 rounded space-y-1">
                <div className="text-emerald-200 text-sm">{"CustomPaint({"}</div>
                <div className="text-emerald-200 text-sm">{"  painter: (canvas, size) => {"}</div>
                <div className="text-emerald-200 text-sm">{"    // 그리기 코드"}</div>
                <div className="text-emerald-200 text-sm">{"  }"}</div>
                <div className="text-emerald-200 text-sm">{"})"}</div>
                <div className="text-white font-bold text-sm mt-3">단 5줄로 끝! 🎉</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-950 rounded">
          <h4 className="text-yellow-400 font-semibold mb-2">💡 핵심 아이디어</h4>
          <p className="text-gray-300 text-sm">
            CustomPaint는 내부적으로 RenderObject를 생성하고 관리합니다. 
            개발자는 그리기 로직만 함수로 전달하면 되므로, 
            복잡한 클래스 구조를 이해할 필요가 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}