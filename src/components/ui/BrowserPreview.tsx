import { cn } from "@/lib/utils";

interface BrowserPreviewProps {
  title?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BrowserPreview({
  title = "Tala",
  url,
  image,
  imageAlt = "Application preview",
  className,
  children,
}: BrowserPreviewProps) {
  return (
    <div
      className={cn(
        "surface-elevated overflow-hidden rounded-lg",
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex h-11 items-center gap-4 border-b border-ink/10 px-4">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <span className="truncate rounded-md border border-ink/10 bg-ink/[0.04] px-3 py-1 font-mono text-[11px] text-swiss-fg/60">
            {url ?? title}
          </span>
        </div>
        <span aria-hidden="true" className="w-[42px]" />
      </div>

      {/* Content */}
      <div className="bg-ink/[0.02]">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={image} alt={imageAlt} className="block h-auto w-full" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
