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
  url = "tala.app",
  image,
  imageAlt = "Application preview",
  className,
  children,
}: BrowserPreviewProps) {
  return (
    <div
      className={cn(
        "border-2 border-swiss-border bg-swiss-bg overflow-hidden",
        className
      )}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 h-12 border-b-2 border-swiss-border bg-swiss-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-swiss-fg" />
          <div className="w-3 h-3 bg-swiss-fg/30" />
          <div className="w-3 h-3 bg-swiss-fg/10" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="font-swiss text-[11px] font-bold tracking-widest uppercase text-swiss-fg/50">{title}</span>
        </div>
        <div className="w-6" />
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-3 px-4 h-10 border-b-2 border-swiss-border">
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-swiss-fg/40">
          <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-swiss-fg/40">
          <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
        <div className="flex-1 h-6 px-3 flex items-center border border-swiss-border bg-swiss-bg">
          <span className="font-swiss text-[10px] font-bold tracking-widest uppercase text-swiss-fg/50">
            {url}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-swiss-muted swiss-grid-pattern">
        {image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-auto block"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
