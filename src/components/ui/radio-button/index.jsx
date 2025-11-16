"use client";
import React from "react";

export default function RadioButton({ name, value, onChange, options = [] }) {
  return (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option} className="cursor-pointer flex items-center gap-2">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className={`
              appearance-none h-5 w-5 border-2 border-neutral-50 rounded-full
              checked:border-[6px] checked:border-primary-main
              transition-all duration-150
              cursor-pointer
            `}
          />
          <span className="text-neutral-90">{option}</span>
        </label>
      ))}
    </div>
  );
}
