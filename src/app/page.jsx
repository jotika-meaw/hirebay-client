export const metadata = {
  title: "Hirebay · Equipment Rental Platform",
  description:
    "Rent the machine, skip the mortgage. Verified equipment owners across Bangladesh.",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
        ■ Hirebay · Equipment rental platform
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.05em] sm:text-7xl">
        Rent the machine. Skip the{" "}
        <span className="highlight">mortgage.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
        The yard is being set up — the full home page lands in the next tasks.
      </p>
    </main>
  );
}
