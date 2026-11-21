"use client";

import { motion, useReducedMotion } from "motion/react";

// Scroll reveal wrapper (03 §6): rise 40px + fade, once, 20% in view.
// Children stagger via the `delay` prop. Reduced motion renders instantly.
export default function Reveal({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
