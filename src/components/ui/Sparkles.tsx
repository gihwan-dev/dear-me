'use client';

import { motion } from 'framer-motion';

interface SparklesProps {
  count?: number;
  className?: string;
}

const sparkleColors = ['#FFD6E0', '#E8D5F5', '#F0D5CC', '#FFDAB9', '#D4E7D0'];

function StarSVG({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
    </svg>
  );
}

export default function Sparkles({ count = 7, className = '' }: SparklesProps) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${Math.random() * 90 + 5}%`,
    left: `${Math.random() * 90 + 5}%`,
    size: Math.random() * 10 + 6,
    color: sparkleColors[i % sparkleColors.length],
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ top: s.top, left: s.left }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.6, 1.2, 0.6],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        >
          <StarSVG size={s.size} color={s.color} />
        </motion.div>
      ))}
    </div>
  );
}
