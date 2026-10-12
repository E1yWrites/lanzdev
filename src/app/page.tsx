import { Hero } from "@/components/home/Hero";
import type { RoomFacts } from "@/components/home/RoomCard";
import { House, type HouseNotes } from "@/components/home/House";
import { UnderRoom } from "@/components/home/UnderRoom";
import type { ReelItem } from "@/components/home/VhsOverlay";
import { siteConfig } from "@/data/config";
import { getAllProjects } from "@/lib/githubProjects";
import { platformSummary, projectFacts, projectStatus } from "@/lib/projectDisplay";
import type { TapeId } from "@/three/roomObjects";

const CAPTIONS: Record<string, string> = {
  parada: "Still circling? See which zone has room, meet Lottie, and watch one gate event reach both screens.",
  tala: "Write “@ bukas alas-3 dentist” and it lands on Saturday at 3pm. Then Today: your plans, habits and money, already sorted.",
};

export default async function Home() {
  const projects = await getAllProjects();
  const reel: ReelItem[] = projects.flatMap((p) => (p.film ? [{ slug: p.slug, name: p.name, caption: CAPTIONS[p.slug] ?? p.tagline, film: p.film }] : []));

  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
  const factsOf = (slug: string) => {
    const p = bySlug(slug);
    return p && projectFacts(p);
  };
  const facts: RoomFacts = {
    parada: factsOf("parada"),
    tala: factsOf("tala"),
    about: [
      ["Studying", `BS Information Technology · ${siteConfig.education.level}`],
      ["Recognition", siteConfig.recognition[0].title],
      ["Certified", siteConfig.certifications[0].title],
    ],
    contact: [
      ["Email", siteConfig.email],
      ["Based in", "Batangas City, PH"],
    ],
  };

  // Each room's plate (its status first) and the paper note it shows when you're at it.
  const parada = bySlug("parada");
  const tala = bySlug("tala");
  const notes: HouseNotes = {
    // PARADA's stack, one per layer: mobile, web, API, vision
    garage: parada && [projectStatus(parada.status).label, parada.technologies.filter((t) => ["React Native", "Next.js", "FastAPI", "OpenCV"].includes(t)).join(" · ")],
    study: tala && [`${projectStatus(tala.status).label}${tala.version ? ` v${tala.version}` : ""}`, platformSummary(tala), tala.technologies.slice(0, 2).join(" · ")],
    screening: reel.length
      ? [
          `${reel.length} films`,
          reel.map((r) => r.name).join(" · "),
          new Set(reel.map((r) => r.film.duration)).size === 1 ? `${reel[0].film.duration} s each` : reel.map((r) => `${r.film.duration} s`).join(" · "),
        ]
      : undefined,
    about: ["BSIT", "LPU-Batangas", siteConfig.recognition[0].title],
    front: [siteConfig.availability, siteConfig.email],
  };

  return (
    <>
      <Hero facts={facts} reel={reel} />
      {/* phones (below 768px): films and the invitation; wider screens get the house */}
      <UnderRoom projects={projects} reel={reel} />
      <House notes={notes} tape={reel[0]?.slug as TapeId | undefined} />
    </>
  );
}
