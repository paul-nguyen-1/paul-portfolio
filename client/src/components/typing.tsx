import * as React from "react";
import { motion, useInView } from "framer-motion";

export function Typing({ text }: { text: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <h3
      ref={ref}
      className="text-md text-start font-mono tracking-tight whitespace-wrap break-words"
    >
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {letter}
        </motion.span>
      ))}
    </h3>
  );
}
