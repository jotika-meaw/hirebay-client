import SiteChrome from "@/components/layout/SiteChrome";

export const metadata = {
  title: "Hirebay · Equipment Rental Platform",
};

export default function SiteLayout({ children }) {
  return <SiteChrome>{children}</SiteChrome>;
}
