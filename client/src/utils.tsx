import type { RefObject } from "react";
import { useEffect, useState } from "react";

export const scrollToBottom = (ref: RefObject<HTMLElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

export function getRotatingIndex(length: number, delay = 7500) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % length);
    }, delay);
    return () => clearInterval(interval);
  }, [length, delay]);

  return index;
}
