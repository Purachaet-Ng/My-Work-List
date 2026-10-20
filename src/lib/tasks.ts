// Task types + input validation. Kept free of imports so `node --test` can load it directly.

export const TASK_STATUSES = ["todo", "doing", "done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type TaskInput = { title: string; description: string | null; status?: TaskStatus };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: unknown): v is string => typeof v === "string" && UUID_RE.test(v);

export const isTaskStatus = (v: unknown): v is TaskStatus =>
  typeof v === "string" && (TASK_STATUSES as readonly string[]).includes(v);

/** Mirrors the DB check constraints in 0001_tasks.sql so users get a clear message. */
export function validateTask(raw: {
  title: unknown;
  description?: unknown;
  status?: unknown;
}): { ok: true; value: TaskInput } | { ok: false; error: string } {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return { ok: false, error: "Title is required." };
  if (title.length > 200) return { ok: false, error: "Title must be 200 characters or fewer." };

  const desc = typeof raw.description === "string" ? raw.description.trim() : "";
  if (desc.length > 2000) return { ok: false, error: "Description must be 2000 characters or fewer." };

  const value: TaskInput = { title, description: desc || null };
  if (raw.status !== undefined && raw.status !== null) {
    if (!isTaskStatus(raw.status)) return { ok: false, error: "Invalid status." };
    value.status = raw.status;
  }
  return { ok: true, value };
}
