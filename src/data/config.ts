// Personal details come from the résumé; contact details stop at email and city
// (no phone number, street or references on a public site).

export const siteConfig = {
  name: "Lorenz.dev",
  personalName: "Lorenz Malabanan",
  fullName: "Lorenz Lanz V. Malabanan",
  alias: "Lanz",
  domain: "lorenzmalabanan.com",
  url: "https://lorenzmalabanan.com",
  description:
    "Lorenz “Lanz” Malabanan — a 3rd-year IT student in Batangas building web, mobile and desktop software: PARADA, a smart parking system, and Tala, a note-taking app.",
  tagline: "Software for curious people.",
  profile:
    "3rd-year IT student building web and desktop apps with React, TypeScript and Tauri, including Tala, my released note-taking app. Trained in Cisco networking and cybersecurity.",
  availability: "Open to an internship",
  email: "lorenzlanz28@gmail.com",
  github: {
    username: "E1yWrites",
    url: "https://github.com/E1yWrites",
    talaRepo: "https://github.com/E1yWrites/tala",
  },
  socials: [
    {
      label: "GITHUB",
      href: "https://github.com/E1yWrites",
      external: true,
    },
    {
      label: "EMAIL",
      href: "mailto:lorenzlanz28@gmail.com",
    },
  ],
  education: {
    institution: "Lyceum of the Philippines University — Batangas",
    program: "Bachelor of Science in Information Technology",
    level: "3rd Year",
    years: "2024 — present",
    location: "Batangas City, Philippines",
  },
  schooling: [
    { school: "Lyceum of the Philippines University — Batangas", detail: "BS Information Technology", years: "2024 — present" },
    { school: "LPU-B Senior High School", detail: "Senior High School", years: "2022 — 2024" },
  ],
  recognition: [
    {
      title: "Finalist, INSECOM 2025",
      detail: "Finalist paper presenter on the global stage — Universitas Brawijaya, Malang, Indonesia",
      year: "2025",
    },
  ],
  certifications: [
    { title: "Visual Graphic Design NC III", issuer: "TESDA · LPU-B CTEL", year: "2025" },
    { title: "Microsoft Office Specialist: Word Associate", issuer: "Microsoft", year: "2025" },
    { title: "C++ Data Structures", issuer: "CodeChum", year: "2025" },
    { title: "Java Object-Oriented Programming", issuer: "CodeChum", year: "2025" },
  ],
  training: [
    { title: "CCNA 1–3 · CCNA CyberSecurity (ongoing)", issuer: "Cisco Networking Academy" },
    { title: "AI+X: Understanding & Applying AI", issuer: "Universitas Brawijaya · Sep 15 — Nov 21, 2025" },
    { title: "CCAS Career Congress", issuer: "LPU-Batangas · Nov 21, 2025" },
    { title: "DataBiz: Innovation with AI & Data Science", issuer: "Lipa Convention Center · Nov 10, 2024" },
  ],
  organizations: [
    { name: "LPU-B Computer Society", role: "Director for Community Extensions", years: "2024 — 2026" },
    { name: "Association of Lycean Career Ambassadors", role: "VP, Public Media & Relations · Asst. Secretary", years: "2024 — present" },
    { name: "CCAS Student Council", role: "Logistics Member", years: "2024 — 2025" },
    { name: "LPU-B Microsoft Student Community", role: "Member", years: "2024 — present" },
  ],
  skills: [
    { name: "UI design & prototyping", detail: "Figma" },
    { name: "Data querying", detail: "PostgreSQL, MongoDB" },
    { name: "Audio & video editing", detail: "Adobe" },
    { name: "Visual storytelling & multimedia", detail: "Motion, 3D, editorial" },
    { name: "Public relations & event logistics", detail: "Student organisations" },
    { name: "Leading, listening & collaborating", detail: "Teams of peers" },
  ],
  focus: ["Web", "Mobile", "Desktop", "Cybersecurity"],
  technologies: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vite"],
    mobile: ["React Native", "Expo"],
    desktop: ["Tauri"],
    backend: ["Node.js", "Express", "Python", "FastAPI"],
    vision: ["OpenCV", "EasyOCR"],
    database: ["PostgreSQL", "Prisma", "MongoDB", "IndexedDB"],
    motion: ["GSAP", "three.js", "Remotion"],
    versionControl: ["Git", "GitHub"],
    focus: ["Cybersecurity", "Computer Networking", "Cisco"],
  },
};
