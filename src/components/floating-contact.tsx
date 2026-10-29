"use client";

import Link from "next/link";
import { Phone, Instagram, Facebook } from "lucide-react";
import { motion } from "framer-motion";
import { INSTAGRAM_URL, FACEBOOK_URL, PHONE } from "@/lib/books";

export default function FloatingContact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed bottom-5 left-5 z-40 flex flex-col gap-2.5"
    >
      <a
        href={`tel:${PHONE}`}
        className="rounded-full bg-brand text-white shadow-lift p-3.5 hover:bg-brand-dark hover:scale-110 transition-all"
        aria-label="اتصال هاتفي"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lift p-3.5 hover:scale-110 transition-transform"
        aria-label="إنستغرام"
      >
        <Instagram className="h-5 w-5" />
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-[#1877f2] text-white shadow-lift p-3.5 hover:scale-110 transition-transform"
        aria-label="فيسبوك"
      >
        <Facebook className="h-5 w-5" />
      </a>
    </motion.div>
  );
}
