import React from "react";
import clsx from "clsx";

// Definisikan batas maksimum karakter
const MAX_LENGTH = 100;

// Definisikan warna yang digunakan (sesuai dengan config Tailwind Anda)
const VARIANTS = {
  focused: "border-primary-main ring-1 ring-primary-main",
  error: "border-danger-main",
  default: "border-neutral-50",
};

export default function TextArea({
  label,
  placeholder = "Placeholder",
  value,
  onChange,
  helperText,
  error = false,
  disabled = false,
  required = false,
  maxLength = MAX_LENGTH, // Gunakan batas max length default 100
  ...props
}) {
  const isFilled = value && value.length > 0;
  const charCount = value ? value.length : 0;
  const isOverLimit = charCount > maxLength;

  // 1. Tentukan Class Input Utama
  const baseClasses =
    "w-full px-4 py-2 text-sm rounded-lg transition-all duration-150 outline-none resize-none min-h-[120px]";

  const borderClasses = clsx("border", {
    // Prioritas Error (baik karena prop error atau melebihi batas)
    [VARIANTS.error]: error || isOverLimit,

    // Prioritas Disabled
    "bg-neutral-30 text-neutral-60 cursor-not-allowed": disabled,

    // Default (jika tidak ada error/disabled)
    "bg-neutral-10": !error && !disabled,
    [VARIANTS.default]: !error && !disabled,

    // Custom focus state dari desain (border teal/primary-main)
    "focus:border-primary-main focus:ring-1 focus:ring-primary-main":
      !error && !disabled,
    "focus:border-danger-main focus:ring-1 focus:ring-danger-main":
      error || isOverLimit,
  });

  // 2. Tentukan Class untuk Teks Bawah (Helper/Error Message)
  const labelClasses = clsx("text-sm font-medium mb-1", {
    "text-danger-main": error || isOverLimit,
    "text-neutral-70": !error && !isOverLimit, // Warna label default
    "text-neutral-60": disabled,
  });

  const bottomTextClasses = clsx("text-xs mt-1 ml-1 flex justify-between", {
    "text-danger-main": error || isOverLimit,
    "text-neutral-70": !error && !disabled && !isOverLimit,
    "text-neutral-60": disabled,
  });

  return (
    <div className="mb-4">
      {/* Label */}
      <label className={labelClasses}>
        {label}
        {required && <span className="text-danger-main ml-0.5">*</span>}
      </label>

      {/* Text Area Field */}
      <textarea
        className={clsx(baseClasses, borderClasses)}
        placeholder={!isFilled ? placeholder : undefined}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        rows={4} // Default tinggi baris
        {...props}
      />

      {/* Helper / Error Message dan Hitungan Karakter */}
      <div className={bottomTextClasses}>
        <p>
          {/* Prioritaskan pesan error jika ada */}
          {error || isOverLimit
            ? error || `Melebihi batas ${maxLength} karakter`
            : helperText}
        </p>

        {/* Hitungan Karakter */}
        <span className={clsx({ "text-danger-main": isOverLimit })}>
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}
