import { redirect } from "next/navigation";

// No landing page in the design: proxy.ts sends "/" to /tasks or /login. This is the fallback.
export default function Home() {
  redirect("/tasks");
}
