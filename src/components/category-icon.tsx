import {
  ShieldCheck,
  MoonStar,
  BookOpen,
  ScrollText,
  Scale,
  Feather,
  HeartHandshake,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  moon: MoonStar,
  book: BookOpen,
  scroll: ScrollText,
  scale: Scale,
  feather: Feather,
  heart: HeartHandshake,
};

export default function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
