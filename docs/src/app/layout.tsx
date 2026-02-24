export const metadata = {
  title: "Flitter Documentation",
  description: "Documentation for the Flitter rendering engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
