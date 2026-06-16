"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

type Employee = {
  id: number;
  name: string;
  department: string;
  salary: string;
};

type FormState = {
  employees: Employee[];
  name: string;
  department: string;
  salary: string;
  editId: number | null;
};

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  const [role, setRole] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    employees: [],
    name: "",
    department: "",
    salary: "",
    editId: null,
  });

  const setField = (key: keyof FormState, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

const fetchEmployees = async () => {
  try {
    const res = await api.get("/employee");
    console.log("EMPLOYEES =>", res.data);

    setField("employees", res.data || []);
  } catch (err) {
    console.log(err);
  }
};

  useEffect(() => {
    if (mounted) {
      fetchEmployees();
    }
  }, [mounted]);

  const handleAdd = async () => {
    try {
      await api.post("/employee", {
        name: form.name,
        department: form.department,
        salary: form.salary,
      });

      setForm((prev) => ({
        ...prev,
        name: "",
        department: "",
        salary: "",
      }));

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/employee/${id}`);
      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm((prev) => ({
      ...prev,
      editId: emp.id,
      name: emp.name,
      department: emp.department,
      salary: emp.salary,
    }));
  };

  const handleUpdate = async () => {
    try {
      await api.patch(`/employee/${form.editId}`, {
        name: form.name,
        department: form.department,
        salary: form.salary,
      });

      setForm((prev) => ({
        ...prev,
        editId: null,
        name: "",
        department: "",
        salary: "",
      }));

      fetchEmployees();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#eff6ff_0%,#f8fbff_45%,#edf2f7_100%)] text-slate-900">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        
        <header className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/80 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
                Dashboard
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Employee overview
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                A clean, production-ready view for managing team data, with responsive cards and a polished table.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Role: {role || "Guest"}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total employees", value: form.employees.length },
              {
                label: "Department entries",
                value: new Set(form.employees.map((emp) => emp.department)).size,
              },
              { label: "Access level", value: role || "User" },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value}
                </p>
              </article>
            ))}
          </div>
        </header>

        {/* MAIN */}
        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          
     
          <article className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/80 backdrop-blur sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
                  Employee form
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  {form.editId ? "Update employee" : "Add a new employee"}
                </h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {form.editId ? "Editing" : "Ready"}
              </span>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-1 text-sm text-slate-700">
                Full name
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Department
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  value={form.department}
                  onChange={(e) => setField("department", e.target.value)}
                />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Salary
                <input
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                  value={form.salary}
                  onChange={(e) => setField("salary", e.target.value)}
                />
              </label>

              <button
                onClick={form.editId ? handleUpdate : handleAdd}
                className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-emerald-500 to-lime-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] hover:shadow-emerald-400/30"
              >
                {form.editId ? "Update employee" : "Add employee"}
              </button>
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-200/80 backdrop-blur sm:p-8">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-700">
                  Employee list
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">
                  Current team
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Salary</th>
                    {role === "admin" &&(
                    <th className="px-4 py-3 font-semibold text-right">
                      Actions
                    </th>)}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {form.employees.length === 0 ? (
                    <tr>
                      <td colSpan={role === "admin" ? 4 : 3} className="px-4 py-6 text-center text-slate-500">
                        No employee records yet.
                      </td>
                    </tr>
                  ) : (
                    form.employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {emp.name}
                        </td>
                        <td className="px-4 py-3">{emp.department}</td>
                        <td className="px-4 py-3">{emp.salary}</td>
                        <td className="px-4 py-3 text-right">
                          {role === "admin" && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(emp)}
                                className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

        </section>
      </section>
    </main>
  );
}