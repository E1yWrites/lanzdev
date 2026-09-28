import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

const SUGGESTIONS = [
  { href: "/projects", label: "Projects" },
  { href: "/downloads", label: "Downloads" },
  { href: "/docs", label: "Documentation" },
];

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-56px)] items-center justify-center overflow-hidden py-20">
      <div aria-hidden="true" className="surface-glow pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="swiss-grid-pattern pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative px-6 text-center">
        <span className="section-number">Error / Not found</span>
        <h1
          className="mt-6 font-swiss font-black uppercase leading-[0.85] tracking-tighter text-swiss-fg"
          style={{ fontSize: "clamp(80px, 20vw, 224px)" }}
        >
          4<span className="text-swiss-accent">0</span>4
        </h1>
        <p className="mx-auto mt-8 max-w-md font-swiss text-lg text-swiss-fg/70 md:text-xl">
          This page doesn&apos;t exist. Let&apos;s head back home.
        </p>
        <ButtonLink href="/" variant="primary" size="lg" className="mt-10">
          Go home
        </ButtonLink>
        <nav aria-label="Suggested pages" className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {SUGGESTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="font-swiss text-[11px] font-bold uppercase tracking-widest text-swiss-fg/50 transition-colors duration-fast hover:text-swiss-accent"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
