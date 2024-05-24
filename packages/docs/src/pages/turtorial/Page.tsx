import { Sandpack } from "@codesandbox/sandpack-react";

export default function Page() {
  return (
    <Sandpack
      customSetup={{
        dependencies: {
          "@meursyphus/flitter-react": "latest",
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
