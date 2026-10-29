import Link from "next/link";
import { DESIGNER_URL } from "@/lib/books";

export default function DesignerCredit() {
  return (
    <p className="text-xs text-white/60 flex items-center gap-1.5">
      DESIGNED BY
      <Link
        href={DESIGNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-extrabold text-gold hover:text-gold-light transition-colors"
      >
        K.Haithem
      </Link>
    </p>
  );
}
