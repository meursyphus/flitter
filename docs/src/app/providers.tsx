"use client";

import { ComwitProvider } from "comwit";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ReactGrab = dynamic(
  () => import("react-grab/react").then((m) => ({ default: m.ReactGrab })),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ComwitProvider context={{ router }}>
      {process.env.NODE_ENV === "development" && <ReactGrab />}
      {children}
    </ComwitProvider>
  );
}
