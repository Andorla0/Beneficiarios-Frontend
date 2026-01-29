import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-800">{label}</div> : null}
      <input
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
          error ? "border-rose-300 focus:ring-2 focus:ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-slate-200",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-xs font-medium text-rose-600">{error}</div>
      ) : hint ? (
        <div className="mt-1 text-xs text-slate-500">{hint}</div>
      ) : null}
    </label>
  );
}
