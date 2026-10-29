"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { HERO_SLIDES } from "@/lib/books";
import { Button } from "@/components/ui/button";

const DURATION = 5500;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % HERO_SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, DURATION);
    return () => clearInterval(t);
  }, [next, paused]);

  const slide = HERO_SLIDES[index];

  return (
    <section
      className="relative h-[440px] md:h-[540px] overflow-hidden bg-brand-deep"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-brand-deep/95 via-brand-deep/70 to-brand-deep/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto flex items-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl text-white"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold-light px-4 py-1.5 text-xs font-extrabold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              {slide.tagline}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-white/85 text-sm md:text-lg leading-8 mb-7 max-w-lg">
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gold">
                <Link href={slide.ctaHref}>{slide.ctaLabel}</Link>
              </Button>
              <Button asChild size="lg" variant="light">
                <Link href="/#categories">تصفح الأقسام</Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={next}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white p-2.5 hover:bg-white/25 transition-colors z-10"
        aria-label="الشريحة التالية"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={prev}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white p-2.5 hover:bg-white/25 transition-colors z-10"
        aria-label="الشريحة السابقة"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2 bg-white/40 hover:bg-white/60"}`}
            aria-label={`الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
