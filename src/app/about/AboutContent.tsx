"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { BrowserPreview } from "@/components/ui/BrowserPreview";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/config";
import { useParallax } from "@/hooks/useParallax";
import { useReveal } from "@/hooks/useReveal";
import { asset } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface AboutContentProps {
  projects: Project[];
}

// Order in which the curated projects appear on the About page.
const SELECTED_ORDER = ["tala", "parada-landing", "modpack-development"];

const capabilities = [
  {
    title: "Web Development",
    text: "Interfaces, web applications, APIs and interactive experiences.",
  },
  {
    title: "Desktop Software",
    text: "Cross-platform tools and focused native-like experiences.",
  },
  {
    title: "Product Engineering",
    text: "Architecture, systems, implementation and turning ideas into working software.",
  },
  {
    title: "Cybersecurity",
    text: "Networking, secure systems and security-conscious engineering.",
  },
];

const principles = [
  {
    title: "Make it useful.",
    text: "Software should solve a real problem before it tries to impress.",
  },
  {
    title: "Make it clear.",
    text: "Complex systems should feel simple to the person using them.",
  },
  {
    title: "Make it deliberate.",
    text: "Every interaction, transition and piece of architecture should have a reason.",
  },
];

const milestones = [
  { year: "2024", label: "LPU-B", text: "Started building software seriously." },
  { year: "2025", label: "TALA", text: "Built a desktop note-taking application." },
  { year: "2026", label: "PARADA", text: "Designed and engineered a smart parking platform." },
  { year: "2026", label: "LORENZ.DEV", text: "Independent software development and design." },
];

function statusBadge(project: Project) {
  if (project.status === "released") return { variant: "released" as const, label: "Released" };
  if (project.status === "archived") return { variant: "archived" as const, label: "Archived" };
  return { variant: "in-progress" as const, label: "Work in progress" };
}

