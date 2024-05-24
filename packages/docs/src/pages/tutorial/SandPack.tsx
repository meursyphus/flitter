import Editor, { useMonaco } from "@monaco-editor/react";
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
import { useEffect, useRef } from "react";

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
  const monaco = useMonaco();

  const handleChange = (value: string | undefined) => {
    updateCode(value ?? "");
  };

  const editorRef = useRef<any>();

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current == null) return;
      editorRef.current.layout({});
      console.log(editorRef.current.layout);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SandpackStack style={{ margin: 0, height: "50vh" }}>
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
          onMount={(editor) => {
            editorRef.current = editor;
          }}
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
          height: "100%",
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
