import { ReactNode } from "react";
import Reveal from "@/components/reveal";

export default function SectionTitle({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center max-w-2xl mx-auto">
      <span className="inline-block rounded-full bg-brand/10 text-brand px-4 py-1.5 text-xs font-extrabold tracking-wide">
        {badge}
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold text-ink mt-3 mb-2">{title}</h2>
      {subtitle && <p className="text-stone-500 text-sm md:text-base leading-7">{subtitle}</p>}
    </Reveal>
  );
}
