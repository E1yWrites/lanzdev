export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for Lorenz.dev.",
};

const SECTIONS = [
  {
    title: "Acceptance",
    body: "By accessing or using this website and any software distributed through it, you agree to be bound by these Terms of Service. If you do not agree, do not use the website or software.",
  },
  {
    title: "Service",
    body: "This website provides information about software projects, documentation, and download links for open-source software. The website is operated independently and is not a commercial service.",
  },
  {
    title: "Software License",
    body: "All software distributed through this website is provided under its respective open-source license. Tala is licensed under the MIT License. You may use, modify, and distribute the software in accordance with the license terms.",
  },
  {
    title: "Intellectual Property",
    body: "The website design, original content, and documentation are intellectual property of the developer. Software projects are owned by their respective contributors and licensed as indicated in each repository.",
  },
  {
    title: "User Content",
    body: "If the website provides contact forms or similar features, you are solely responsible for the content you submit. Do not submit harmful, illegal, or inappropriate content.",
  },
  {
    title: "Third-Party Services",
    body: "This website may link to third-party services including GitHub. We are not responsible for the availability, content, or practices of third-party services.",
  },
  {
    title: "Availability",
    body: "We make reasonable efforts to keep the website and download links functional, but we do not guarantee uninterrupted availability. Software downloads are hosted on GitHub Releases.",
  },
  {
    title: "Disclaimer",
    body: 'Software is provided "as is" without warranty of any kind. Use at your own risk. We are not responsible for any data loss or damage resulting from the use of downloaded software.',
  },
  {
    title: "Liability",
    body: "To the maximum extent permitted by law, the developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from use of the website or software.",
  },
  {
    title: "Changes",
    body: "These terms may be updated at any time. Continued use of the website after changes constitutes acceptance of the new terms.",
  },
];

export default function TermsPage() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <h1 className="font-swiss font-black text-5xl md:text-6xl tracking-tighter uppercase text-swiss-fg mb-4">
          Terms of Service
        </h1>
        <p className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40 mb-12">
          Last updated: August 2026
        </p>

        <div className="space-y-0 border-2 border-swiss-border">
          {SECTIONS.map((section, i) => (
            <section
              key={section.title}
              className={`py-6 px-6 border-b-2 border-swiss-border last:border-0 ${i % 2 === 0 ? "bg-swiss-bg" : "bg-swiss-muted"}`}
            >
              <h2 className="font-swiss font-black text-xl md:text-2xl tracking-tighter uppercase text-swiss-fg mb-3">
                {section.title}
              </h2>
              <p className="font-swiss text-sm text-swiss-fg/70 leading-relaxed">
                {section.body}
              </p>
            </section>
          ))}

          <section className="py-6 px-6 border-b-2 border-swiss-border bg-swiss-accent text-swiss-bg">
            <h2 className="font-swiss font-black text-xl md:text-2xl tracking-tighter uppercase text-swiss-bg mb-3">
              Contact
            </h2>
            <p className="font-swiss text-sm text-swiss-bg/80 leading-relaxed">
              For questions about these terms, contact:{" "}
              <a
                href="mailto:lorenzlanz28@gmail.com"
                className="text-swiss-bg font-bold underline underline-offset-4 decoration-swiss-bg hover:text-swiss-fg transition-colors duration-150 break-all"
              >
                lorenzlanz28@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
