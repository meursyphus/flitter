import Editor from "@monaco-editor/react";
import {
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
    "@meursyphus/flitter-react": "0.0.8",
    "@meursyphus/flitter": "2.0.0-alpha.4",
    "react-dom": "latest",
    react: "latest",
    "react-markdown": "latest",
  },
};

export default function MySandpack({
  files,
}: Readonly<{
  files: Record<string, string>;
}>) {
  return (
    <SandpackProvider
      files={files}
      customSetup={{
        ...customSetup,
      }}
      template="react"
      theme="dark"
      style={{
        height: "100%",
      }}
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
