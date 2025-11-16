"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export const countries = [
  {
    name: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    dial: "+62",
    placeholder: "81XXXXXXXXX",
  },
  {
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    dial: "+60",
    placeholder: "1XXXXXXXXX",
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    dial: "+65",
    placeholder: "8XXXXXXX",
  },
  {
    name: "Philippines",
    code: "PH",
    flag: "🇵🇭",
    dial: "+63",
    placeholder: "9XXXXXXXXX",
  },
];

const PhoneNumberInput = ({
  label,
  required = false,
  value,
  onChange,
  country,
  onCountryChange,
  error = false,
  success = false,
  disabled = false,
  helperText = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full space-y-2 relative" ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-neutral-70">
          {label}
          {required && <span className="text-danger-main ml-0.5">*</span>}
        </label>
      )}

      {/* WRAPPER */}
      <div
        className={`
          flex items-center border rounded-md bg-white overflow-visible relative transition-all
          ${disabled ? "bg-neutral-20 cursor-not-allowed opacity-60" : ""}
          ${
            error
              ? "border-danger-main"
              : success
              ? "border-success-main"
              : "border-neutral-40 focus-within:border-primary-main"
          }
        `}
      >
        {/* Country Dropdown */}
        <div className="relative w-24 border-r border-neutral-40">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between w-full px-3 py-2 text-sm focus:outline-none disabled:cursor-not-allowed"
          >
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <ChevronDownIcon className="w-4 h-4 text-neutral-60" />
            </span>
          </button>

          {showDropdown && !disabled && (
            <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-neutral-40 rounded-md shadow-lg z-20">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    onCountryChange(c);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-20 flex items-center gap-2 ${
                    c.code === country.code ? "bg-neutral-30" : ""
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dial code */}
        <div className="px-3 text-sm text-neutral-70 whitespace-nowrap">
          {country.dial}
        </div>

        {/* Phone input */}
        <input
          type="tel"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder={country.placeholder}
          className="flex-1 py-2 pr-3 text-sm outline-none bg-transparent text-neutral-90 placeholder-neutral-50 disabled:cursor-not-allowed"
        />
      </div>

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
};

export default PhoneNumberInput;
