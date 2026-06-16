"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type FormState = {
  email: string;
  password: string;
  otp: string;
  role: "user" | "admin";
  step: "register" | "otp";
};

export default function Register() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    otp: "",
    role: "user",
    step: "register",
  });

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setForm((prev) => ({
        ...prev,
        step: "otp",
      }));

      setToast({
        type: "success",
        message: "OTP sent to email",
      });
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Register failed",
      });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });

      setToast({
        type: "success",
        message: "Account verified successfully",
      });

      setTimeout(() => router.push("/login"), 800);
    } catch (err: any) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || "Invalid OTP",
      });
    }
  };

  if (!mounted) return null;

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

      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col justify-between bg-[linear-gradient(160deg,#111827_0%,#1f2937_45%,#111827_100%)] p-8 text-slate-100 sm:p-10 lg:p-12">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-100">Create account</span>
              <div className="space-y-3">
                <h1 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create your account and verify it in one smooth flow.</h1>
                <p className="max-w-md text-sm text-slate-300 sm:text-base">Register, confirm the OTP, and continue with a clean, professional experience.</p>
              </div>
            </div>

            <div className="mt-10 space-y-3 text-sm text-slate-200">
              {[
                "Simple sign-up process",
                "OTP verification step",
                "Responsive design on all screens",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-sm shadow-black/10">{item}</div>
              ))}
            </div>
          </aside>

          <article className="flex items-center justify-center bg-slate-950/70 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
              <div className="mb-6 text-center sm:text-left">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-100/90">Register</p>
                <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{form.step === "register" ? "Create account" : "Verify OTP"}</h2>
                <p className="mt-2 text-sm text-slate-200/85">{form.step === "register" ? "Enter your email and password to start." : "Enter the OTP sent to your email address."}</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm text-slate-100">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-400/30"
                  onChange={handleChange}
                />

                {form.step === "register" ? (
                  <>
                    <label className="block text-sm text-slate-100">Password</label>
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      placeholder="Create a secure password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-400/30"
                      onChange={handleChange}
                    />
                    <label className="block text-sm text-slate-100">Role</label>
<select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100"
>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>

                    <button
                      onClick={handleRegister}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] hover:shadow-emerald-400/30"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <label className="block text-sm text-slate-100">OTP Code</label>
                    <input
                    name="otp"
                      value={form.otp}
                      placeholder="Enter the OTP sent to your email"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-slate-900 focus:ring-2 focus:ring-emerald-400/30"
                      onChange={handleChange}
                    />

                    <button
                      onClick={handleVerifyOtp}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-emerald-400 via-lime-300 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] hover:shadow-emerald-400/30"
                    >
                      Verify OTP
                    </button>
                  </>
                )}
              </div>

              <p className="mt-5 text-center text-sm text-slate-200/85">
                Already have an account? <button type="button" onClick={() => router.push("/login")} className="font-semibold text-emerald-200 hover:text-white">Sign in</button>
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}