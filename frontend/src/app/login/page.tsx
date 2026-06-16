"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      const token = JSON.parse(atob(res.data.token.split(".")[1]));
      localStorage.setItem("token", res.data.token);

      setToast({
        type: "success",
        message: "Login successful. Redirecting...",
      });

      setTimeout(() => {
        if (token.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 600);
    } catch (err) {
      setToast({
        type: "error",
        message: "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#172554_100%)] text-slate-100">
      <div className="fixed right-4 top-4 z-50 flex w-[min(92vw,360px)] flex-col gap-3">
        {toast && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm shadow-xl ${
              toast.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl shadow-black/25 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col justify-between bg-[linear-gradient(160deg,#111827_0%,#1f2937_45%,#111827_100%)] p-8 text-slate-100 sm:p-10 lg:p-12">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-100">
                Employee Hub
              </span>

              <div className="space-y-3">
                <h1 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  A clean, professional workspace for your team.
                </h1>
                <p className="max-w-md text-sm text-slate-300 sm:text-base">
                  Login with confidence and manage employee records in a polished, responsive interface.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-3 text-sm text-slate-200">
              {[
                "Fast dashboard access",
                "Secure employee management",
                "Responsive across all devices",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm shadow-black/10"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          <article className="flex items-center justify-center bg-slate-950/70 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center sm:text-left">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/90">
                  Login
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  Sign in to your workspace
                </h2>
                <p className="mt-2 text-sm text-slate-200/85">
                  Use your company email and password to continue.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm text-slate-100">Email</label>
                <input
                  name="email"
                  value={form.email}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-400/30"
                  placeholder="you@company.com"
                  onChange={handleChange}
                />

                <label className="block text-sm text-slate-100">
                  Password
                </label>
                <input
                  name="password"
                  value={form.password}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-slate-900 focus:ring-2 focus:ring-cyan-400/30"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                />

                <button
                  onClick={handleLogin}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-cyan-400 via-sky-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] hover:shadow-cyan-400/30"
                >
                  Login
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-slate-200/85">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-semibold text-cyan-200 hover:text-white"
                >
                  Create an account
                </button>
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}