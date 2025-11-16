"use client";
import { useState, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function Checkbox({ label, defaultChecked = false }) {
  const [checked, setChecked] = useState(defaultChecked);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Hindari render dari server biar gak mismatch

  return (
    <label className="flex items-center gap-2 relative select-none">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => setChecked(!checked)}
          className="appearance-none h-5 w-5 border-2 border-neutral-50 rounded-full
            checked:bg-primary-main checked:border-primary-main transition-all cursor-pointer"
        />
        {checked && (
          <CheckIcon className="absolute top-1/2 left-1/2 w-3 h-3 text-white -translate-x-1/2 -translate-y-2 pointer-events-none" />
        )}
      </div>
      {label && <span className="text-neutral-90 text-sm">{label}</span>}
    </label>
  );
}
