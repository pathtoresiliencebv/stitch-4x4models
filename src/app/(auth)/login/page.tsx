import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string; returnTo?: string }>;
}) {
  const params = await searchParams;
  const returnTo = params.returnTo || "/";
  const loginHref = `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <main className="min-h-screen bg-paper px-4 py-24 text-ink">
      <section className="mx-auto flex min-h-[64vh] w-full max-w-xl flex-col justify-center">
        <div className="border border-outline-variant/20 bg-white p-8 shadow-[0_28px_80px_-56px_rgba(23,21,19,0.7)] sm:p-10">
          <div className="mb-8 flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center border border-primary/25 bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary">
                Secure login
              </p>
              <h1 className="font-headline text-3xl font-bold uppercase leading-none text-ink">
                Inloggen bij 4x4models
              </h1>
            </div>
          </div>

          {params.auth === "not-configured" ? (
            <p className="mb-6 border border-primary/20 bg-primary/5 p-4 text-sm text-on-surface-variant">
              Casdoor is nog niet geconfigureerd in de omgeving. Zet de Casdoor env vars in Vercel om login live te activeren.
            </p>
          ) : null}

          {params.auth === "failed" ? (
            <p className="mb-6 border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              Inloggen is niet gelukt. Probeer opnieuw of controleer de Casdoor configuratie.
            </p>
          ) : null}

          <a
            className="inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 font-label text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary"
            href={loginHref}
          >
            Verder met Casdoor
            <ArrowRight className="h-4 w-4" />
          </a>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Nog geen account?{" "}
            <Link className="font-bold text-primary hover:underline" href={`/register?returnTo=${encodeURIComponent(returnTo)}`}>
              Account aanmaken
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
