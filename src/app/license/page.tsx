import { LegalPage, type LegalSection } from "@/components/legal/LegalPage";

export const metadata = {
  title: "License",
  description: "License information for Lorenz.dev and projects.",
};

const SECTIONS: LegalSection[] = [
  {
    title: "Tala",
    body: (
      <>
        <p>Tala is licensed under the MIT License.</p>
        <div className="mt-5 rounded-md border border-ink/10 bg-ink/[0.03] p-5 font-mono text-xs leading-relaxed text-swiss-fg/70 md:p-6">
          <p className="font-bold text-swiss-fg">MIT License</p>
          <p className="mb-4 text-swiss-fg/40">Copyright (c) 2026 e1yu</p>
          <p className="mb-3">
            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation
            files, to deal in the Software without restriction, including
            without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the
            Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:
          </p>
          <p className="mb-3">
            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.
          </p>
          <p>
            THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
            HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
            WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
            FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
            OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </div>
      </>
    ),
  },
  {
    title: "Website",
    body: "The website design, original content, and documentation are provided for informational purposes. The source code for this website may be available on GitHub.",
  },
  {
    title: "Third-party",
    body: "Third-party libraries and dependencies used by the software are subject to their respective licenses. Refer to each project's repository for specific license information.",
  },
];

export default function LicensePage() {
  return (
    <LegalPage
      title="License"
      href="/license"
      lede="The fine print."
      sections={SECTIONS}
      contactTopic="licensing"
    />
  );
}
