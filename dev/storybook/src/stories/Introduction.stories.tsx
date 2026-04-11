import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import BubbleChartGif from "./assets/bubble.gif";
import DiagramGif from "./assets/diagram.gif";
import FlutterJsExampleGif from "./assets/love_flutter.gif";
import componentWidget from "./assets/component-widget.ts";
import pureJavascript from "./assets/pure-javascript.ts";
import reactExample from "./assets/react.ts";
import renderWidget from "./assets/render-widget.ts";

function IntroductionPage() {
  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Flitter</h1>
      <p style={paragraphStyle}>
        Flitter is an SVG-based rendering framework inspired by Flutter. It uses a
        declarative widget tree and direct layout calculation, which makes UI and
        data visualization work easier to control than lower-level SVG tooling.
      </p>
      <p style={paragraphStyle}>
        This Storybook is React-based, and the examples below focus on the React
        integration and core JavaScript usage.
      </p>

      <div style={twoUpStyle}>
        <img alt="Bubble chart example" src={BubbleChartGif} style={mediaStyle} />
        <img alt="Diagram example" src={DiagramGif} style={mediaStyle} />
      </div>

      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>Examples</h2>
        <p style={paragraphStyle}>
          The goal is to keep the authoring model close to Flutter while rendering
          efficiently in the browser.
        </p>
        <img
          alt="Flitter example animation"
          src={FlutterJsExampleGif}
          style={heroImageStyle}
        />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>Usage</h2>
        <h3 style={subheadingStyle}>Pure JavaScript</h3>
        <CodeBlock code={"npm i flitter-core"} />
        <CodeBlock code={pureJavascript} />

        <h3 style={subheadingStyle}>React</h3>
        <CodeBlock code={"npm i flitter-core @flitterjs/react"} />
        <CodeBlock code={reactExample} />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>Result</h2>
        <div style={resultStyle}>
          <div style={resultTextStyle}>Hello, FlutterJS!</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>Description</h2>
        <p style={paragraphStyle}>
          Flitter renders to SVG instead of emulating the full Flutter Web runtime,
          so hit testing and server-side rendering stay much simpler.
        </p>
        <p style={paragraphStyle}>
          You can extend the framework with custom render objects and higher-level
          component widgets.
        </p>
        <CodeBlock code={renderWidget} />
        <CodeBlock code={componentWidget} />
      </section>

      <section style={sectionStyle}>
        <h2 style={sectionHeadingStyle}>GitHub</h2>
        <a href="https://github.com/meursyphus/flitter-chart" style={linkStyle}>
          https://github.com/meursyphus/flitter-chart
        </a>
      </section>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={codeBlockStyle}>
      <code>{code}</code>
    </pre>
  );
}

const meta = {
  title: "Introduction",
  component: IntroductionPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof IntroductionPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => <IntroductionPage />,
};

const pageStyle: CSSProperties = {
  boxSizing: "border-box",
  color: "#0f172a",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  lineHeight: 1.6,
  margin: "0 auto",
  maxWidth: "960px",
  padding: "40px 24px 80px",
};

const sectionStyle: CSSProperties = {
  marginTop: "40px",
};

const headingStyle: CSSProperties = {
  fontSize: "40px",
  lineHeight: 1.1,
  margin: "0 0 16px",
};

const sectionHeadingStyle: CSSProperties = {
  fontSize: "28px",
  lineHeight: 1.2,
  margin: "0 0 12px",
};

const subheadingStyle: CSSProperties = {
  fontSize: "20px",
  lineHeight: 1.3,
  margin: "24px 0 12px",
};

const paragraphStyle: CSSProperties = {
  fontSize: "16px",
  margin: "0 0 12px",
};

const twoUpStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  marginTop: "24px",
};

const mediaStyle: CSSProperties = {
  borderRadius: "12px",
  display: "block",
  width: "100%",
};

const heroImageStyle: CSSProperties = {
  borderRadius: "12px",
  display: "block",
  marginTop: "16px",
  maxWidth: "100%",
};

const codeBlockStyle: CSSProperties = {
  backgroundColor: "#0f172a",
  borderRadius: "12px",
  color: "#e2e8f0",
  fontFamily: "ui-monospace, SFMono-Regular, monospace",
  fontSize: "13px",
  margin: "12px 0 0",
  overflowX: "auto",
  padding: "16px",
  whiteSpace: "pre-wrap",
};

const resultStyle: CSSProperties = {
  alignItems: "center",
  backgroundColor: "lightblue",
  borderRadius: "12px",
  display: "flex",
  height: "300px",
  justifyContent: "center",
  marginTop: "16px",
  width: "100%",
};

const resultTextStyle: CSSProperties = {
  fontSize: "30px",
  fontWeight: "bold",
};

const linkStyle: CSSProperties = {
  color: "#2563eb",
};
