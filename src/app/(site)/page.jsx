import Hero from "@/components/home/Hero";
import TrustedStrip from "@/components/home/TrustedStrip";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import StatsBand from "@/components/home/StatsBand";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";

export const metadata = {
  title: "Hirebay · Equipment Rental Platform",
  description:
    "Rent the machine, skip the mortgage. Verified equipment owners across Bangladesh.",
};

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <Hero />
      <TrustedStrip />
      <Categories />
      <Featured />
      <StatsBand />
      <HowItWorks />
      <WhyUs />
    </main>
  );
}
