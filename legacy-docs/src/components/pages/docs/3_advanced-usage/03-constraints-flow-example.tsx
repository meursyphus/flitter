import { useState } from 'react';

interface ConstraintsFlowExampleProps {
  title: string;
  description: string;
}

export default function ConstraintsFlowExample({ 
  title, 
  description 
}: ConstraintsFlowExampleProps) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((step + 1) % 4);
  };

  const getStepDescription = () => {
    switch (step) {
      case 0: return '초기 상태';
      case 1: return '1. 부모가 자식에게 제약 전달';
      case 2: return '2. 자식이 제약 확인';
      case 3: return '3. 자식이 크기 결정 후 보고';
      default: return '';
    }
  };

  return (
    <div className="my-8">
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="relative w-80 h-80">
            {/* Parent widget */}
            <div className="absolute left-12 top-5 w-48 h-24 bg-blue-600/20 border-2 border-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 font-semibold">Parent Widget</span>
            </div>
            
            {/* Child widget */}
            <div className="absolute left-24 top-40 w-24 h-20 bg-emerald-600/20 border-2 border-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-emerald-400 font-semibold text-sm">Child Widget</span>
            </div>
            
            {/* Arrows and labels based on step */}
            {step >= 1 && (
              <>
                {/* Constraints arrow down */}
                <div className="absolute left-36 top-32">
                  <div className="w-0.5 h-6 bg-yellow-500"></div>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-yellow-500"></div>
                </div>
                <div className="absolute left-16 top-34 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  Constraints
                </div>
              </>
            )}
            
            {step >= 2 && (
              <div className="absolute left-4 top-48 bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                min: 0x0<br />max: 200x100
              </div>
            )}
            
            {step >= 3 && (
              <>
                {/* Size arrow up */}
                <div className="absolute left-36 top-36">
                  <div className="bg-emerald-500 text-white px-2 py-1 rounded text-xs font-semibold mb-1">
                    Size: 100x80
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-emerald-500"></div>
                  <div className="w-0.5 h-6 bg-emerald-500"></div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="text-center">
          <div className="mb-4">
            <span className="text-white font-semibold text-lg">{getStepDescription()}</span>
          </div>
          <button
            onClick={nextStep}
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            다음 단계
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-gray-950 rounded">
          <pre className="text-sm text-gray-300 overflow-x-auto">
            <code>{`// BoxConstraints 구조
class BoxConstraints {
  final double minWidth;   // 최소 너비
  final double maxWidth;   // 최대 너비  
  final double minHeight;  // 최소 높이
  final double maxHeight;  // 최대 높이
  
  // 자식은 이 범위 내에서 크기를 선택
  // minWidth <= width <= maxWidth
  // minHeight <= height <= maxHeight
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}