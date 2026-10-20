"use client";

// Design-system showcase, mirroring the "Components" page of the Figma Make design (AC-09 evidence).
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Task } from "@/lib/tasks";
import { Button, IconButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Banner, Toast } from "@/components/ui/Feedback";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { StatusBadge, StatusOptions } from "@/components/ui/Status";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { EmptyState, ErrorState, TaskSkeleton } from "@/components/tasks/TaskStates";

const sample: Task = {
  id: "00000000-0000-4000-8000-000000000000",
  title: "Prepare the weekly project update",
  description: "Summarize progress, open decisions, and next steps for the Friday team review.",
  status: "doing",
  created_at: "2026-10-19T09:32:00Z",
  updated_at: "2026-10-20T10:14:00Z",
};

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <div className="mb-5 flex items-baseline justify-between max-sm:flex-col max-sm:gap-1">
        <h2 className="text-base font-bold">{title}</h2>
        {note && <span className="text-xs text-muted-foreground">{note}</span>}
      </div>
      {children}
    </section>
  );
}

export default function ComponentsPage() {
  const [task, setTask] = useState(sample);
  const [form, setForm] = useState<"new" | "edit" | null>(null);
  const [confirming, setConfirming] = useState(false);

  return (
    <main className="mx-auto max-w-250 px-4 py-12">
      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">Design system</p>
      <h1 className="text-page-title font-bold">Components</h1>
      <p className="mb-10 mt-1 text-sm text-muted-foreground">
        Reusable foundations for a clear, calm task management experience.
      </p>

      <Section title="Buttons" note="Four variants, plus disabled and loading">
        <div className="flex flex-wrap items-center gap-2">
          <Button icon={Plus} onClick={() => setForm("new")}>New task</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Saving…</Button>
        </div>
      </Section>

      <Section title="Fields" note="Inputs, textarea, and select">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id="demo-default" label="Default" placeholder="Enter a value" />
          <TextField id="demo-hint" label="With hint" placeholder="Enter your password" hint="At least 8 characters" />
          <TextField id="demo-error" label="Error" defaultValue="Incorrect value" error="This field has an error" />
          <TextField id="demo-disabled" label="Disabled" defaultValue="Unavailable" disabled />
          <TextAreaField id="demo-textarea" label="Textarea" placeholder="Add details…" />
          <SelectField id="demo-select" label="Status" defaultValue="doing">
            <StatusOptions />
          </SelectField>
        </div>
      </Section>

      <Section title="Status chips" note="Always paired with a label">
        <div className="flex gap-2">
          <StatusBadge status="todo" />
          <StatusBadge status="doing" />
          <StatusBadge status="done" />
        </div>
      </Section>

      <Section title="Task card" note="Responsive content and controls">
        <TaskCard
          task={task}
          onStatusChange={(status) => setTask({ ...task, status })}
          onEdit={() => setForm("edit")}
          onDelete={() => setConfirming(true)}
        />
      </Section>

      <div className="grid gap-8 md:grid-cols-2">
        <Section title="Icon buttons">
          <div className="flex gap-2">
            <IconButton icon={Pencil} label="Edit task" />
            <IconButton icon={Trash2} label="Delete task" danger />
            <IconButton icon={X} label="Close" />
          </div>
        </Section>
        <Section title="Skeleton">
          <TaskSkeleton />
        </Section>
      </div>

      <Section title="Empty and error states">
        <div className="grid gap-8 md:grid-cols-2">
          <EmptyState onCreate={() => setForm("new")} />
          <ErrorState onRetry={() => {}} />
        </div>
      </Section>

      <Section title="Banners and toasts">
        <div className="grid max-w-95 gap-3">
          <Banner>Incorrect email or password</Banner>
          <Banner kind="success">Account created</Banner>
          <Toast kind="success" onDismiss={() => {}}>Task saved</Toast>
          <Toast kind="error" onDismiss={() => {}}>Something went wrong. Try again.</Toast>
        </div>
      </Section>

      {form && (
        <TaskFormDialog
          key={form}
          task={form === "edit" ? task : undefined}
          onClose={() => setForm(null)}
          onSaved={() => setForm(null)}
        />
      )}
      <ConfirmDialog
        open={confirming}
        title="Delete this task?"
        onCancel={() => setConfirming(false)}
        onConfirm={() => setConfirming(false)}
      >
        &ldquo;{task.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
      </ConfirmDialog>
    </main>
  );
}
