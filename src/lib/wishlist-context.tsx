"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { getBook } from "@/lib/books";

export type WishItem = {
  id: string;
  title: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  ids: string[];
  wishes: WishItem[];
  count: number;
  toggle: (id: string) => void;
  isWished: (id: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "ghaith-wishlist-v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw));
    } catch {
      setIds([]);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  }, [ids, isHydrated]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWished = useCallback((id: string) => ids.includes(id), [ids]);

  const count = useMemo(() => ids.length, [ids]);

  const wishes = useMemo(
    () =>
      ids
        .map((id) => {
          const book = getBook(id);
          if (!book) return null;
          return { id, title: book.title, price: book.price, image: book.image };
        })
        .filter((w): w is WishItem => w !== null),
    [ids]
  );

  const value = useMemo(
    () => ({ ids, wishes, count, toggle, isWished }),
    [ids, wishes, count, toggle, isWished]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
