"use client";

import { Plus } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { deleteTask, updateTaskStatus } from "@/app/tasks/actions";
import { TASK_STATUSES, type Task, type TaskStatus } from "@/lib/tasks";
import { Button, focusRing } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { STATUS_LABEL } from "@/components/ui/Status";
import { useToast } from "@/components/ui/useToast";
import { TaskCard } from "./TaskCard";
import { TaskFormDialog } from "./TaskFormDialog";
import { EmptyState } from "./TaskStates";

type Filter = "all" | TaskStatus;

export function TaskList({ tasks }: { tasks: Task[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState<Task | "new" | null>(null);
  const [toDelete, setToDelete] = useState<Task | null>(null);
  const [deleting, startDelete] = useTransition();
  const [, startStatus] = useTransition();
  const [toast, showToast] = useToast();
  // Status changes show instantly; the server render replaces this once the action revalidates.
  const [shown, setOptimistic] = useOptimistic(tasks, (state, { id, status }: { id: string; status: TaskStatus }) =>
    state.map((t) => (t.id === id ? { ...t, status } : t)),
  );

  const visible = filter === "all" ? shown : shown.filter((t) => t.status === filter);

  const changeStatus = (task: Task, status: TaskStatus) =>
    startStatus(async () => {
      setOptimistic({ id: task.id, status });
      const result = await updateTaskStatus(task.id, status);
      if (result.error) showToast({ kind: "error", text: result.error });
    });

  const confirmDelete = () =>
    startDelete(async () => {
      if (!toDelete) return;
      const result = await deleteTask(toDelete.id);
      setToDelete(null);
      showToast(result.error ? { kind: "error", text: result.error } : { kind: "success", text: "Task deleted" });
    });

  return (
    <>
      <div className="mb-6 flex items-end justify-between max-sm:items-center">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">Workspace</p>
          <h1 className="text-page-title font-bold">My tasks</h1>
        </div>
        <Button icon={Plus} onClick={() => setForm("new")} className="max-sm:px-3">
          New task
        </Button>
      </div>

      {tasks.length > 0 && (
        <div
          role="group"
          aria-label="Filter tasks"
          className="mb-4 inline-flex gap-1 rounded-control bg-muted p-1 max-md:grid max-md:w-full max-md:grid-cols-4"
        >
          {(["all", ...TASK_STATUSES] as const).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`min-h-9 rounded-md px-3.5 py-2 text-xs font-semibold max-md:min-h-11 ${focusRing} ${
                filter === f ? "bg-card text-foreground shadow-panel" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-3">
        {visible.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={(status) => changeStatus(task, status)}
            onEdit={() => setForm(task)}
            onDelete={() => setToDelete(task)}
          />
        ))}
        {tasks.length === 0 && <EmptyState onCreate={() => setForm("new")} />}
        {tasks.length > 0 && visible.length === 0 && (
          <p className="rounded-card border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No {STATUS_LABEL[filter as TaskStatus].toLowerCase()} tasks.
          </p>
        )}
      </div>

      {form && (
        <TaskFormDialog
          key={form === "new" ? "new" : form.id}
          task={form === "new" ? undefined : form}
          onClose={() => setForm(null)}
          onSaved={() => {
            setForm(null);
            showToast({ kind: "success", text: "Task saved" });
          }}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        title="Delete this task?"
        pending={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      >
        &ldquo;{toDelete?.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
      </ConfirmDialog>
      {toast}
    </>
  );
}
