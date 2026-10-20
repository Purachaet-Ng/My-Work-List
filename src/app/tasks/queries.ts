import { createClient } from "@/lib/supabase/server";
import { isUuid, type Task } from "@/lib/tasks";

const COLUMNS = "id, title, description, status, created_at, updated_at";

/** The current user's tasks, newest first. RLS limits rows to the owner. Throws so error.tsx can retry. */
export async function listTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select(COLUMNS).order("created_at", { ascending: false });
  if (error) throw new Error("Could not load tasks.", { cause: error });
  return data as Task[];
}

/** One task, or null if it doesn't exist or belongs to someone else (RLS hides it). */
export async function getTask(id: string): Promise<Task | null> {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("tasks").select(COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error("Could not load the task.", { cause: error });
  return data as Task | null;
}
