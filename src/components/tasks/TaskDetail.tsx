"use client";

import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTask } from "@/app/tasks/actions";
import type { Task } from "@/lib/tasks";
import { Button, focusRing } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { StatusBadge } from "@/components/ui/Status";
import { useToast } from "@/components/ui/useToast";
import { TaskFormDialog } from "./TaskFormDialog";

// 24h, viewer's own timezone (DS-12). Server renders UTC, so the <time> elements skip the hydration warning.
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", hourCycle: "h23" }).format(new Date(iso));

export function TaskDetail({ task }: { task: Task }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, startDelete] = useTransition();
  const [toast, showToast] = useToast();

  const confirmDelete = () =>
    startDelete(async () => {
      const result = await deleteTask(task.id);
      if (result.error) {
        setConfirming(false);
        showToast({ kind: "error", text: result.error });
      } else {
        router.replace("/tasks");
      }
    });

  return (
    <>
      <Link
        href="/tasks"
        className={`mb-4 inline-flex items-center gap-1 rounded-sm p-1 text-sm font-semibold text-accent-foreground ${focusRing}`}
      >
        <ChevronLeft aria-hidden className="size-4" />
        Back to tasks
      </Link>

      <article className="rounded-card border border-border bg-card p-8 shadow-panel max-sm:p-5">
        <div className="flex items-start justify-between gap-6 border-b border-border pb-7 max-sm:flex-col">
          <div className="min-w-0">
            <StatusBadge status={task.status} />
            <h1 className="mt-3 break-words text-2xl font-bold">{task.title}</h1>
          </div>
          <div className="flex gap-2 max-sm:grid max-sm:w-full max-sm:grid-cols-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="destructive" icon={Trash2} onClick={() => setConfirming(true)}>
              Delete
            </Button>
          </div>
        </div>

        <div className="min-h-45 py-7">
          <h2 className="text-base font-bold">Description</h2>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
            {task.description || "No description provided."}
          </p>
        </div>

        <dl className="flex gap-10 border-t border-border pt-5 text-xs max-sm:flex-col max-sm:gap-4">
          <div className="grid gap-0.5">
            <dt className="text-muted-foreground">Created</dt>
            <dd className="font-semibold">
              <time dateTime={task.created_at} suppressHydrationWarning>
                {formatDate(task.created_at)}
              </time>
            </dd>
          </div>
          <div className="grid gap-0.5">
            <dt className="text-muted-foreground">Last updated</dt>
            <dd className="font-semibold">
              <time dateTime={task.updated_at} suppressHydrationWarning>
                {formatDate(task.updated_at)}
              </time>
            </dd>
          </div>
        </dl>
      </article>

      {editing && (
        <TaskFormDialog
          task={task}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            showToast({ kind: "success", text: "Task saved" });
          }}
        />
      )}
      <ConfirmDialog
        open={confirming}
        title="Delete this task?"
        pending={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={confirmDelete}
      >
        &ldquo;{task.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
      </ConfirmDialog>
      {toast}
    </>
  );
}
