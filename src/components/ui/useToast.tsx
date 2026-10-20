"use client";

import { useEffect, useState } from "react";
import { Toast } from "./Feedback";

type ToastState = { kind: "success" | "error"; text: string } | null;

/** Returns [toast element to render, show function]. Auto-dismisses after 4s. */
export function useToast() {
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const node = toast && (
    <div className="fixed bottom-6 right-6 z-50 w-95 max-sm:inset-x-4 max-sm:w-auto">
      <Toast kind={toast.kind} onDismiss={() => setToast(null)}>
        {toast.text}
      </Toast>
    </div>
  );
  return [node, setToast] as const;
}
