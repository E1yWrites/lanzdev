"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { KineticText } from "@/components/motion/KineticText";
import { Magnetic } from "@/components/motion/Magnetic";
import { siteConfig } from "@/data/config";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { useReveal } from "@/hooks/useReveal";
import { asset } from "@/lib/constants";
import { projectStatus } from "@/lib/projectDisplay";
import type { Project } from "@/types/project";

interface AboutContentProps {
  projects: Project[];
}

const principles = [
  { title: "Make it useful.", text: "Software should solve a real problem before it tries to impress." },
  { title: "Make it honest.", text: "Show what the system actually knows — PARADA counts zones, not slots, and says so." },
  { title: "Make it deliberate.", text: "Every interaction, transition and piece of architecture should have a reason." },
];

// Dated from the résumé and the repositories.
const timeline = [
  { when: "2022", what: "LPU-B Senior High School" },
  { when: "2024", what: "Started BS Information Technology at LPU-Batangas; joined the Computer Society, ALCA, the CCAS Student Council and the Microsoft Student Community" },
  { when: "Nov 2024", what: "DataBiz: Innovation with AI & Data Science — Lipa Convention Center" },
  { when: "May 2025", what: "Microsoft Office Specialist: Word Associate" },
  { when: "2025", what: "Visual Graphic Design NC III (TESDA); CodeChum C++ Data Structures and Java OOP" },
  { when: "2025", what: "Finalist paper presenter, INSECOM 2025 — Universitas Brawijaya, Malang, Indonesia" },
  { when: "Sep–Nov 2025", what: "AI+X: Understanding & Applying AI — Universitas Brawijaya" },
  { when: "Aug 2026", what: "Tala 1.0 released; PARADA's monorepo scaffolded (Phase 1)" },
  { when: "Sep 2026", what: "Tala 1.1.0; PARADA's Phase 14 accuracy evaluation; deployment under way" },
];

/** Portrait in grey; a lens follows the pointer and shows it in colour. */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  return (
    <div
      ref={ref}
      className="portrait relative aspect-[4/5] overflow-hidden rounded-lg bg-paper-elevated"
      data-cursor={fine && !reduced ? "Colour" : undefined}
      onPointerMove={(e) => {
        if (!fine || reduced || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--px", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--py", `${e.clientY - r.top}px`);
        ref.current.style.setProperty("--pr", "150px");
      }}
      onPointerLeave={() => ref.current?.style.setProperty("--pr", "0px")}
    >
      <Image src={asset("/images/profilepic.png")} alt="Lorenz Malabanan in a studio portrait" fill priority className="object-cover object-[50%_20%] grayscale" sizes="(max-width: 768px) 100vw, 420px" />
      <Image src={asset("/images/profilepic.png")} alt="" aria-hidden="true" fill className="portrait-lens object-cover object-[50%_20%]" sizes="(max-width: 768px) 100vw, 420px" />
    </div>
  );
}

