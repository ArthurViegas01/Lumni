import type { Dictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";

export function SiteFooter({ footer }: { footer: Dictionary["footer"] }) {
  return (
    <footer className="theme-dark bg-bg">
      <div className="mx-auto flex max-w-site flex-col gap-2 px-4 py-10 text-sm text-ink-quiet md:flex-row md:justify-between md:px-8">
        <span className="font-display text-base text-ink">{site.name}</span>
        <span>
          © {new Date().getFullYear()} {site.name}. {footer.rights}
        </span>
      </div>
    </footer>
  );
}
