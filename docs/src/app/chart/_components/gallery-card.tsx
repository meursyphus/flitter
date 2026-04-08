"use client";

import Link from "next/link";

type GalleryCardProps = {
  slug: string;
  title: string;
  style: "Toast" | "AG";
  thumbnail?: string;
  chart?: React.ReactNode;
  index?: number;
};

export default function GalleryCard({
  slug,
  title,
  thumbnail,
  chart,
  index = 0,
}: GalleryCardProps) {
  const thumbnailSrc = thumbnail
    ? `data:image/svg+xml,${encodeURIComponent(thumbnail)}`
    : null;

  return (
    <Link
      href={`/chart/gallery/${slug}`}
      className="group block overflow-hidden rounded-md border border-neutral-200 bg-white transition-colors hover:outline hover:outline-2 hover:outline-teal-600"
    >
      <div className="flex h-[300px] items-center justify-center p-4">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          chart
        )}
      </div>

      <div className="border-t border-neutral-200 px-4 py-2">
        <span className="text-xs font-medium text-neutral-500">{title}</span>
      </div>
    </Link>
  );
}
