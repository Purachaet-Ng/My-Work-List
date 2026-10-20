"use client";

import { ErrorState } from "@/components/tasks/TaskStates";

export default function TasksError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState onRetry={retry} />;
}