function EditorialFrame({ project }: { project: Project }) {
  return (
    <div className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-lg border border-ink/10 bg-ink/[0.02] p-6 md:p-8">
      <span className="t-label relative z-[1] text-ink/60">{statusBadge(project).label}</span>
      {project.cover ? (
        <Image src={project.cover} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-contain p-6" />
      ) : (
        <span className="select-none font-display text-5xl font-light leading-none tracking-tight text-ink/15 md:text-6xl">{project.name}</span>
      )}
      <div className="t-label relative z-[1] flex flex-wrap gap-x-6 gap-y-1 text-ink/60">
        {project.technologies.slice(0, 4).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </div>
  );
}

export function AboutContent({ projects }: AboutContentProps) {
  const heroRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const portraitRef = useParallax({ speed: 0.08 });
  const whatRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const workRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const thinkRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const storyRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const certRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  const selected = SELECTED_ORDER.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p)
  );

  return (
    <>
      {/* 01 — HERO */}
      <section ref={heroRef} className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="reveal mb-12 md:mb-16">
            <span className="section-number">About / Lorenz</span>
          </div>

          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left — name + statement */}
            <div className="md:col-span-7">
              <div className="reveal">
                <h1 className="font-display font-light tracking-tight text-swiss-fg text-display leading-[0.88]">
                  Lorenz
                  <br />
                  Malabanan
                </h1>
              </div>

              <p className="t-label reveal mt-8 text-ink/60 md:mt-10">Independent software developer</p>

              <div className="reveal mt-8 md:mt-10 max-w-xl">
                <p className="font-swiss text-xl md:text-2xl text-swiss-fg leading-snug">
                  I build software at the intersection of engineering and design.
                </p>
                <p className="font-swiss text-base md:text-lg text-swiss-fg/60 mt-4 leading-relaxed">
                  From desktop tools to web applications and complex systems, I enjoy
                  turning complicated ideas into software that feels deliberate,
                  understandable, and useful.
                </p>
              </div>

              <div className="reveal mt-10">
                <a
                  href="#selected-work"
                  className="t-label group inline-flex items-center gap-3 text-swiss-fg/60 hover:text-swiss-accent transition-colors duration-150"
                >
                  Explore selected work
                  <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </div>

            {/* Right — portrait */}
            <div className="md:col-span-5">
              <div className="reveal">
                <figure className="relative lg:translate-x-4">
                  <div ref={portraitRef} className="relative aspect-[4/5] overflow-hidden rounded-lg bg-paper-elevated">
                    <Image
                      src={asset("/images/profilepic.png")}
                      alt="Lorenz Malabanan, seated, in a black-and-white studio portrait"
                      fill
                      priority
                      className="object-cover grayscale"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                  <figcaption className="t-label mt-3 text-swiss-fg/60 flex items-center justify-between">
                    <span>Lorenz / 2026</span>
                    <span>{siteConfig.education.location}</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — WHAT I DO */}
      <section ref={whatRef} className="py-20 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="reveal">
            <SectionHeader number="01" title="What I Do" />
          </div>

          <ol>
            {capabilities.map((cap, i) => (
              <li key={cap.title} className="group border-t border-ink/10 last:border-b">
                <div className="py-8 md:py-10 flex items-start gap-6 md:gap-10">
                  <span className="font-mono text-xs text-swiss-fg/30 pt-2 group-hover:text-swiss-accent transition-colors duration-150">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-display font-light tracking-tight text-3xl md:text-5xl text-swiss-fg leading-none transition-all duration-300 group-hover:translate-x-1 md:group-hover:translate-x-2 group-hover:text-swiss-accent">
                        {cap.title}
                      </h2>
                      <span aria-hidden="true" className="font-swiss text-lg text-swiss-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        →
                      </span>
                    </div>
                    <p className="font-swiss text-sm md:text-base text-swiss-fg/50 group-hover:text-swiss-fg/80 mt-3 max-w-md leading-relaxed transition-colors duration-300">
                      {cap.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 — SELECTED WORK */}
      <section ref={workRef} id="selected-work" className="py-20 border-t border-ink/10 bg-ink/[0.02]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="reveal">
            <SectionHeader number="02" title="Selected Work" />
          </div>

          <div className="space-y-16 md:space-y-24">
            {selected.map((project, i) => {
              const reversed = i % 2 === 1;
              return (
                <article key={project.id} className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                  {/* Content */}
                  <div className={cn("lg:col-span-5 min-w-0", reversed && "lg:order-2")}>
                    <div className="reveal">
                      <div className="flex items-center justify-between mb-5">
                        <span className="t-label text-swiss-fg/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Badge variant={statusBadge(project).variant}>
                          {statusBadge(project).label}
                        </Badge>
                      </div>

                      <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl lg:text-6xl text-swiss-fg leading-none">
                        {project.name}
                      </h2>

                      <p className="font-swiss text-base text-swiss-fg/60 mt-5 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="t-label text-swiss-fg/60">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/projects/${project.slug}`}
                        className="t-label group inline-flex items-center gap-3 mt-8 text-swiss-fg/60 hover:text-swiss-accent transition-colors duration-150"
                      >
                        View project
                        <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={cn("lg:col-span-7 min-w-0", reversed && "lg:order-1")}>
                    <div className="reveal">
                      {project.heroImage ? (
                        <BrowserPreview
                          title={project.name}
                          url={`${project.name.split(" ")[0].toLowerCase()}.app`}
                          image={project.heroImage}
                          imageAlt={`${project.name} application interface`}
                        />
                      ) : (
                        <EditorialFrame project={project} />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 — HOW I THINK */}
      <section ref={thinkRef} className="py-20 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="reveal">
            <SectionHeader number="03" title="How I Think" />
          </div>

          <ol>
            {principles.map((principle, i) => (
              <li key={principle.title} className="group border-t border-ink/10 last:border-b">
                <div className="py-10 md:py-14 grid md:grid-cols-12 gap-4 md:gap-8 items-start">
                  <div className="md:col-span-2">
                    <span className="font-display font-light tracking-tight text-6xl md:text-7xl text-swiss-fg/15 group-hover:text-swiss-accent/80 transition-colors duration-300">
                      {i + 1}
                    </span>
                  </div>
                  <div className="md:col-span-10">
                    <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl lg:text-6xl text-swiss-fg leading-none group-hover:text-swiss-accent transition-colors duration-300">
                      {principle.title}
                    </h2>
                    <p className="font-swiss text-base text-swiss-fg/50 group-hover:text-swiss-fg/80 mt-4 max-w-lg leading-relaxed transition-colors duration-300">
                      {principle.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 05 — BUILDING */}
      <section ref={storyRef} className="py-20 border-t border-ink/10 bg-ink/[0.02]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-start">
            <div className="md:col-span-5">
              <div className="reveal">
                <span className="editorial-label block mb-5">Building</span>
                <h2 className="font-display font-light tracking-tight text-4xl md:text-5xl text-swiss-fg">
                  The story so far
                </h2>
              </div>
            </div>
            <div className="md:col-span-7">
              <ol>
                {milestones.map((m) => (
                  <li key={m.year + m.label} className="group border-t border-ink/10 last:border-b">
                    <div className="py-5 flex items-baseline gap-6">
                      <span className="t-label text-swiss-fg/60 group-hover:text-swiss-accent transition-colors duration-150 shrink-0">
                        {m.year}
                      </span>
                      <span className="font-swiss font-bold text-base tracking-[0.15em] uppercase text-swiss-fg shrink-0">
                        {m.label}
                      </span>
                      <span className="font-swiss text-sm text-swiss-fg/50 group-hover:text-swiss-fg/80 leading-relaxed transition-colors duration-300">
                        {m.text}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — CERTIFICATIONS */}
      <section ref={certRef} className="py-20 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="reveal">
            <SectionHeader number="04" title="Certifications" />
          </div>

          <ol className="max-w-2xl">
            {siteConfig.certifications.map((cert, i) => {
              const [issuer, ...rest] = cert.split(" ");
              const name = rest.join(" ") || issuer;
              return (
                <li key={cert} className="group border-t border-ink/10 last:border-b">
                  <div className="py-4 flex items-baseline justify-between gap-6">
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-xs text-swiss-fg/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-swiss text-sm font-medium text-swiss-fg/80 group-hover:text-swiss-accent transition-colors duration-150">
                        {name}
                      </span>
                    </div>
                    <span className="t-label text-swiss-fg/60 shrink-0">
                      {issuer}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}