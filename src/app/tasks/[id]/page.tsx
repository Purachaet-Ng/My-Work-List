import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { getTask } from "../queries";

export const metadata: Metadata = { title: "Task · My Work List" };

export default async function TaskPage({ params }: PageProps<"/tasks/[id]">) {
  const { id } = await params;
  // null for a bad id, a deleted task, or someone else's task (RLS hides it): all look the same to the user.
  const task = await getTask(id);
  if (!task) notFound();
  return <TaskDetail task={task} />;
}
