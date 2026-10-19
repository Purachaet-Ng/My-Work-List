export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-4 px-4 py-12">
      <h1 className="text-page-title font-bold">My Work List</h1>
      <p className="text-muted-foreground">Thunder theme is wired. Auth and tasks come next.</p>
      <span className="w-fit rounded-pill bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
        Setup
      </span>
    </main>
  );
}
