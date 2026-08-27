export const metadata = {
  title: "License",
  description: "License information for Lorenz.dev and projects.",
};

export default function LicensePage() {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <h1 className="font-swiss font-black text-5xl md:text-6xl tracking-tighter uppercase text-swiss-fg mb-4">
          License
        </h1>
        <p className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/40 mb-12">
          The fine print.
        </p>

        <div className="font-swiss text-sm text-swiss-fg/70 leading-relaxed space-y-0 border-2 border-swiss-border">
          <section className="py-6 px-6 border-b-2 border-swiss-border bg-swiss-bg">
            <h2 className="font-swiss font-black text-xl md:text-2xl tracking-tighter uppercase text-swiss-fg mb-3">
              Tala
            </h2>
            <p className="mb-4">
              Tala is licensed under the MIT License.
            </p>
            <div className="border-2 border-swiss-border p-5 bg-swiss-muted swiss-dots">
              <p className="font-swiss font-black text-swiss-fg mb-2 uppercase tracking-tight">MIT License</p>
              <p className="text-swiss-fg/40 text-[10px] font-bold tracking-widest uppercase mb-4 font-swiss">
                Copyright (c) 2026 e1yu
              </p>
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
          </section>

          <section className="py-6 px-6 border-b-2 border-swiss-border bg-swiss-muted">
            <h2 className="font-swiss font-black text-xl md:text-2xl tracking-tighter uppercase text-swiss-fg mb-3">
              Website
            </h2>
            <p>
              The website design, original content, and documentation are
              provided for informational purposes. The source code for this
              website may be available on GitHub.
            </p>
          </section>

          <section className="py-6 px-6 border-b-2 border-swiss-border bg-swiss-bg">
            <h2 className="font-swiss font-black text-xl md:text-2xl tracking-tighter uppercase text-swiss-fg mb-3">
              Third-party
            </h2>
            <p>
              Third-party libraries and dependencies used by the software are
              subject to their respective licenses. Refer to each project&apos;s
              repository for specific license information.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
