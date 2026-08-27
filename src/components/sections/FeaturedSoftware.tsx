"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { getFeaturedProject } from "@/data/projects";
import { formatDate } from "@/lib/utils";
import { asset } from "@/lib/constants";
import { useReveal } from "@/hooks/useReveal";

export function FeaturedSoftware() {
  const sectionRef = useReveal({ threshold: 0.05, stagger: true, staggerDelay: 60 });
  const project = getFeaturedProject();

  if (!project) return null;

  const meta = [
    { label: "Platform", value: project.platforms.join(" / ") },
    { label: "Type", value: "Desktop Application" },
    { label: "Stack", value: "Tauri / React / TypeScript" },
    { label: "Status", value: project.status, capitalize: true },
    { label: "License", value: project.license },
    { label: "Updated", value: formatDate(project.releaseDate) },
  ];

  return (
    <section ref={sectionRef} className="py-20 border-t-2 border-swiss-border bg-swiss-muted swiss-dots">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="reveal">
          <SectionHeader number="02" title="Featured Software" />
        </div>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left — Info */}
          <div className="order-2 md:order-1 md:col-span-5">
            <div className="reveal mb-6">
              <Badge variant={project.status === "released" ? "released" : project.status === "in-progress" ? "in-progress" : "planned"}>
                v{project.version} {project.status === "released" ? "released" : project.status === "in-progress" ? "in progress" : "planned"}
              </Badge>
            </div>

            <h2 className="reveal font-swiss font-black text-4xl md:text-5xl tracking-tighter uppercase text-swiss-fg mb-6">
              {project.name}
            </h2>

            <p className="reveal font-swiss text-lg md:text-xl text-swiss-fg/70 mb-8 leading-relaxed">
              {project.tagline}
            </p>

            <div className="reveal flex flex-wrap gap-3 mb-10">
              <Link href={`/projects/${project.slug}`}>
                <Button variant="primary">View Project</Button>
              </Link>
              <Link href="/downloads">
                <Button variant="secondary">Download</Button>
              </Link>
            </div>

            {/* Metadata grid */}
            <div className="reveal border-t-2 border-swiss-border pt-6">
              <dl className="grid grid-cols-2 gap-y-5 gap-x-8">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/40 block mb-1">
                      {m.label}
                    </dt>
                    <dd
                      className={`font-swiss text-sm font-medium text-swiss-fg ${m.capitalize ? "capitalize" : ""}`}
                    >
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Right — Preview */}
          <div className="order-1 md:order-2 md:col-span-7">
            <div className="reveal">
              <ImagePreview
                src={asset("/images/tala_starry_banner_1.jpg")}
                alt={`${project.name} application interface`}
                caption={`${project.name} — ${project.tagline}`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
