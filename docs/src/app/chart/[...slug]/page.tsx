import { notFound } from "next/navigation";
import { findChartPage, getAllSlugs } from "../_data/charts";
import OverviewPage from "../_components/OverviewPage";
import StylePage from "../_components/StylePage";
import type { ChartExample } from "../_components/StylePage";
import AdvancedPage from "../_components/AdvancedPage";
import ComingSoonPage from "../_components/ComingSoonPage";
import ChartPreview from "@/components/ChartPreview";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = findChartPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
  };
}

/**
 * Returns placeholder examples for a style page.
 * Replace with real chart components as they become available.
 */
function getStyleExamples(slug: string[]): ChartExample[] {
  const key = slug.join("/");

  const exampleMap: Record<string, ChartExample[]> = {
    "bar-chart/toast": [
      { label: "Basic", component: <ChartPreview height={240} /> },
      { label: "Multi-Dataset", component: <ChartPreview height={240} /> },
      {
        label: "Horizontal Direction",
        component: <ChartPreview height={240} />,
      },
      { label: "Custom Colors", component: <ChartPreview height={240} /> },
      { label: "Rounded Bars", component: <ChartPreview height={240} /> },
    ],
  };

  return exampleMap[key] ?? [];
}

export default async function ChartDynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = findChartPage(slug);

  if (!page) {
    notFound();
  }

  // Coming soon pages
  if (page.status === "coming") {
    return <ComingSoonPage data={page} />;
  }

  switch (page.pageType) {
    case "overview":
      return <OverviewPage data={page} />;
    case "style":
      return (
        <StylePage data={page} examples={getStyleExamples(page.slug)} />
      );
    case "advanced":
      return <AdvancedPage data={page} />;
    default:
      notFound();
  }
}
