import React, { useState } from 'react';

interface CodeBlockProps {
  language: string;
  code: string;
  labels: {
    copy: string;
    copied: string;
  };
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, labels }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto">
        <code className="text-gray-300 text-sm font-mono">{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
      >
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  );
};

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

const frameworks: TabItem[] = [
  {
    id: 'vanilla',
    label: 'Vanilla JS',
    icon: <span className="text-yellow-400">JS</span>
  },
  {
    id: 'react',
    label: 'React',
    icon: <span className="text-cyan-400">⚛</span>
  },
  {
    id: 'svelte',
    label: 'Svelte',
    icon: <span className="text-orange-500">⚡</span>
  },
  {
    id: 'vue',
    label: 'Vue',
    icon: <span className="text-green-500">🌿</span>
  },
  {
    id: 'solidjs',
    label: 'SolidJS',
    icon: <span className="text-blue-500">⚡</span>
  },
  {
    id: 'qwik',
    label: 'Qwik',
    icon: <span className="text-purple-500">⚡</span>
  }
];

const installCommands: Record<string, string> = {
  vanilla: 'npm install @meursyphus/flitter',
  react: 'npm install @meursyphus/flitter @meursyphus/flitter-react',
  svelte: 'npm install @meursyphus/flitter @meursyphus/flitter-svelte',
  vue: 'npm install @meursyphus/flitter @meursyphus/flitter-vue',
  solidjs: 'npm install @meursyphus/flitter @meursyphus/flitter-solid',
  qwik: 'npm install @meursyphus/flitter @meursyphus/flitter-qwik'
};

const usageExamples: Record<string, string> = {
  vanilla: `import { Container, AppRunner } from "@meursyphus/flitter";

// HTML setup
document.querySelector("#app").innerHTML = \`
  <div style="width: 100vw; height: 100vh" id="container">
    <canvas style="width: 100%; height: 100%;" id="view" />
  </div>
\`;

// Initialize app
const app = new AppRunner({
  view: document.querySelector("#view")
});

app.onMount({
  resizeTarget: document.querySelector("#container")
});

// Run app
app.runApp(
  Container({ 
    color: 'lightblue',
    child: Text('Hello, Flitter!', {
      style: TextStyle({ fontSize: 24 })
    })
  })
);`,

  react: `import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-react';

const App = () => (
  <Widget
    width="600px"
    height="300px"
    renderer="canvas" // or "svg"
    widget={Container({
      alignment: Alignment.center,
      color: 'lightblue',
      child: Text("Hello, Flitter!", { 
        style: TextStyle({ 
          fontSize: 30, 
          fontWeight: 'bold' 
        }) 
      })
    })}
  />
);

export default App;`,

  svelte: `<script>
  import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
  import Widget from '@meursyphus/flitter-svelte';
</script>

<Widget
  width="600px"
  height="300px"
  renderer="canvas"
  widget={Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text("Hello, Flitter!", { 
      style: TextStyle({ 
        fontSize: 30, 
        fontWeight: 'bold' 
      }) 
    })
  })}
/>`,

  vue: `<template>
  <Widget
    width="600px"
    height="300px"
    renderer="canvas"
    :widget="widget"
  />
</template>

<script setup>
import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import { Widget } from '@meursyphus/flitter-vue';

const widget = Container({
  alignment: Alignment.center,
  color: 'lightblue',
  child: Text("Hello, Flitter!", { 
    style: TextStyle({ 
      fontSize: 30, 
      fontWeight: 'bold' 
    }) 
  })
});
</script>`,

  solidjs: `import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-solid';

const App = () => {
  const widget = Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text("Hello, Flitter!", { 
      style: TextStyle({ 
        fontSize: 30, 
        fontWeight: 'bold' 
      }) 
    })
  });

  return (
    <Widget
      width="600px"
      height="300px"
      renderer="canvas"
      widget={widget}
    />
  );
};

export default App;`,

  qwik: `import { component$ } from '@builder.io/qwik';
import { Container, Alignment, Text, TextStyle } from '@meursyphus/flitter';
import Widget from '@meursyphus/flitter-qwik';

export default component$(() => {
  const widget = Container({
    alignment: Alignment.center,
    color: 'lightblue',
    child: Text("Hello, Flitter!", { 
      style: TextStyle({ 
        fontSize: 30, 
        fontWeight: 'bold' 
      }) 
    })
  });

  return (
    <Widget
      width="600px"
      height="300px"
      renderer="canvas"
      widget={widget}
    />
  );
});`
};

interface InstallationGuideProps {
  defaultTab?: string;
  labels?: {
    installation?: string;
    usageExample?: string;
    importantNotes?: string;
    otherPackageManagers?: string;
    copy?: string;
    copied?: string;
  };
}

const InstallationGuide: React.FC<InstallationGuideProps> = ({ 
  defaultTab = 'react',
  labels = {
    installation: 'Installation',
    usageExample: 'Usage Example',
    importantNotes: '💡 Important Notes',
    otherPackageManagers: 'Other Package Managers',
    copy: 'Copy',
    copied: 'Copied!'
  }
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex flex-wrap gap-2 -mb-px">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() => setActiveTab(framework.id)}
              className={`
                flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg
                transition-colors duration-200
                ${activeTab === framework.id
                  ? 'bg-gray-800 text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                }
              `}
            >
              {framework.icon}
              <span>{framework.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Installation */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">{labels.installation}</h3>
          <CodeBlock 
            language="bash" 
            code={installCommands[activeTab]} 
            labels={{ copy: labels.copy, copied: labels.copied }}
          />
        </div>

        {/* Usage Example */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">{labels.usageExample}</h3>
          <CodeBlock 
            language={activeTab === 'vue' ? 'vue' : activeTab === 'svelte' ? 'svelte' : 'typescript'} 
            code={usageExamples[activeTab]} 
            labels={{ copy: labels.copy, copied: labels.copied }}
          />
        </div>

        {/* Additional Notes */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">{labels.importantNotes}</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            {activeTab === 'vanilla' && (
              <>
                <li>• Make sure to wrap your canvas/svg in a container div for proper sizing</li>
                <li>• The resizeTarget is required for calculating the canvas dimensions</li>
                <li>• Both Canvas and SVG renderers are supported</li>
              </>
            )}
            {activeTab !== 'vanilla' && (
              <>
                <li>• You can switch between "canvas" and "svg" renderers</li>
                <li>• The Widget component handles sizing and lifecycle automatically</li>
                <li>• All Flitter widgets can be composed within the widget prop</li>
              </>
            )}
          </ul>
        </div>

        {/* Package Manager Options */}
        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">{labels.otherPackageManagers}</h4>
          <div className="space-y-2">
            <CodeBlock 
              language="bash" 
              code={`# Using Yarn\nyarn add ${installCommands[activeTab].replace('npm install', '').trim()}\n\n# Using PNPM\npnpm add ${installCommands[activeTab].replace('npm install', '').trim()}`} 
              labels={{ copy: labels.copy, copied: labels.copied }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationGuide;