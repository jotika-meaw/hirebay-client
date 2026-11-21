"use client";

import { usePathname } from "next/navigation";
import SiteNavbar from "@/components/layout/SiteNavbar";
import Footer from "@/components/layout/Footer";

// Home (/) renders its own hero navbar inside the hero panel and gets the
// full footer; every other public page gets the pill navbar + compact footer.
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <SiteNavbar />}
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer variant={isHome ? "full" : "compact"} />
    </>
  );
}
