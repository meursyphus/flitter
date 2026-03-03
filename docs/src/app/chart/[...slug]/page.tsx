import { notFound } from "next/navigation";
import { findChartPage, getAllSlugs } from "../_data";
import OverviewPage from "../_components/overview-page";
import StylePage from "../_components/style-page";
import AdvancedPage from "../_components/advanced-page";

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

export default async function ChartDynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = findChartPage(slug);

  if (!page) {
    notFound();
  }

  switch (page.pageType) {
    case "overview":
      return <OverviewPage data={page} />;
    case "style":
      return <StylePage data={page} />;
    case "advanced":
      return <AdvancedPage data={page} />;
    default:
      notFound();
  }
}
