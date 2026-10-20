import Link from "next/link";
import { focusRing } from "@/components/ui/Button";

export default function TaskNotFound() {
  return (
    <div className="rounded-card border border-border bg-card px-6 py-12 text-center shadow-panel">
      <h1 className="text-page-title font-bold">Task not found</h1>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">It may have been deleted, or the link is wrong.</p>
      <Link
        href="/tasks"
        className={`inline-flex min-h-11 items-center rounded-control bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-accent-foreground ${focusRing}`}
      >
        Back to tasks
      </Link>
    </div>
  );
}
