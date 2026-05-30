import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getWebshop } from "@/lib/base44-data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const webshop = await getWebshop();
  const brandName = webshop?.name || "4x4models";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar brandName={brandName} logoUrl={webshop?.logo_url || "/images/logo.png"} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer brandName={brandName} tagline={webshop?.description || undefined} />
    </div>
  );
}
