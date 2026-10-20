"use client";

import { X } from "lucide-react";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { createTask, updateTask, type ActionResult } from "@/app/tasks/actions";
import type { Task, TaskStatus } from "@/lib/tasks";
import { Button, IconButton } from "@/components/ui/Button";
import { Banner } from "@/components/ui/Feedback";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { StatusOptions } from "@/components/ui/Status";

/**
 * New/edit task modal. Mount it with `key={task?.id ?? "new"}` so each open starts fresh.
 * Success is reported only after the server action returns ok.
 */
export function TaskFormDialog({
  task,
  onClose,
  onSaved,
}: {
  task?: Task;
  onClose: () => void;
  onSaved: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(task ? updateTask : createTask, {});
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [titleError, setTitleError] = useState<string>();

  useEffect(() => {
    // showModal() focuses the [autofocus] element; React's autoFocus prop doesn't render that attribute.
    ref.current?.querySelector("#task-title")?.setAttribute("autofocus", "");
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state, onSaved]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onClose();
      }}
      className="m-auto w-[calc(100%-3rem)] max-w-120 rounded-card border border-border bg-card text-foreground shadow-panel backdrop:bg-foreground/40 max-sm:h-full max-sm:max-h-none max-sm:w-full max-sm:max-w-none max-sm:rounded-none max-sm:border-0"
    >
      <form
        action={formAction}
        noValidate
        onSubmit={(e) => {
          if (!title.trim()) {
            e.preventDefault();
            setTitleError("Title is required");
            (e.currentTarget.elements.namedItem("title") as HTMLInputElement).focus();
          }
        }}
        className="flex h-full flex-col"
      >
        {task && <input type="hidden" name="id" value={task.id} />}

        <div className="flex items-start justify-between border-b border-border px-6 py-5 max-sm:p-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">
              {task ? "Update task" : "Add to your list"}
            </p>
            <h2 id={titleId} className="text-base font-bold">
              {task ? "Edit task" : "New task"}
            </h2>
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} disabled={pending} />
        </div>

        <div className="grid flex-1 content-start gap-5 overflow-y-auto p-6 max-sm:px-4 max-sm:py-5">
          {state.error && <Banner>{state.error}</Banner>}
          <TextField
            id="task-title"
            name="title"
            label="Title"
            placeholder="What needs to be done?"
            maxLength={200}
            counter={`${title.length}/200`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(undefined);
            }}
            error={titleError}
          />
          <TextAreaField
            id="task-description"
            name="description"
            label="Description (optional)"
            placeholder="Add any helpful details…"
            maxLength={2000}
            counter={`${description.length}/2000`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <SelectField id="task-status" name="status" label="Status" defaultValue={task?.status ?? ("todo" satisfies TaskStatus)}>
            <StatusOptions />
          </SelectField>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4 max-sm:px-4 max-sm:pb-5 max-sm:pt-3 max-sm:[&>*]:flex-1">
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            {pending ? "Saving…" : "Save task"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
