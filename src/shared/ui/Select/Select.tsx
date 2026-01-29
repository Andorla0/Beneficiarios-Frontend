import type { SelectHTMLAttributes } from "react";

export type SelectOption = { value: string; label: string };

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function Select({ label, error, options, placeholder = "Seleccionar...", className = "", ...props }: SelectProps) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-800">{label}</div> : null}
      <select
        className={[
          "w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
          error ? "border-rose-300 focus:ring-2 focus:ring-rose-200" : "border-slate-200 focus:ring-2 focus:ring-slate-200",
          className,
        ].join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <div className="mt-1 text-xs font-medium text-rose-600">{error}</div> : null}
    </label>
  );
}
