import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { StoryFrameProps } from "./storyTypes";

type ScorecardRow = {
  label: string;
  score: number;
  target: number;
  detail: string;
};

const rows: ScorecardRow[] = [
  {
    label: "Payments platform",
    score: 91,
    target: 86,
    detail: "Top rank because conversion gains held after the migration cutover.",
  },
  {
    label: "Identity rollout",
    score: 84,
    target: 82,
    detail: "Strong threshold performance, but support load still spikes after partner onboarding.",
  },
  {
    label: "Billing modernization",
    score: 77,
    target: 80,
    detail: "Below threshold because latency reductions have not offset implementation risk yet.",
  },
  {
    label: "Support automation",
    score: 72,
    target: 74,
    detail: "Stable throughput, but hover detail calls out weaker handoff quality in edge queues.",
  },
];

const shellStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: 28,
  padding: "28px 30px",
  background:
    "linear-gradient(180deg, rgba(248,244,236,0.98) 0%, rgba(240,232,220,0.98) 100%)",
  boxShadow: "0 24px 70px rgba(62, 43, 20, 0.12)",
  color: "#2f2419",
  fontFamily: '"IBM Plex Sans", "Helvetica Neue", sans-serif',
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.45fr) minmax(240px, 0.9fr)",
  gap: 24,
  boxSizing: "border-box",
};

const eyebrowStyle: CSSProperties = {
  fontSize: 12,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#8e6d49",
  marginBottom: 10,
};

const titleStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.1,
  margin: 0,
};

const subtitleStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "#6f5a40",
  margin: "10px 0 0",
};

const columnStyle: CSSProperties = {
  display: "grid",
  gap: 14,
  alignContent: "start",
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  alignContent: "start",
};

const metaCardStyle: CSSProperties = {
  borderRadius: 22,
  padding: 20,
  background: "rgba(255, 251, 246, 0.82)",
  border: "1px solid rgba(121, 91, 51, 0.12)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.55)",
};

function rowCardStyle(active: boolean): CSSProperties {
  return {
    borderRadius: 20,
    padding: "16px 18px",
    background: active ? "rgba(255, 251, 246, 0.92)" : "rgba(255, 251, 246, 0.72)",
    border: active ? "1px solid rgba(120, 89, 47, 0.28)" : "1px solid rgba(120, 89, 47, 0.12)",
    boxShadow: active ? "0 14px 34px rgba(86, 58, 21, 0.12)" : "none",
    transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
    transform: active ? "translateY(-1px)" : "translateY(0)",
    cursor: "pointer",
  };
}

function barTrackStyle(): CSSProperties {
  return {
    position: "relative",
    height: 18,
    borderRadius: 999,
    background: "linear-gradient(90deg, rgba(214, 199, 177, 0.42), rgba(223, 209, 186, 0.78))",
    overflow: "hidden",
  };
}

function barFillStyle(score: number): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    width: `${score}%`,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(26, 121, 148, 0.92) 0%, rgba(43, 161, 167, 0.94) 50%, rgba(107, 182, 138, 0.96) 100%)",
  };
}

function targetMarkerStyle(target: number): CSSProperties {
  return {
    position: "absolute",
    top: -4,
    bottom: -4,
    left: `calc(${target}% - 1px)`,
    width: 2,
    background: "#8a5d34",
    boxShadow: "0 0 0 2px rgba(255, 247, 237, 0.78)",
  };
}

export default function LLMScorecardChart({
  width = "960px",
  height = "540px",
}: StoryFrameProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRow = useMemo(() => rows[activeIndex] ?? rows[0], [activeIndex]);

  return (
    <div
      data-llm-eval-dom="true"
      style={{
        width,
        height,
        padding: 8,
        boxSizing: "border-box",
      }}
    >
      <div style={shellStyle}>
        <section style={columnStyle}>
          <div>
            <div style={eyebrowStyle}>Composite Scorecard</div>
            <h2 style={titleStyle}>Ranked scorecards with thresholds and hover context</h2>
            <p style={subtitleStyle}>
              Each business unit keeps its ranking bar, target marker, and a focused detail panel
              without forcing the request into a single canned chart family.
            </p>
          </div>

          <div style={listStyle}>
            {rows.map((row, index) => {
              const active = index === activeIndex;
              return (
                <article
                  key={row.label}
                  style={rowCardStyle(active)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, color: "#8e6d49", marginBottom: 4 }}>
                        Rank {index + 1}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{row.label}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>{row.score}</div>
                  </div>

                  <div style={barTrackStyle()}>
                    <div style={barFillStyle(row.score)} />
                    <div style={targetMarkerStyle(row.target)} />
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      color: "#7f664a",
                    }}
                  >
                    <span>Observed score</span>
                    <span>Target {row.target}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside style={columnStyle}>
          <div style={metaCardStyle}>
            <div style={eyebrowStyle}>Hover Detail</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{activeRow.label}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#67513a" }}>
              {activeRow.detail}
            </p>
          </div>

          <div style={metaCardStyle}>
            <div style={eyebrowStyle}>Reading Guide</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#67513a" }}>
              Filled bars encode the rank score. The vertical brass marker shows the threshold that
              the business unit is expected to clear this quarter.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
