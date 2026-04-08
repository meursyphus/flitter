"use client";

import { ComwitProvider } from "comwit";
import { useRouter } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <ComwitProvider context={{ router }}>
      {children}
    </ComwitProvider>
  );
}
