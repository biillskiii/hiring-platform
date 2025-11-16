"use client";
import React from "react";
import clsx from "clsx";

// Variants untuk border
const BORDER_VARIANTS = {
  focused: "border-primary-main ring-1 ring-primary-main",
  error: "border-danger-main",
  default: "border-neutral-50",
};

// Variants untuk bottom text (helper / error / success / disabled)
const BOTTOM_TEXT_VARIANTS = {
  error: "text-danger-main",
  helper: "text-neutral-70",
  disabled: "text-neutral-60",
  success: "text-success-main",
};

export default function TextInput({
  label,
  placeholder = "Placeholder",
  value,
  onChange,
  helperText,
  error = "", // bisa string atau false
  success = "", // opsional, jika ingin variant success
  disabled = false,
  required = false,
  ...props
}) {
  const isFilled = value && value.length > 0;

  // Tentukan kelas border
  const borderClasses = clsx(
    "border rounded-lg px-4 py-2 w-full h-11 text-sm transition-all duration-150 outline-none",
    {
      [BORDER_VARIANTS.error]: error,
      [BORDER_VARIANTS.default]: !error && !disabled,
      "bg-neutral-30 text-neutral-60 cursor-not-allowed": disabled,
      "bg-neutral-10": !error && !disabled,
    }
  );

  // Label classes
  const labelClasses = clsx("text-sm font-medium mb-1 block", {
    "text-danger-main": error,
    "text-neutral-70": !error && !disabled,
    "text-neutral-60": disabled,
  });

  // Bottom text classes
  let bottomVariant = "helper";
  if (disabled) bottomVariant = "disabled";
  else if (error) bottomVariant = "error";
  else if (success) bottomVariant = "success";

  const bottomTextClasses = clsx(
    "text-xs mt-1 ml-1",
    BOTTOM_TEXT_VARIANTS[bottomVariant]
  );

  return (
    <div className="mb-4">
      {/* Label */}
      <label className={labelClasses}>
        {label}
        {required && <span className="text-danger-main ml-0.5">*</span>}
      </label>

      {/* Input */}
      <input
        type="text"
        className={clsx(
          borderClasses,
          "focus:border-primary-main focus:ring-1 focus:ring-primary-main"
        )}
        placeholder={!isFilled ? placeholder : undefined}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        {...props}
      />

      {/* Bottom Text */}
      {(helperText || error || success) && (
        <p className={bottomTextClasses}>{error || success || helperText}</p>
      )}
    </div>
  );
}
