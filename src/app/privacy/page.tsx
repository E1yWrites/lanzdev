export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Lorenz.dev.",
};

const SECTIONS = [
  {
    title: "Overview",
    body: (
      <>
        This privacy policy describes how this website handles data. The
        website is a personal portfolio and software distribution site
        operated by an individual developer.
      </>
    ),
  },
  {
    title: "Data Collection",
    body: (
      <>
        This website does not collect personal data. There are no user
        accounts, no analytics tracking, no cookies for tracking purposes,
        and no data storage beyond what your browser natively provides.
      </>
    ),
  },
  {
    title: "Cookies",
    body: (
      <>
        This website uses localStorage to persist your theme preference.
        This data remains on your device and is not transmitted to any
        server. No tracking cookies are used.
      </>
    ),
  },
  {
    title: "Analytics",
    body: (
      <>
        This website does not use analytics services. There is no Google
        Analytics, Plausible, Fathom, or any other analytics provider
        configured. No page views or user behavior is tracked.
      </>
    ),
  },
  {
    title: "Downloads",
    body: (
      <>
        Software downloads are served through GitHub Releases. When you
        download a file, GitHub may log your IP address and user agent as
        part of their standard infrastructure. This is handled entirely by
        GitHub and is not controlled by this website.
      </>
    ),
  },
  {
    title: "Third-Party Services",
    body: (
      <>
        Fonts on this website are self-hosted via Next.js font optimization.
        Standard server infrastructure may log requests, but no personal
        profiles are built from them.
      </>
    ),
  },
  {
    title: "Changes",
    body: (
      <>
        This privacy policy may be updated if the website&apos;s data practices
        change. Any changes will be reflected on this page with an updated
        date.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <h1 className="font-swiss font-black text-5xl md:text-6xl tracking-tighter uppercase text-swiss-fg mb-4">
          Privacy Policy
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
              For privacy-related questions, contact:{" "}
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
