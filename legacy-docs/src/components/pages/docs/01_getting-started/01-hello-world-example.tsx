import React, { useState } from 'react';
import Widget from '@meursyphus/flitter-react';
import { 
  Container, 
  Center, 
  Text, 
  TextStyle, 
  GestureDetector,
  Column,
  EdgeInsets,
  MainAxisAlignment,
  BoxDecoration,
  BorderRadius,
  SizedBox,
  StatefulWidget,
  State,
  BuildContext
} from '@meursyphus/flitter';

// Flitter 카운터 위젯
class CounterWidget extends StatefulWidget {
  createState() {
    return new CounterWidgetState();
  }
}

class CounterWidgetState extends State<CounterWidget> {
  count = 0;

  build(context: BuildContext) {
    return Center({
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(`Count: ${this.count}`, {
            style: new TextStyle({
              fontSize: 48,
              fontWeight: 'bold',
              color: '#E5E7EB'
            })
          }),
          SizedBox({ height: 20 }),
          GestureDetector({
            onClick: () => {
              this.setState(() => {
                this.count++;
              });
            },
            child: Container({
              padding: EdgeInsets.symmetric({ horizontal: 32, vertical: 16 }),
              decoration: new BoxDecoration({
                color: '#3B82F6',
                borderRadius: BorderRadius.circular(8)
              }),
              child: Text('Click Me!', {
                style: new TextStyle({
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                })
              })
            })
          })
        ]
      })
    });
  }
}

// 팩토리 함수를 수동으로 작성
function CounterWidgetFactory() {
  return new CounterWidget();
}

interface HelloWorldExampleProps {
  title: string;
  description: string;
  labels: {
    flitterTab: string;
    d3Tab: string;
    codeSection: string;
    resultSection: string;
    flitterCodeTitle: string;
    d3CodeTitle: string;
    flitterAdvantages: string;
    d3Problems: string;
    keyDifferences: string;
    resultDescription: string;
    flitterBenefits: {
      declarative: string;
      gestureDetector: string;
      setState: string;
      widgetComposition: string;
    };
    d3Issues: {
      manualCoordinates: string;
      manualEvents: string;
      directDOM: string;
      separateHover: string;
    };
  };
}

export default function HelloWorldExample({ 
  title, 
  description,
  labels
}: HelloWorldExampleProps) {
  const [showD3Code, setShowD3Code] = useState(false);

  const d3Code = `// D3.js로 카운터 구현하기
const svg = d3.select("#counter")
  .append("svg")
  .attr("width", 400)
  .attr("height", 300);

let count = 0;

// 텍스트 요소 생성
const countText = svg.append("text")
  .attr("x", 200)
  .attr("y", 120)
  .attr("text-anchor", "middle")
  .attr("font-size", "48px")
  .attr("font-weight", "bold")
  .attr("fill", "#E5E7EB")
  .text(\`Count: \${count}\`);

// 버튼 그룹 생성
const buttonGroup = svg.append("g")
  .attr("transform", "translate(200, 150)");

// 버튼 배경
const buttonBg = buttonGroup.append("rect")
  .attr("x", -60)
  .attr("y", 0)
  .attr("width", 120)
  .attr("height", 50)
  .attr("rx", 8)
  .attr("fill", "#3B82F6")
  .style("cursor", "pointer");

// 버튼 텍스트
const buttonText = buttonGroup.append("text")
  .attr("x", 0)
  .attr("y", 30)
  .attr("text-anchor", "middle")
  .attr("font-size", "20px")
  .attr("font-weight", "bold")
  .attr("fill", "#FFFFFF")
  .style("pointer-events", "none")
  .text("Click Me!");

// 클릭 이벤트 처리
buttonGroup.on("click", function() {
  count++;
  countText.text(\`Count: \${count}\`);
  
  // 클릭 효과
  buttonBg.transition()
    .duration(100)
    .attr("fill", "#2563EB")
    .transition()
    .duration(100)
    .attr("fill", "#3B82F6");
});

// 호버 효과
buttonGroup.on("mouseenter", function() {
  buttonBg.attr("fill", "#2563EB");
});

buttonGroup.on("mouseleave", function() {
  buttonBg.attr("fill", "#3B82F6");
});`;

  const flitterCode = `// Flitter로 카운터 구현하기
class CounterWidget extends StatefulWidget {
  createState() {
    return new CounterWidgetState();
  }
}

class CounterWidgetState extends State<CounterWidget> {
  count = 0;

  build(context: BuildContext) {
    return Center({
      child: Column({
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(\`Count: \${this.count}\`, {
            style: new TextStyle({
              fontSize: 48,
              fontWeight: 'bold',
              color: '#E5E7EB'
            })
          }),
          SizedBox({ height: 20 }),
          GestureDetector({
            onClick: () => {
              this.setState(() => {
                this.count++;
              });
            },
            child: Container({
              padding: EdgeInsets.symmetric({ 
                horizontal: 32, 
                vertical: 16 
              }),
              decoration: new BoxDecoration({
                color: '#3B82F6',
                borderRadius: BorderRadius.circular(8)
              }),
              child: Text('Click Me!', {
                style: new TextStyle({
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                })
              })
            })
          })
        ]
      })
    });
  }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* 코드 비교 탭 */}
      <div className="border-b border-gray-800">
        <div className="flex gap-2">
          <button
            onClick={() => setShowD3Code(false)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              !showD3Code 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {labels.flitterTab}
          </button>
          <button
            onClick={() => setShowD3Code(true)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              showD3Code 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {labels.d3Tab}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 코드 영역 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">
            {showD3Code ? labels.d3CodeTitle : labels.flitterCodeTitle}
          </h4>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="text-gray-300 text-sm font-mono">
              <code>{showD3Code ? d3Code : flitterCode}</code>
            </pre>
          </div>
          {!showD3Code && (
            <p className="text-xs text-gray-500 mt-2">
              * {labels.flitterBenefits.declarative}
            </p>
          )}
          {showD3Code && (
            <p className="text-xs text-gray-500 mt-2">
              * {labels.d3Issues.manualCoordinates}
            </p>
          )}
        </div>

        {/* 실행 결과 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">{labels.resultSection}</h4>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-center items-center">
              <Widget
                width="100%"
                height="300px"
                renderer="svg"
                widget={CounterWidgetFactory()}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {labels.resultDescription}
          </p>
        </div>
      </div>

      {/* 주요 차이점 */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-400 mb-3">💡 {labels.keyDifferences}</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h5 className="font-semibold text-gray-200 mb-2">{labels.d3Problems}</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>{labels.d3Issues.manualCoordinates}</li>
              <li>{labels.d3Issues.manualEvents}</li>
              <li>{labels.d3Issues.directDOM}</li>
              <li>{labels.d3Issues.separateHover}</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-200 mb-2">{labels.flitterAdvantages}</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>{labels.flitterBenefits.declarative}</li>
              <li>{labels.flitterBenefits.gestureDetector}</li>
              <li>{labels.flitterBenefits.setState}</li>
              <li>{labels.flitterBenefits.widgetComposition}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}