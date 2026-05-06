// import React from "react";

interface DropdownSelectProps {
  //   label?: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
}

export default function DropdownSelect({
  //   label,
  value,
  onChange,
  options = ["load CSV file first"],
}: DropdownSelectProps) {
  return (
    <div className="flex flex-col gap-1 ml-4">
      {/* <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
        {label}
      </label> */}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        {/* <option value="" disabled>
          {"Select ID"}
        </option> */}
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
