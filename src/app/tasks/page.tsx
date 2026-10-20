import type { Metadata } from "next";
import { TaskList } from "@/components/tasks/TaskList";
import { listTasks } from "./queries";

export const metadata: Metadata = { title: "My tasks · My Work List" };

export default async function TasksPage() {
  return <TaskList tasks={await listTasks()} />;
}
