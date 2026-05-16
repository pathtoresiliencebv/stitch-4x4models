import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCategories, getWebshop } from "@/lib/base44-data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webshop, categories] = await Promise.all([getWebshop(), getCategories()]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar webshop={webshop} categories={categories} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer webshop={webshop} categories={categories} />
    </div>
  );
}
