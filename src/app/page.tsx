import { Hero } from "@/components/home/Hero";
import type { RoomFacts } from "@/components/home/RoomCard";
import { House, type HouseNotes } from "@/components/home/House";
import type { ReelItem } from "@/components/home/VhsOverlay";
import { siteConfig } from "@/data/config";
import { getAllProjects } from "@/lib/githubProjects";
import { platformSummary, projectStatus } from "@/lib/projectDisplay";
import type { TapeId } from "@/three/roomObjects";
import type { Project } from "@/types/project";

const CAPTIONS: Record<string, string> = {
  parada: "Still circling? See which zone has room, meet Lottie, and watch one gate event reach both screens.",
  tala: "A pencil writes “tala”, the day turns to night, and v1.1.0’s features arrive.",
};

/** The rows on a project's card in the hero room: all from the project's own data. */
function projectFacts(p: Project | undefined): [string, string][] | undefined {
  if (!p) return undefined;
  const rows: [string, string][] = [["Status", projectStatus(p.status).label]];
  if (p.version) rows.push(["Version", `v${p.version}`]);
  rows.push(["Runs on", platformSummary(p)], ["Built with", p.technologies.slice(0, 5).join(" · ")]);
  return rows;
}

export default async function Home() {
  const projects = await getAllProjects();
  const reel: ReelItem[] = projects.flatMap((p) => (p.film ? [{ slug: p.slug, name: p.name, caption: CAPTIONS[p.slug] ?? p.tagline, film: p.film }] : []));

  const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
  const facts: RoomFacts = {
    parada: projectFacts(bySlug("parada")),
    tala: projectFacts(bySlug("tala")),
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
    screening: reel.length ? [`${reel.length} films`, reel.map((r) => r.name).join(" · "), `${reel[0].film.duration} s each`] : undefined,
    about: ["BSIT", "LPU-Batangas", siteConfig.recognition[0].title],
    front: [siteConfig.availability, siteConfig.email],
  };

  return (
    <>
      <Hero facts={facts} reel={reel} />
      <House notes={notes} tape={reel[0]?.slug as TapeId | undefined} />
    </>
  );
}
