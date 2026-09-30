"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { htmlLang, type Locale } from "@/i18n/config";
import { equivalentHref } from "@/i18n/routes";

/** Link para a mesma página no outro idioma (ou o pai mais próximo que existe lá). */
export function useEquivalentHref(target: Locale): string {
  return equivalentHref(usePathname(), target);
}

type LanguageLinkProps = {
  target: Locale;
  label: string;
  ariaLabel: string;
  className?: string;
  onClick?: () => void;
};

export function LanguageLink({ target, label, ariaLabel, className, onClick }: LanguageLinkProps) {
  const href = useEquivalentHref(target);
  return (
    <Link
      href={href}
      hrefLang={htmlLang[target]}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