function Section({ number, title, children, id }: { number: string; title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-dotted border-ink/25 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="reveal md:col-span-4">
          <span className="section-number">{number}</span>
          <h2 className="mt-5 font-display text-4xl font-light tracking-tight text-ink md:text-5xl">{title}</h2>
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}

function Rows({ rows }: { rows: { main: string; detail: string; aside?: string }[] }) {
  return (
    <ol className="border-t border-dotted border-ink/25">
      {rows.map((r, i) => (
        <li key={r.main + i} className="reveal group grid grid-cols-[2rem_1fr] gap-x-4 border-b border-dotted border-ink/25 py-4 md:grid-cols-[2.5rem_1fr_auto]">
          <span className="t-label pt-1 text-ink/45 transition-colors group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-display text-xl font-light leading-snug text-ink transition-transform duration-normal ease-out group-hover:translate-x-1 md:text-2xl">{r.main}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{r.detail}</p>
          </div>
          {r.aside && <span className="t-label col-start-2 mt-2 text-ink/55 md:col-start-auto md:mt-1 md:text-right">{r.aside}</span>}
        </li>
      ))}
    </ol>
  );
}

export function AboutContent({ projects }: AboutContentProps) {
  const ref = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 50 });
  const selected = projects.filter((p) => p.model && p.cover);

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8 lg:gap-16">
          <div className="md:col-span-7">
            <span className="section-number">About</span>
            <KineticText lines={["Lorenz", "Malabanan"]} accent="." className="mt-8 font-display text-display font-light text-ink" />
            <p className="t-label mt-6 text-ink/60">
              {siteConfig.alias} · Independent developer · BSIT, {siteConfig.education.level.toLowerCase()}
            </p>
            <p className="reveal mt-8 max-w-xl font-display text-2xl font-light leading-snug text-ink md:text-3xl">{siteConfig.profile}</p>
            <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-ink/65 md:text-lg">
              I study at {siteConfig.education.institution}. Outside class I’m the LPU-B Computer Society’s Director for Community Extensions and VP
              for Public Media &amp; Relations at the Association of Lycean Career Ambassadors.
            </p>
            <div className="reveal mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href={`mailto:${siteConfig.email}`} data-cursor="Say hi" className="t-label inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-on-sheet">
                  <span className="live-dot" aria-hidden="true" /> {siteConfig.availability}
                </a>
              </Magnetic>
              <Magnetic>
                <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" className="t-label inline-flex h-11 items-center gap-2 rounded-full border border-ink/30 px-5 text-ink transition-colors hover:border-ink">
                  GitHub ↗
                </a>
              </Magnetic>
            </div>
          </div>
          <figure className="reveal md:col-span-5">
            <Portrait />
            <figcaption className="t-label mt-3 flex items-center justify-between text-ink/60">
              <span>Lanz / 2026</span>
              <span>{siteConfig.education.location}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Work */}
      <Section number="01" title="Selected work" id="selected-work">
        <div className="grid gap-6 sm:grid-cols-2">
          {selected.map((project, i) => (
            <Link key={project.id} href={`/projects/${project.slug}`} data-cursor="Open" className="reveal group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-ink/10 bg-ink/[0.03]">
                <Image src={project.cover!} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
                <span className="t-label absolute left-4 top-4 text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="t-label absolute right-4 top-4 text-ink/60">{projectStatus(project.status).label}</span>
              </div>
              <p className="mt-4 font-display text-3xl font-light text-ink transition-colors group-hover:text-accent">{project.name}</p>
              <p className="mt-1 text-sm text-ink/60">{project.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section number="02" title="Education">
        <Rows rows={siteConfig.schooling.map((s) => ({ main: s.school, detail: s.detail, aside: s.years }))} />
      </Section>

      <Section number="03" title="Recognition">
        <Rows rows={siteConfig.recognition.map((r) => ({ main: r.title, detail: r.detail, aside: r.year }))} />
      </Section>

      <Section number="04" title="Certifications & training">
        <Rows
          rows={[
            ...siteConfig.certifications.map((c) => ({ main: c.title, detail: c.issuer, aside: c.year })),
            ...siteConfig.training.map((t) => ({ main: t.title, detail: t.issuer })),
          ]}
        />
      </Section>

      <Section number="05" title="Organisations">
        <Rows rows={siteConfig.organizations.map((o) => ({ main: o.name, detail: o.role, aside: o.years }))} />
      </Section>

      <Section number="06" title="Skills">
        <ul className="grid gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-2">
          {siteConfig.skills.map((s) => (
            <li key={s.name} className="reveal group bg-paper p-5 transition-colors duration-normal hover:bg-accent hover:text-on-sheet">
              <p className="font-display text-2xl font-light">{s.name}</p>
              <p className="t-label mt-2 text-ink/55 transition-colors group-hover:text-on-sheet/75">{s.detail}</p>
            </li>
          ))}
        </ul>
        <div className="reveal mt-8 flex flex-wrap gap-2">
          {Object.values(siteConfig.technologies)
            .flat()
            .filter((t, i, all) => all.indexOf(t) === i)
            .map((t) => (
              <span key={t} className="t-label rounded-full border border-ink/20 px-3 py-1.5 text-ink/75 transition-colors hover:border-accent hover:text-accent">
                {t}
              </span>
            ))}
        </div>
      </Section>

      <Section number="07" title="How I think">
        <ol className="border-t border-dotted border-ink/25">
          {principles.map((p, i) => (
            <li key={p.title} className="reveal group grid grid-cols-[3rem_1fr] gap-4 border-b border-dotted border-ink/25 py-6">
              <span className="font-display text-4xl font-light text-ink/20 transition-colors group-hover:text-accent">{i + 1}</span>
              <div>
                <p className="font-display text-3xl font-light text-ink md:text-4xl">{p.title}</p>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/60 md:text-base">{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section number="08" title="The story so far">
        <ol className="relative border-l border-dotted border-ink/30 pl-6">
          {timeline.map((t, i) => (
            <li key={t.when + i} className="reveal group relative pb-7 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rotate-45 bg-ink/40 transition-colors group-hover:bg-accent" />
              <p className="t-label text-accent">{t.when}</p>
              <p className="mt-1 max-w-xl text-base leading-relaxed text-ink/80">{t.what}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
