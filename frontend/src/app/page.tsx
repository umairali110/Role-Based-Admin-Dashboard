"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#172554_100%)] text-slate-100">
      <p className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 shadow-xl backdrop-blur-xl">
        Redirecting to sign in…
      </p>
    </main>
  );
}
