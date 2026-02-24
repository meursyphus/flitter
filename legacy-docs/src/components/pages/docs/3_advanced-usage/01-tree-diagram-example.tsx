interface TreeDiagramExampleProps {
  title: string;
  description: string;
}

export default function TreeDiagramExample({ 
  title, 
  description 
}: TreeDiagramExampleProps) {
  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-col items-center space-y-6">
          {/* Widget Tree */}
          <div className="bg-blue-600 text-white px-6 py-4 rounded-lg text-center">
            <div className="font-bold text-lg">Widget Tree</div>
            <div className="text-blue-200 text-sm mt-2">설계도 (불변 객체)</div>
          </div>
          
          {/* Arrow down */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-gray-500"></div>
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-500"></div>
          </div>
          
          {/* Element Tree */}
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg text-center">
            <div className="font-bold text-lg">Element Tree</div>
            <div className="text-emerald-200 text-sm mt-2">인스턴스 (상태 관리)</div>
          </div>
          
          {/* Arrow down */}
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-gray-500"></div>
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-gray-500"></div>
          </div>
          
          {/* RenderObject Tree */}
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg text-center">
            <div className="font-bold text-lg">RenderObject Tree</div>
            <div className="text-red-200 text-sm mt-2">실제 렌더링 (레이아웃 & 페인팅)</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-950 rounded">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`// Widget Tree (개발자가 작성하는 코드)
Container({
  child: Text("Hello")
})

// Element Tree (프레임워크가 자동 생성)
ContainerElement -> TextElement

// RenderObject Tree (실제 렌더링)
RenderDecoratedBox -> RenderParagraph`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}