import clsx from "clsx";

export default function Button({
  type = "button",
  label,
  onClick,
  size = "full",
  variant = "primary",
  leftIcon,
  rightIcon,
  disabled = false,
}) {
  const baseStyle = {
    baseButton: [
      "flex",
      "items-center",
      "justify-center",
      "gap-2",
      "transition-colors",
      "duration-200",
      "shadow-button",
      "rounded-[8px]",
      "text-sm",
      "font-bold",
      "px-4",
      "cursor-pointer",
    ],
  };

  const sizeStyles = {
    full: "w-full h-11",
    big: "h-[40px] px-6",
    small: "h-[32px] px-4",
    "very-small": "h-[28px] px-3",
  };

  const variantStyles = {
    primary: "bg-primary-main text-white cursor-pointer",
    secondary: "bg-secondary-main text-white cursor-pointer",
    tertiary:
      "bg-neutral-10 border-2 border-neutral-40 text-black cursor-pointer",
    disabled: "bg-neutral-40 text-neutral-60 cursor-not-allowed",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        baseStyle.baseButton,
        sizeStyles[size],
        variantStyles[variant]
      )}
    >
      {leftIcon && <span className="icon-left">{leftIcon}</span>}
      {label}
      {rightIcon && <span className="icon-right">{rightIcon}</span>}
    </button>
  );
}
