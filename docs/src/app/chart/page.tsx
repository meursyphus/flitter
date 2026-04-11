import ChartLanding from "./_components/chart-landing";
import CliCodeBlock from "./_components/cli-code-block";
import { CustomCodeBlock, OwnCodeBlock } from "./_components/benefits-code-blocks";

export const metadata = {
  title: "Chart",
  description:
    "Every chart you need, in one library. Shadcn-style installable charts built on Flitter.",
  openGraph: {
    images: [
      {
        url: "/og/og-chart.png",
        width: 1200,
        height: 630,
        alt: "Flitter Chart",
      },
    ],
  },
};

export default function ChartHome() {
  return (
    <ChartLanding
      cliCodeBlock={<CliCodeBlock />}
      customCodeBlock={<CustomCodeBlock />}
      ownCodeBlock={<OwnCodeBlock />}
    />
  );
}
