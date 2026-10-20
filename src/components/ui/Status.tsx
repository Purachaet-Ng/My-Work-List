import { ChevronDown } from "lucide-react";
import { TASK_STATUSES, type TaskStatus } from "@/lib/tasks";
import { focusRing } from "./Button";

export const STATUS_LABEL: Record<TaskStatus, string> = { todo: "Todo", doing: "Doing", done: "Done" };

// Status tokens per plan.md: todo → muted, doing → in-progress, done → success (700 text for AA contrast).
const tone: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  doing: "bg-in-progress-muted text-t1-purple-700",
  done: "bg-success-muted text-t1-green-700",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex rounded-pill px-2.5 py-1 text-xs font-semibold ${tone[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatusOptions() {
  return TASK_STATUSES.map((s) => (
    <option key={s} value={s}>
      {STATUS_LABEL[s]}
    </option>
  ));
}

/** Pill-shaped select used inline on a task card. */
export function StatusSelect({
  value,
  onChange,
  disabled,
  label = "Change status",
}: {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <div className={`relative inline-flex rounded-pill ${tone[value]}`}>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as TaskStatus)}
        className={`min-h-9 min-w-26 appearance-none rounded-pill bg-transparent py-2 pl-3 pr-8 text-xs font-semibold disabled:cursor-wait ${focusRing}`}
      >
        <StatusOptions />
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2" />
    </div>
  );
}
