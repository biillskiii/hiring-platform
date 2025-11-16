"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function Dropdown({
  options = [],
  value,
  onChange,
  label = "Dropdown",
  error,
  success,
  helperText,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex justify-between items-center w-full px-3 py-2 rounded-md bg-white text-sm text-neutral-90 border transition",
          {
            // Error state
            "border-danger-main ring-1 ring-danger-main": error,

            // Success state
            "border-success-main ring-1 ring-success-main": success && !error,

            // Default
            "border-neutral-40 hover:border-primary-main": !error && !success,
          }
        )}
      >
        {value || label}
        <ChevronDownIcon width={15} />
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 border border-neutral-30 rounded-md bg-white shadow-modal">
          {options.map((opt, i) => (
            <li
              key={i}
              onClick={() => {
                onChange(opt.label);
                setOpen(false);
              }}
              className={clsx(
                "px-3 py-2 cursor-pointer text-neutral-90 hover:bg-primary-surface hover:text-primary-main",
                value === opt.label && "bg-primary-surface text-primary-main"
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}

      {/* Helper / Error / Success Text */}
      {helperText && !error && !success && (
        <p className="text-xs text-neutral-70 mt-1">{helperText}</p>
      )}
      {error && <p className="text-xs text-danger-main mt-1">{error}</p>}
      {success && !error && (
        <p className="text-xs text-success-main mt-1">{success}</p>
      )}
    </div>
  );
}
