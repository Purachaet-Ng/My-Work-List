"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isTaskStatus, isUuid, validateTask } from "@/lib/tasks";

export type ActionResult = { ok?: true; error?: string };

const SESSION_EXPIRED = "Your session has expired. Please log in again.";
const NOT_FOUND = "Task not found. It may have been deleted.";
const FAILED = "Something went wrong. Please try again.";

// Actions are public POST endpoints: always check the session; RLS is the real boundary.
async function authedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error || !data.user ? null : supabase;
}

function fail(op: string, error: unknown): ActionResult {
  console.error(`[tasks] ${op} failed:`, error);
  return { error: FAILED };
}

function revalidate(id?: string) {
  revalidatePath("/tasks");
  if (id) revalidatePath(`/tasks/${id}`);
}

export async function createTask(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = validateTask({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  });
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await authedClient();
  if (!supabase) return { error: SESSION_EXPIRED };

  // owner_id comes from the DB default auth.uid(), never from the client.
  const { error } = await supabase.from("tasks").insert(parsed.value);
  if (error) return fail("create", error);

  revalidate();
  return { ok: true };
}

export async function updateTask(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = formData.get("id");
  if (!isUuid(id)) return { error: NOT_FOUND };
  const parsed = validateTask({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  });
  if (!parsed.ok) return { error: parsed.error };

  const supabase = await authedClient();
  if (!supabase) return { error: SESSION_EXPIRED };

  const { data, error } = await supabase.from("tasks").update(parsed.value).eq("id", id).select("id");
  if (error) return fail("update", error);
  if (!data.length) return { error: NOT_FOUND }; // RLS turns someone else's row into 0 rows

  revalidate(id);
  return { ok: true };
}

export async function updateTaskStatus(id: string, status: string): Promise<ActionResult> {
  if (!isUuid(id)) return { error: NOT_FOUND };
  if (!isTaskStatus(status)) return { error: "Invalid status." };

  const supabase = await authedClient();
  if (!supabase) return { error: SESSION_EXPIRED };

  const { data, error } = await supabase.from("tasks").update({ status }).eq("id", id).select("id");
  if (error) return fail("updateStatus", error);
  if (!data.length) return { error: NOT_FOUND };

  revalidate(id);
  return { ok: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  if (!isUuid(id)) return { error: NOT_FOUND };

  const supabase = await authedClient();
  if (!supabase) return { error: SESSION_EXPIRED };

  const { data, error } = await supabase.from("tasks").delete().eq("id", id).select("id");
  if (error) return fail("delete", error);
  if (!data.length) return { error: NOT_FOUND };

  revalidate(id);
  return { ok: true };
}
