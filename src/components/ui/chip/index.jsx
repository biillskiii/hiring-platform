"use client";
import clsx from "clsx";

export default function Chip({ label, variant = "primary" }) {
  return (
    <a
      className={clsx(
        " h-[32ppx] rounded-lg flex items-center justify-center cursor-default gap-1 px-3 py-1 border text-sm capitalize",
        {
          "border-primary-border bg-primary-surface text-primary-main":
            variant === "primary",
          "border-secondary-border bg-primary-surface text-secondary-main":
            variant === "secondary",
          "border-danger-border bg-danger-surface text-danger-main":
            variant === "danger",
          "border-neutral-40 bg-transparent text-neutral-90 ":
            variant === "tertiary",
        }
      )}
    >
      {label}
    </a>
  );
}
