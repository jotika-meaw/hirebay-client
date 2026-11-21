"use client";

import { motion, useReducedMotion } from "motion/react";

// Word-by-word text generate: each word fades up from blur(8px) with a
// 30ms stagger. Reduced motion renders the final state instantly.
export default function TextGenerate({ text, className, baseDelay = 0.3 }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden={false}
          className="mr-[0.26em] inline-block"
          initial={reduce ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: baseDelay + i * 0.03, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
