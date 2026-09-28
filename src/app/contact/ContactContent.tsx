"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Surface } from "@/components/ui/Surface";
import { siteConfig } from "@/data/config";
import { useReveal } from "@/hooks/useReveal";

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(siteConfig.email).then(() => setCopied(true), () => {})}
      className="t-label tactile inline-flex h-10 items-center gap-2 self-start rounded-md border border-ink/25 px-4 text-swiss-fg transition-colors duration-fast hover:border-ink/30 hover:bg-ink/[0.04]"
    >
      {copied ? (
        <Check size={14} strokeWidth={2.5} aria-hidden="true" className="doc-copy-pop text-swiss-accent" />
      ) : (
        <Copy size={14} strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function ContactContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <div ref={sectionRef}>
      <PageHeader
        reveal
        eyebrow="Contact"
        title={
          <>
            Have a
            <br />
            project in mind<span className="text-swiss-accent">?</span>
          </>
        }
        lede="Let's build something worth using."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${siteConfig.email}`} variant="accent" size="lg" className="group/cta">
            Get in touch
            <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" className="transition-transform duration-fast group-hover/cta:translate-x-1" />
          </ButtonLink>
          <ButtonLink href={siteConfig.github.url} external variant="secondary" size="lg">
            GitHub
            <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
        <Surface tier="solid" className="reveal rounded-lg p-6 md:col-span-2 md:p-8">
          <span className="section-number block">Email</span>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <a
              href={`mailto:${siteConfig.email}`}
              className="break-all font-swiss text-2xl font-medium tracking-tight text-swiss-fg transition-colors duration-fast hover:text-swiss-accent md:text-4xl"
            >
              {siteConfig.email}
            </a>
            <CopyEmail />
          </div>
        </Surface>

        <Surface tier="solid" className="reveal flex flex-col rounded-lg p-6 md:p-8">
          <span className="section-number block">Elsewhere</span>
          <a
            href={siteConfig.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2 font-swiss text-xl font-medium text-swiss-fg transition-colors duration-fast hover:text-swiss-accent"
          >
            github.com/{siteConfig.github.username}
            <ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" className="transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <p className="mt-3 font-swiss text-sm leading-relaxed text-swiss-fg/60">
            Source, releases and issues for every project on this site.
          </p>
        </Surface>

        <Surface tier="solid" className="reveal flex flex-col rounded-lg p-6 md:p-8">
          <span className="section-number block">Based in</span>
          <p className="mt-5 font-swiss text-xl font-medium text-swiss-fg">{siteConfig.education.location}</p>
          <p className="mt-3 font-swiss text-sm leading-relaxed text-swiss-fg/60">
            Philippine Time (UTC+8).
          </p>
        </Surface>
      </section>
    </div>
  );
}
