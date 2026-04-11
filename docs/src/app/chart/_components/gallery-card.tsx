"use client";

import Link from "next/link";

type GalleryCardProps = {
  slug: string;
  title: string;
  style: "Toast" | "AG";
  thumbnailUrl?: string;
  chart?: React.ReactNode;
  index?: number;
};

export default function GalleryCard({
  slug,
  title,
  thumbnailUrl,
  chart,
  index = 0,
}: GalleryCardProps) {

  return (
    <Link
      href={`/chart/gallery/${slug}`}
      className="group block overflow-hidden rounded-xl bg-neutral-50 transition-all duration-200 hover:bg-neutral-100/80"
    >
      <div className="flex h-[280px] items-center justify-center p-5 transition-transform duration-200 group-hover:scale-[1.02]">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-contain"
          />
        ) : (
          chart
        )}
      </div>

      <div className="px-5 pb-3">
        <span className="text-[13px] font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors">{title}</span>
      </div>
    </Link>
  );
}
