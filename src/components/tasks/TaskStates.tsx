import { AlertCircle, Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

const bone = "block animate-pulse rounded-pill bg-muted";

export function TaskSkeleton() {
  return (
    <div
      aria-hidden
      className="flex min-h-28 items-center justify-between gap-6 rounded-card border border-border bg-card p-5 shadow-panel"
    >
      <div className="grid flex-1 gap-2">
        <span className={`${bone} h-4 w-[46%]`} />
        <span className={`${bone} h-3 w-[86%]`} />
        <span className={`${bone} h-3 w-[62%]`} />
      </div>
      <span className={`${bone} h-6 w-16`} />
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div role="status" aria-label="Loading tasks" className="grid gap-3">
      <TaskSkeleton />
      <TaskSkeleton />
      <TaskSkeleton />
    </div>
  );
}

export function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center rounded-card border border-border bg-card px-6 py-12 text-center shadow-panel">
      <div className="mb-4 flex size-12 items-center justify-center rounded-control bg-accent text-accent-foreground">
        <Inbox aria-hidden className="size-6" />
      </div>
      <h2 className="text-base font-bold">No tasks yet</h2>
      <p className="mb-5 mt-1 max-w-90 text-sm text-muted-foreground">
        Create a task to keep your work organized and moving forward.
      </p>
      {onCreate && (
        <Button icon={Plus} onClick={onCreate}>
          Create your first task
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Couldn't load your tasks",
  message = "Check your connection and try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center gap-4 rounded-card border border-destructive bg-error-muted p-5 max-sm:flex-wrap max-sm:items-start"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-control bg-card text-t1-red-700">
        <AlertCircle aria-hidden className="size-4.5" />
      </div>
      <div className="flex-1">
        <h2 className="text-base font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button variant="secondary" onClick={onRetry} className="max-sm:w-full">
        Try again
      </Button>
    </div>
  );
}
