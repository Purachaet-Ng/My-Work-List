import { AlertCircle, Check, X } from "lucide-react";
import type { ReactNode } from "react";
import { IconButton } from "./Button";

export function Banner({ kind = "error", children }: { kind?: "error" | "success"; children: ReactNode }) {
  const Icon = kind === "error" ? AlertCircle : Check;
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-control p-3 text-xs ${
        kind === "error" ? "bg-error-muted text-t1-red-700" : "bg-success-muted text-t1-green-700"
      }`}
    >
      <Icon aria-hidden className="size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

export function Toast({
  kind,
  children,
  onDismiss,
}: {
  kind: "success" | "error";
  children: ReactNode;
  onDismiss?: () => void;
}) {
  const Icon = kind === "success" ? Check : AlertCircle;
  return (
    <div
      role="status"
      className="flex min-h-14 items-center gap-2.5 rounded-control border border-border bg-card py-1.5 pl-3.5 pr-2 text-sm font-semibold shadow-panel"
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-pill ${
          kind === "success" ? "bg-success-muted text-t1-green-700" : "bg-error-muted text-t1-red-700"
        }`}
      >
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="flex-1">{children}</span>
      {onDismiss && <IconButton icon={X} label="Dismiss" onClick={onDismiss} />}
    </div>
  );
}
