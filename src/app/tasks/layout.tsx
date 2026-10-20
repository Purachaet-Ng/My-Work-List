import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/tasks/AppHeader";
import { focusRing } from "@/components/ui/Button";

// proxy.ts already redirects; this is the server-side check plan.md asks for. RLS is the real boundary.
export default async function TasksLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");

  return (
    <div className="min-h-screen pb-18">
      <AppHeader email={data.user.email ?? ""} />
      <main className="mx-auto max-w-3xl px-4 py-12 max-md:py-8">{children}</main>
      <footer className="mx-auto flex max-w-3xl items-center justify-between px-4 text-xs text-muted-foreground">
        <span>My Work List</span>
        <Link href="/components" className={`rounded-sm p-1 font-semibold text-accent-foreground ${focusRing}`}>
          Components
        </Link>
      </footer>
    </div>
  );
}
