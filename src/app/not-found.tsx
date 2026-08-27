import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-20 swiss-grid-pattern">
      <div className="text-center px-6">
        <h1 className="font-swiss font-black tracking-tighter uppercase text-swiss-fg mb-6 leading-[0.85]" style={{ fontSize: "clamp(80px, 20vw, 224px)" }}>
          4<span className="text-swiss-accent">0</span>4
        </h1>
        <p className="font-swiss text-lg md:text-xl text-swiss-fg/70 mb-10 mt-8 max-w-md mx-auto">
          This page doesn&apos;t exist. Let&apos;s head back home.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center h-16 px-8 font-swiss text-sm font-bold tracking-widest uppercase bg-swiss-fg text-swiss-bg border-2 border-swiss-border hover:bg-swiss-accent hover:border-swiss-accent transition-all duration-150"
        >
          Go home
        </Link>
      </div>
    </section>
  );
}
