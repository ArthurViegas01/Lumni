import { Scramble } from "@/components/effects/Scramble";

/** Rótulo curto acima de títulos, em mono. `scramble` decifra o texto ao entrar na tela. */
export function Eyebrow({ text, scramble = false }: { text: string; scramble?: boolean }) {
  return (
    <p className="mb-4 font-mono text-xs tracking-widest text-accent uppercase">
      {scramble ? <Scramble text={text} /> : text}
    </p>
  );
}
