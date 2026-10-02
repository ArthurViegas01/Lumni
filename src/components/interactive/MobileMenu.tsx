"use client";

import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { Locale } from "@/i18n/config";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { LanguageLink } from "./LanguageLink";

type NavLink = { label: string; href: string };

type MobileMenuProps = {
  links: readonly NavLink[];
  cta: NavLink;
  /** Idioma de destino: o link aponta para a página equivalente (ver LanguageLink). */
  language: { target: Locale; label: string; ariaLabel: string };
  openLabel: string;
  closeLabel: string;
};

const subscribeNever = () => () => {};

/**
 * Menu de tela cheia do mobile. Acessível: aria-expanded/controls, foco preso no
 * menu enquanto aberto, Esc fecha, foco volta ao botão, rolagem da página travada.
 */
export function MobileMenu({ links, cta, language, openLabel, closeLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // O portal só existe no cliente; no servidor o menu está sempre fechado.
  const isClient = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const button = buttonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current || !button) return;
      const focusables = [button, ...panelRef.current.querySelectorAll<HTMLElement>("a")];
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      button?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  const panel = (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panelRef}
          id={panelId}
          className="tone-base fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between bg-bg px-4 pt-8 pb-10 md:hidden"
          initial={{ opacity: 0, y: reduce ? 0 : -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.fast, ease: EASE }}
        >
          <nav>
            <ul className="flex flex-col gap-2">
              {links.map((link, i) => (
                <m.li
                  key={link.href}
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.base, ease: EASE, delay: 0.05 + i * STAGGER }}
                >
                  <a
                    href={link.href}
                    onClick={close}
                    className="display-caps block border-b border-border py-4 text-3xl font-extrabold tracking-tight text-ink"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between gap-4">
            <LanguageLink
              target={language.target}
              label={language.label}
              ariaLabel={language.ariaLabel}
              onClick={close}
              className="font-mono text-xs tracking-wide text-ink-quiet uppercase"
            />
            <a
              href={cta.href}
              onClick={close}
              className="border border-ink bg-ink px-5 py-3 font-semibold text-bg uppercase"
            >
              {cta.label}
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 flex size-10 items-center justify-center rounded-sm text-ink md:hidden"
      >
        <span aria-hidden className="relative block h-3 w-5">
          <span
            className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute left-0 h-px w-5 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
          />
        </span>
      </button>
      {/* Portal para o <body>: o header usa backdrop-filter, que o torna o bloco de
          contenção de filhos `fixed` e encolheria o painel à altura do header. */}
      {isClient ? createPortal(panel, document.body) : null}
    </>
  );
}
