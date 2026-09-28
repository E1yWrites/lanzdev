import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Terms of Service",
  description: "The terms for using Lorenz.dev and downloading its software, including licences and warranties.",
};

const SECTIONS: LegalSection[] = [
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
    <LegalPage
      title="Terms of Service"
      href="/terms"
      lede="The rules for using this website and the software distributed through it."
      updated="August 2026"
      sections={SECTIONS}
      contactTopic="these terms"
    />
  );
}
