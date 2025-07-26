import type { RefObject } from "react";

export const scrollToBottom = (ref: RefObject<HTMLElement | null>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};
