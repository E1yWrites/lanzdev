import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description: "What Lorenz.dev collects (next to nothing), what it stores in your browser, and how to reach its author.",
};

const SECTIONS: LegalSection[] = [
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
        The documentation search uses localStorage to remember your recent
        searches. This data remains on your device and is not transmitted to
        any server. No tracking cookies are used.
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
    <LegalPage
      title="Privacy Policy"
      href="/privacy"
      lede="What this website does — and does not do — with your data."
      updated="September 2026"
      sections={SECTIONS}
      contactTopic="privacy"
    />
  );
}
