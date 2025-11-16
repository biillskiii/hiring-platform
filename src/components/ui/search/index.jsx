import React from "react";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const VARIANTS = {
  focused: "border-primary-main ring-1 ring-primary-main",
  error: "border-danger-main",
  default: "border-neutral-50",
};

export default function SearchInput({
  placeholder = "Cari...",
  value,
  onChange,
  onSearch,
  error = false,
  disabled = false,
  className, // <- tambahin biar bisa custom class dari luar
  ...props
}) {
  const baseClasses =
    "w-full h-11 py-2 text-sm rounded-lg transition-all duration-150 outline-none";

  const inputClasses = clsx(
    baseClasses,
    "pl-4 pr-10", // ruang buat icon
    "text-neutral-90 placeholder-neutral-50 border",
    {
      [VARIANTS.error]: error,
      "bg-neutral-30 text-neutral-60 cursor-not-allowed": disabled,
      "bg-neutral-10": !error && !disabled,
      [VARIANTS.default]: !error && !disabled,
      "focus:border-primary-main focus:ring-1 focus:ring-primary-main":
        !error && !disabled,
    }
  );

  const iconColor = disabled
    ? "text-neutral-60"
    : error
    ? "text-danger-main"
    : "text-neutral-50";

  return (
    <div className={clsx("relative w-full", className)}>
      {/* Input field */}
      <input
        type="search"
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />

      {/* Tombol Search */}
      <button
        type="button"
        onClick={onSearch}
        disabled={disabled}
        className={clsx(
          "absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center",
          "w-7 h-7 rounded-md transition-all duration-150",
          "hover:bg-neutral-20",
          { "cursor-not-allowed opacity-60": disabled }
        )}
      >
        <MagnifyingGlassIcon className={clsx("w-5 h-5", iconColor)} />
      </button>
    </div>
  );
}
