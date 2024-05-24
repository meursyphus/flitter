import Editor from "@monaco-editor/react";
import {
  Sandpack,
  useActiveCode,
  SandpackStack,
  FileTabs,
  useSandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { useMemo } from "react";

function debounce(func: Function, wait: any) {
  let timeout: any;

  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack, dispatch } = useSandpack();
  const debouncedUpdateCode = useMemo(
    () =>
      debounce(() => {
        //dispatch({type: 'refresh'})
      }, 1000),
    [updateCode],
  );

  const handleChange = (value: string | undefined) => {
    updateCode(value ?? "");
    debouncedUpdateCode();
  };

  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: "#1e1e1e" }}>
        <Editor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={handleChange}
        />
      </div>
    </SandpackStack>
  );
}
const customSetup = {
  dependencies: {
    "@meursyphus/flitter-react": "0.0.7",
    "@meursyphus/flitter": "2.0.0-alpha.3",
    "react-dom": "latest",
    react: "latest",
    "react-markdown": "latest",
  },
};
const files = {
  "/App.js": `import ReactMarkdown from 'react-markdown' 
  import Widget from '@meursyphus/flitter-react'
  import {Text} from '@meursyphus/flitter'

export default function App() {
  return <Widget height="200px" width="200px" widget={Text("Hello, worldasdf!")} />
}`,
};

export default function MySandpack() {
  return (
    <SandpackProvider
      files={files}
      customSetup={{
        ...customSetup,
      }}
      template="react"
      theme="dark"
    >
      <SandpackLayout
        style={{
          height: "100vh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MonacoEditor />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
}

export function Page() {
  return (
    <Sandpack
      customSetup={{
        dependencies: {
          "@meursyphus/flitter-react": "0.0.3",
          "@meursyphus/flitter": "latest",
          "react-dom": "latest",
          react: "latest",
          "react-markdown": "latest",
        },
        entry: "/index.js",
      }}
      files={{
        "/App.js": `import ReactMarkdown from 'react-markdown' 
        import Widget from '@meursyphus/flitter-react'
        import {Text} from '@meursyphus/flitter'

export default function App() {
  return <Widget height="200px" width="200px" widget={Text("Hello, worldasdf!")} />
}`,
        "/index.js": `import App from "./App";
        import ReactDom from "react-dom"
        import React from "react"

ReactDom.render(<App />, document.getElementById("root"))

export default App;`,
      }}
    />
  );
}
