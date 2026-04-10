import ChartLanding from "./_components/chart-landing";
import CliCodeBlock from "./_components/cli-code-block";
import { CustomCodeBlock, OwnCodeBlock } from "./_components/benefits-code-blocks";

export const metadata = {
  title: "Chart",
  description: "Every chart you need, in one library.",
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
