import Hero from "@/components/home/Hero";
import TrustedStrip from "@/components/home/TrustedStrip";
import Categories from "@/components/home/Categories";
import Featured from "@/components/home/Featured";
import StatsBand from "@/components/home/StatsBand";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";
import Reviews from "@/components/home/Reviews";
import Faq from "@/components/home/Faq";
import OwnerCta from "@/components/home/OwnerCta";

export const metadata = {
  title: "Hirebay · Home",
  description:
    "Tell Hirebay what you need and where. We match you with verified owners, check the dates and settle the price before you pay with Stripe.",
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
      <Reviews />
      <Faq />
      <OwnerCta />
    </main>
  );
}
