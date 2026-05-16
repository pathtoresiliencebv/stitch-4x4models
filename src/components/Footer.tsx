import Link from "next/link";
import type { ProductCategory, Webshop } from "@/types/base44";

export default function Footer({ webshop, categories = [] }: { webshop?: Webshop; categories?: ProductCategory[] }) {
  const name = webshop?.name || "4x4 Models";

  return (
    <footer className="border-t border-surface-container-high bg-surface-container-low">
      <div className="mx-auto grid max-w-screen-2xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <h3 className="mb-4 font-headline text-lg font-bold uppercase tracking-tight text-primary">{name}</h3>
          <p className="text-sm text-on-surface-variant">{webshop?.description || "Premium 4x4 products, builds, and stories."}</p>
        </div>
        <div>
          <h4 className="mb-4 font-headline text-sm font-bold uppercase tracking-tight">Shop</h4>
          <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <Link href="/producten" className="hover:text-primary">Products</Link>
            <Link href="/collecties" className="hover:text-primary">Collections</Link>
            <Link href="/tags" className="hover:text-primary">Tags</Link>
          </nav>
        </div>
        <div>
          <h4 className="mb-4 font-headline text-sm font-bold uppercase tracking-tight">Collections</h4>
          <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
            {categories.slice(0, 5).map((category) => (
              <Link key={category.id} href={`/collecties/${category.slug}`} className="hover:text-primary">
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="mb-4 font-headline text-sm font-bold uppercase tracking-tight">Support</h4>
          <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/voorwaarden" className="hover:text-primary">Terms</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-surface-container-high px-6 py-6 text-center text-sm text-on-surface-variant">
        © 2026 {name}. All rights reserved.
      </div>
    </footer>
  );
}
