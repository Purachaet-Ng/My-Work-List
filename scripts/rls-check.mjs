// AC-06/07: proves in the database that users can't touch each other's tasks and that logged-out callers get nothing.
// Run: node --env-file=.env.local scripts/rls-check.mjs
// Signs up two throwaway users (A, B) with the anon key, so "Confirm email" must be off. Exits 1 on any leak.
// Leftover: the two users stay in Supabase Auth (the anon key can't delete users); remove them in the dashboard if you like.
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_URL: url, NEXT_PUBLIC_SUPABASE_ANON_KEY: key } = process.env;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (use --env-file=.env.local).");

const client = () => createClient(url, key, { auth: { persistSession: false } });

async function signUp(name) {
  const c = client();
  const { data, error } = await c.auth.signUp({ email: `rls-${name}-${randomUUID()}@example.com`, password: randomUUID() });
  if (error || !data.session) throw new Error(`sign-up ${name} failed (is "Confirm email" off?): ${error?.message ?? "no session"}`);
  return { c, id: data.user.id };
}

let failed = 0;
function check(name, ok) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}
// Blocked = the DB refused (error) or the policy hid the row (no rows affected/returned).
const blocked = ({ data, error }) => !!error || !data?.length;

const A = await signUp("a");
const B = await signUp("b");
const anon = client();

const { data: task, error: insErr } = await A.c.from("tasks").insert({ title: "A's task" }).select().single();
if (insErr) throw new Error(`A can't create a task: ${insErr.message}`);
check("A's task is owned by A", task.owner_id === A.id);

check("B can't read A's task", blocked(await B.c.from("tasks").select().eq("id", task.id)));
check("B can't update A's task", blocked(await B.c.from("tasks").update({ title: "hacked" }).eq("id", task.id).select()));
check("B can't delete A's task", blocked(await B.c.from("tasks").delete().eq("id", task.id).select()));
check("B can't insert a task owned by A", !!(await B.c.from("tasks").insert({ title: "x", owner_id: A.id })).error);
check("A can't insert a task owned by B", !!(await A.c.from("tasks").insert({ title: "x", owner_id: B.id })).error);
check("A can't hand own task to B", !!(await A.c.from("tasks").update({ owner_id: B.id }).eq("id", task.id)).error);

const { data: after } = await A.c.from("tasks").select().eq("id", task.id).single();
check("A's task is unchanged after B's attempts", after?.title === "A's task" && after.owner_id === A.id);

check("logged-out can't read", !!(await anon.from("tasks").select()).error);
check("logged-out can't insert", !!(await anon.from("tasks").insert({ title: "x" })).error);
check("logged-out can't update", !!(await anon.from("tasks").update({ title: "x" }).eq("id", task.id)).error);
check("logged-out can't delete", !!(await anon.from("tasks").delete().eq("id", task.id)).error);

await A.c.from("tasks").delete().eq("id", task.id); // clean up our own row
console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
