"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./Button";

/** Native <dialog>: focus trap and Esc for free. Cancel gets initial focus so Enter never deletes by accident. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = "Delete",
  pendingLabel = "Deleting…",
  pending = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-105 rounded-card border border-border bg-card p-6 text-foreground shadow-panel backdrop:bg-foreground/40 max-sm:mb-0 max-sm:w-full max-sm:max-w-none max-sm:rounded-b-none"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-control bg-error-muted text-t1-red-700">
        <Trash2 aria-hidden className="size-4.5" />
      </div>
      <h2 id={titleId} className="text-base font-bold">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
      <div className="mt-6 flex justify-end gap-2 max-sm:[&>*]:flex-1">
        <Button variant="secondary" autoFocus disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" loading={pending} onClick={onConfirm}>
          {pending ? pendingLabel : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
