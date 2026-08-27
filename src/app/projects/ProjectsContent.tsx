"use client";

import Link from "next/link";
import { projects } from "@/data/projects";
import { useReveal } from "@/hooks/useReveal";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function ProjectsContent() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12">
          <h1 className="reveal font-swiss font-black text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase text-swiss-fg mb-4">
            Projects
          </h1>
          <p className="reveal font-swiss text-base text-swiss-fg/70 leading-relaxed">
            Software I&apos;ve designed and built.
          </p>
        </div>

        <div className="grid gap-0 md:grid-cols-2 border-2 border-swiss-border">
          {projects.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.slug}`} className="reveal group">
              <Card className={`h-full p-6 md:p-7 border-0 ${index % 2 === 0 ? "md:border-r-2" : ""} ${index < projects.length - 2 ? "border-b-2" : ""}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <span className="font-swiss text-[11px] font-bold tracking-widest text-swiss-fg/40 group-hover:text-swiss-accent transition-colors duration-150">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Badge variant={project.status === "released" ? "released" : "in-progress"}>
                    {project.status === "released" ? "Released" : "WIP"}
                  </Badge>
                </div>

                <h2 className="font-swiss font-black text-2xl md:text-3xl tracking-tighter uppercase mb-1 group-hover:text-swiss-accent transition-colors duration-150">
                  {project.name}
                </h2>
                <p className="font-swiss text-sm text-swiss-fg/70 mb-5 leading-relaxed group-hover:text-swiss-fg transition-colors duration-150">
                  {project.tagline}
                </p>

                <dl className="grid grid-cols-2 gap-y-2 border-t-2 border-swiss-border pt-4">
                  <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">Type</dt>
                  <dd className="font-swiss text-xs font-medium text-swiss-fg">Desktop</dd>
                  <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40">Year</dt>
                  <dd className="font-swiss text-xs font-medium text-swiss-fg">
                    {new Date(project.releaseDate).getFullYear()}
                  </dd>
                </dl>

                <span className="inline-block mt-4 font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50 group-hover:text-swiss-accent transition-colors duration-150">
                  Take a look →
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="reveal mt-14 text-center">
          <span className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40">
            More software in development
          </span>
        </div>
      </div>
    </section>
  );
}
