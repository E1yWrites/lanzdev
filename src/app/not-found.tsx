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
      <div className="relative px-6 text-center">
        <span className="section-number">Error / Not found</span>
        <h1
          aria-label="404"
          className="mt-6 inline-flex items-center font-display font-light leading-[0.85] tracking-tight text-swiss-fg"
          style={{ fontSize: "clamp(80px, 20vw, 224px)" }}
        >
          <span aria-hidden="true">4</span>
          {/* the zero is a star — lost, but still shining */}
          <svg aria-hidden="true" viewBox="-1 -1 2 2" className="spin-slow mx-[0.04em] h-[0.72em] w-[0.72em] text-accent">
            <path d="M0-1C.1-.2.2-.1 1 0 .2.1.1.2 0 1-.1.2-.2.1-1 0-.2-.1-.1-.2 0-1Z" fill="currentColor" />
          </svg>
          <span aria-hidden="true">4</span>
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
              className="t-label text-swiss-fg/60 transition-colors duration-fast hover:text-swiss-accent"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
