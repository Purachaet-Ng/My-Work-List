import { Loader2, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

// Delete uses red-700, not --destructive: white on #EF4444 fails WCAG AA (see plan.md decisions).
const variants = {
  primary: "border-transparent bg-primary text-primary-foreground hover:bg-accent-foreground",
  secondary: "border-input bg-card text-foreground hover:border-muted-foreground hover:bg-background",
  ghost: "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
  destructive:
    "border-transparent bg-t1-red-700 text-destructive-foreground hover:border-t1-red-700 hover:bg-error-muted hover:text-t1-red-700",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  loading?: boolean;
  icon?: LucideIcon;
};

export function Button({
  variant = "primary",
  loading = false,
  icon: Icon,
  className = "",
  disabled,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-control border px-4 py-2.5 text-sm font-semibold transition-colors ${focusRing} ${variants[variant]} disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-t1-gray-500 ${className}`}
      {...rest}
    >
      {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : Icon ? <Icon aria-hidden className="size-4" /> : null}
      {children}
    </button>
  );
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  /** Tooltip text; also the accessible name unless `aria-label` is passed. */
  label: string;
  danger?: boolean;
};

export function IconButton({ icon: Icon, label, danger = false, className = "", ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`group relative inline-flex size-11 items-center justify-center rounded-control text-muted-foreground transition-colors ${focusRing} ${
        danger ? "hover:bg-error-muted hover:text-t1-red-700" : "hover:bg-muted hover:text-foreground"
      } ${className}`}
      {...rest}
    >
      <Icon aria-hidden className="size-4.5" />
      {/* Shown on keyboard focus too, not only hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2 py-1.5 text-xs text-card group-hover:block group-focus-visible:block"
      >
        {label}
      </span>
    </button>
  );
}
