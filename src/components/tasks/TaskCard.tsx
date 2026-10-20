import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Task, TaskStatus } from "@/lib/tasks";
import { IconButton, focusRing } from "@/components/ui/Button";
import { StatusSelect } from "@/components/ui/Status";

/** Presentational: the parent wires status/edit/delete to server actions. */
export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  statusPending,
}: {
  task: Task;
  onStatusChange: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  statusPending?: boolean;
}) {
  return (
    <article className="flex min-h-28 items-center justify-between gap-6 rounded-card border border-border bg-card p-5 shadow-panel max-md:flex-col max-md:items-stretch max-md:gap-4 max-md:p-4">
      <Link href={`/tasks/${task.id}`} className={`grid min-w-0 flex-1 gap-1 rounded-lg ${focusRing}`}>
        <span className="truncate text-sm font-semibold">{task.title}</span>
        {task.description && <span className="line-clamp-2 text-xs text-muted-foreground">{task.description}</span>}
      </Link>
      <div className="flex items-center justify-between gap-2">
        <StatusSelect
          value={task.status}
          onChange={onStatusChange}
          disabled={statusPending}
          label={`Status of "${task.title}"`}
        />
        <div className="flex items-center gap-2">
          <IconButton icon={Pencil} label="Edit task" aria-label={`Edit task "${task.title}"`} onClick={onEdit} />
          <IconButton
            icon={Trash2}
            label="Delete task"
            aria-label={`Delete task "${task.title}"`}
            danger
            onClick={onDelete}
          />
        </div>
      </div>
    </article>
  );
}
