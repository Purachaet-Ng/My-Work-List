"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthstore";
import { Button, focusRing } from "@/components/ui/Button";

export function AppHeader({ email }: { email: string }) {
  const { signOut } = useAuthStore();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
      setPending(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-[max(24px,calc((100%-1184px)/2))] max-md:h-15 max-md:px-4">
      <Link href="/tasks" className={`rounded-lg p-2 text-base font-bold tracking-tight ${focusRing}`}>
        My Work List
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted-foreground max-md:hidden">{email}</span>
        <Button variant="ghost" icon={LogOut} loading={pending} onClick={handleSignOut} aria-label="Log out" className="max-md:px-2.5">
          <span className="max-md:hidden">Log out</span>
        </Button>
      </div>
    </header>
  );
}
