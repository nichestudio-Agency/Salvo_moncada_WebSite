"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  style?: React.CSSProperties;
}

export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  style,
}: AnimatedSectionProps) {
  const initial =
    direction === "up"
      ? { opacity: 0, y: 24 }
      : direction === "left"
      ? { opacity: 0, x: -24 }
      : direction === "right"
      ? { opacity: 0, x: 24 }
      : { opacity: 0 };

  const animate =
    direction === "up"
      ? { opacity: 1, y: 0 }
      : direction === "left" || direction === "right"
      ? { opacity: 1, x: 0 }
      : { opacity: 1 };

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
