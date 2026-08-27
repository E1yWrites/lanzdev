"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/config";
import { projects } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { useReveal } from "@/hooks/useReveal";
import { asset } from "@/lib/constants";

export function AboutContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Section label */}
        <div className="reveal mb-12 md:mb-16">
          <span className="section-number">About Lorenz</span>
        </div>

        {/* Hero — name + photo + statement */}
        <div className="reveal mb-20 md:mb-24">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Name + statement — left */}
            <div className="md:col-span-7">
              <h1 className="font-swiss font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase text-swiss-fg leading-[0.9] mb-8">
                Lorenz
                <br />
                Malabanan
              </h1>

              <ul className="space-y-1 mb-8">
                {[`${siteConfig.education.level} · BSIT`, "Independent software developer", siteConfig.education.location].map((line, i) => (
                  <li
                    key={i}
                    className="font-swiss text-sm font-medium text-swiss-fg/70"
                  >
                    {line}
                  </li>
                ))}
              </ul>

              {/* Intro paragraph */}
              <p className="font-swiss text-lg md:text-xl text-swiss-fg/70 max-w-lg leading-relaxed mb-10">
                I design and build software across the web, desktop, and
                security — with a focus on practical, thoughtful digital
                experiences.
              </p>

              <Link
                href="/projects"
                className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150 inline-flex items-center gap-2"
              >
                View projects
              </Link>
            </div>

            {/* Photo — right */}
            <div className="md:col-span-5 relative">
              <div className="relative w-full aspect-[4/5] border-2 border-swiss-border overflow-hidden bg-swiss-muted swiss-grid-pattern">
                <Image
                  src={asset("/images/profilepic.png")}
                  alt="Lorenz Malabanan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-0 border-t-2 border-swiss-border" />

        {/* Focus + Certifications */}
        <div className="reveal py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20">
            {/* Focus */}
            <div>
              <span className="section-number block mb-6">01 — Focus</span>
              <ol>
                {siteConfig.focus.map((item, i) => (
                  <li key={item} className="group flex items-center justify-between py-4 border-b-2 border-swiss-border cursor-default hover:bg-swiss-muted transition-colors duration-150">
                    <div className="flex items-center gap-4 px-2">
                      <span className="font-swiss text-[11px] font-bold tracking-widest text-swiss-fg/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-swiss font-black text-2xl uppercase tracking-tighter text-swiss-fg group-hover:text-swiss-accent transition-colors duration-150">
                        {item}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Certifications */}
            <div>
              <span className="section-number block mb-6">02 — Certifications</span>
              <ol>
                {siteConfig.certifications.map((cert, i) => (
                  <li key={cert} className="group flex items-center justify-between py-4 border-b-2 border-swiss-border cursor-default hover:bg-swiss-muted transition-colors duration-150">
                    <div className="flex items-center gap-4 px-2">
                      <span className="font-swiss text-[11px] font-bold tracking-widest text-swiss-fg/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-swiss text-sm font-medium text-swiss-fg group-hover:text-swiss-accent transition-colors duration-150">
                        {cert.replace("Cisco ", "")}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-0 border-t-2 border-swiss-border" />

        {/* Selected Work teaser */}
        <div className="reveal py-16 md:py-20">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <span className="font-swiss font-black text-2xl tracking-tighter uppercase text-swiss-fg">Selected work</span>
            <Link
              href="/projects"
              className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 hover:text-swiss-accent transition-colors duration-150 inline-flex items-center gap-1.5"
            >
              View all
            </Link>
          </div>

          <div className="space-y-0 border-2 border-swiss-border">
            {projects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block border-b-2 border-swiss-border last:border-0 p-6 hover:bg-swiss-fg hover:text-swiss-bg transition-all duration-150"
              >
                <div className="grid md:grid-cols-12 gap-3 md:gap-6 items-start">
                  <div className="md:col-span-1">
                    <span className="font-swiss text-[11px] font-bold tracking-widest text-swiss-fg/40 group-hover:text-swiss-accent transition-colors duration-150">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="font-swiss font-black text-2xl md:text-3xl tracking-tighter uppercase group-hover:text-swiss-bg transition-colors duration-150">
                      {project.name}
                    </h3>
                  </div>

                  <div className="md:col-span-3">
                    <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 group-hover:text-swiss-bg/50 transition-colors duration-150">
                      {project.platforms.join(" / ")}
                    </span>
                  </div>

                  <div className="md:col-span-2">
                    <p className="font-swiss text-sm text-swiss-fg/70 leading-relaxed group-hover:text-swiss-bg/70 transition-colors duration-150">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <Badge variant={project.status === "released" ? "released" : "in-progress"}>
                      {project.status === "released" ? "Released" : "WIP"}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
