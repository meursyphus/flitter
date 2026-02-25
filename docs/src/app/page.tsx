import Link from "next/link";

const libraries = [
  {
    name: "Chart",
    description: "Beautiful, interactive charts with minimal code.",
    href: "/chart/getting-started",
    status: "available" as const,
    tags: ["Bar", "Line", "Pie", "Sankey", "18+ types"],
  },
  {
    name: "Diagram",
    description: "Node-edge diagrams and flowcharts.",
    href: "#",
    status: "coming" as const,
    tags: ["Flowchart", "ERD", "Mindmap"],
  },
  {
    name: "Order Book",
    description: "Real-time order book and depth chart for trading.",
    href: "#",
    status: "coming" as const,
    tags: ["Depth Chart", "Real-time", "WebSocket"],
  },
  {
    name: "Seat Map",
    description: "Interactive seat selection and floor plans.",
    href: "#",
    status: "coming" as const,
    tags: ["Zoom/Pan", "Selection", "Real-time"],
  },
  {
    name: "ECG / Vital Signs",
    description: "High-frequency medical waveform rendering.",
    href: "#",
    status: "coming" as const,
    tags: ["960Hz", "Multi-channel", "Streaming"],
  },
  {
    name: "Annotation",
    description: "Image/video annotation with bounding boxes and polygons.",
    href: "#",
    status: "coming" as const,
    tags: ["BBox", "Polygon", "AI Labeling"],
  },
  {
    name: "Candlestick",
    description: "Financial candlestick charts with technical indicators.",
    href: "#",
    status: "coming" as const,
    tags: ["OHLC", "RSI", "Drawing Tools"],
  },
  {
    name: "Network Graph",
    description: "Force-directed node-edge graph visualization.",
    href: "#",
    status: "coming" as const,
    tags: ["Force Layout", "Clustering", "WebGL"],
  },
  {
    name: "Waveform",
    description: "Audio waveform display and timeline editing.",
    href: "#",
    status: "coming" as const,
    tags: ["Multi-track", "Regions", "Playback"],
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Flitter
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          High-performance Canvas/SVG rendering libraries for the web.
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Every visualization you need. One ecosystem.
        </p>
      </div>

      {/* Library grid */}
      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {libraries.map((lib) => {
          const isAvailable = lib.status === "available";
          const Wrapper = isAvailable ? Link : "div";

          return (
            <Wrapper
              key={lib.name}
              href={lib.href}
              className={`group relative rounded-lg border p-5 transition-all ${
                isAvailable
                  ? "border-gray-200 hover:border-indigo-300 hover:shadow-sm"
                  : "cursor-default border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2
                  className={`font-semibold ${isAvailable ? "group-hover:text-indigo-600" : "text-gray-700"}`}
                >
                  {lib.name}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    isAvailable
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Coming Soon"}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{lib.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {lib.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-gray-50 px-1.5 py-0.5 text-[11px] text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {/* Core API link */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-400">
          Need low-level control?{" "}
          <Link
            href="/advanced/what-is-flitter"
            className="text-indigo-500 hover:text-indigo-700"
          >
            Explore the Core API →
          </Link>
        </p>
      </div>
    </main>
  );
}
