"use client";

type Entry = {
  slug: string;
  Component: React.ComponentType;
};

export default function ThumbnailGrid({ entries }: { entries: Entry[] }) {
  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry.slug}
          data-slug={entry.slug}
          style={{
            width: 800,
            height: 500,
            background: "white",
            overflow: "hidden",
          }}
        >
          <entry.Component />
        </div>
      ))}
    </div>
  );
}
