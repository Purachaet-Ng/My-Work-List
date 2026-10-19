"use client"

import { useAuthStore } from "@/store/useAuthstore";
import type { Metadata } from "next";


// export const metadata: Metadata = { title: "TodoList · My Work List" };


export default function RegisterPage() {
  const {signOut} = useAuthStore()
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/register";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <>
    <p>Task (On going...)</p>
    <button
    onClick={handleSignOut}
    className={`w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors p-2.5`}
    title={"ออกจากระบบ"}>
      
    </button>
    </>
  )
}
