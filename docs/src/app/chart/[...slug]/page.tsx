import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findChartPage, getAllSlugs } from "../_data";
import OverviewPage from "../_components/overview-page";
import GalleryPage from "../_components/gallery-page";
import GalleryDetailPage from "../_components/gallery-detail-page";
import ApiPage from "../_components/api-page";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findChartPage(slug);
  if (!page) return {};

  const meta: Metadata = {
    title: page.title,
    description: page.description,
  };

  if (page.pageType === "gallery-detail") {
    meta.openGraph = {
      images: [{ url: page.entry.thumbnailUrl, alt: page.title }],
    };
  }

  return meta;
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
    case "gallery-index":
      return <GalleryPage />;
    case "gallery-detail":
      return <GalleryDetailPage data={page} />;
    case "api":
      return <ApiPage data={page} />;
    default:
      notFound();
  }
}
