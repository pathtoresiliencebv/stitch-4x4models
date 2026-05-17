import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-surface-container-high">
      <div className="max-w-screen-2xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-headline font-bold tracking-tighter text-primary uppercase mb-4">
              4x4models
            </h3>
            <p className="text-on-surface-variant text-sm">
              Fuel your off-road adventure with the ultimate Toyota 4x4 community.
            </p>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">Explore</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="/vehicles" className="hover:text-primary transition-colors">Vehicles</Link>
              <Link href="/gear" className="hover:text-primary transition-colors">Gear & Mods</Link>
              <Link href="/journal" className="hover:text-primary transition-colors">Journal</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">Support</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="#" className="hover:text-primary transition-colors">About</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="#" className="hover:text-primary transition-colors">FAQ</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-headline font-bold tracking-tighter uppercase text-sm mb-4">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-on-surface-variant">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </nav>
          </div>
        </div>
        <div className="border-t border-surface-container-high mt-8 pt-8 text-center text-sm text-on-surface-variant">
          <p>© 2026 4x4models. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
