import { KineticText } from "@/components/motion/KineticText";

// What I work with, grouped the way the projects use it. Rows fill with the accent
// on hover (see `.cap-row` in globals.css).
const ROWS = [
  { area: "Web apps", tools: "Next.js · React · TypeScript · Tailwind", where: "PARADA admin, this site" },
  { area: "Mobile", tools: "React Native · Expo", where: "PARADA driver app" },
  { area: "Desktop", tools: "Tauri · React · IndexedDB", where: "Tala" },
  { area: "Backends", tools: "Node.js · Express · Python · FastAPI", where: "PARADA API + vision" },
  { area: "Computer vision", tools: "OpenCV · EasyOCR", where: "PARADA plate reading" },
  { area: "Data", tools: "PostgreSQL · Prisma · MongoDB", where: "PARADA, coursework" },
  { area: "Motion & 3D", tools: "GSAP · three.js · Remotion", where: "PARADA landing, this site" },
  { area: "Design & media", tools: "Figma · Adobe · visual storytelling", where: "NC III Visual Graphic Design" },
  { area: "Networks & security", tools: "Cisco CCNA 1–3 · CyberSecurity", where: "Cisco Networking Academy" },
];

export function Capabilities() {
  return (
    <section aria-labelledby="caps-title" className="mx-auto max-w-[1600px] px-5 py-24 md:px-8 md:py-32 lg:px-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="section-number">Toolbox</span>
          <KineticText as="h2" id="caps-title" lines={["What I build", "with"]} accent="." className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink" />
        </div>
        <p className="max-w-md font-swiss text-base leading-relaxed text-ink/70 md:col-span-5">Front to back, and a little bit of everything around it — each row points at where it’s actually used.</p>
      </div>

      <ol className="mt-12 border-t border-dotted border-ink/30">
        {ROWS.map((row, i) => (
          <li key={row.area} className="cap-row group relative border-b border-dotted border-ink/30">
            <div className="relative z-[1] grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-1 py-5 transition-colors duration-normal group-hover:text-on-sheet md:grid-cols-[3rem_minmax(0,4fr)_minmax(0,5fr)_minmax(0,3fr)] md:py-6">
              <span className="t-label text-ink/50 transition-colors group-hover:text-on-sheet/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-3xl font-light tracking-tight transition-transform duration-normal ease-out group-hover:translate-x-2 md:text-4xl">{row.area}</span>
              <span className="col-start-2 font-mono text-[13px] text-ink/75 transition-colors group-hover:text-on-sheet md:col-start-auto">{row.tools}</span>
              <span className="t-label col-start-2 text-ink/50 transition-colors group-hover:text-on-sheet/75 md:col-start-auto md:text-right">{row.where}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
