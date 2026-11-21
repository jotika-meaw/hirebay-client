import Hero from "@/components/home/Hero";

export const metadata = {
  title: "Hirebay · Equipment Rental Platform",
  description:
    "Rent the machine, skip the mortgage. Verified equipment owners across Bangladesh.",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <Hero />
    </main>
  );
}
