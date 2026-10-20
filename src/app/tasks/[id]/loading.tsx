import { TaskSkeleton } from "@/components/tasks/TaskStates";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading task" className="pt-11">
      <TaskSkeleton />
    </div>
  );
}
