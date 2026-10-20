import { TaskListSkeleton } from "@/components/tasks/TaskStates";

export default function Loading() {
  return (
    <>
      <div className="mb-6">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-accent-foreground">Workspace</p>
        <h1 className="text-page-title font-bold">My tasks</h1>
      </div>
      <TaskListSkeleton />
    </>
  );
}
