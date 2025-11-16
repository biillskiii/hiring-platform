import clsx from "clsx";

export default function Tag({ label, color = "success" }) {
  const styles = {
    success: "bg-success-surface text-success-main border-success-border",
    danger: "bg-danger-surface text-danger-main border-danger-border",
    warning: "bg-warning-surface text-warning-main border-warning-border",
    primary: "bg-primary-surface text-primary-main border-primary-border",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium",
        styles[color]
      )}
    >
      🏷️ {label}
    </span>
  );
}
