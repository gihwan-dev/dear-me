'use client';

import { motion } from 'framer-motion';

export default function EnvelopeAnimation() {
  return (
    <div className="relative w-56 h-44 mx-auto">
      {/* Envelope body */}
      <motion.svg
        viewBox="0 0 200 150"
        className="w-full h-full"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
      >
        {/* Envelope back */}
        <rect x="10" y="30" width="180" height="110" rx="8" fill="#FFF8F0" stroke="#F0D5CC" strokeWidth="1.5" />

        {/* Envelope flap */}
        <motion.path
          d="M10 30 L100 85 L190 30"
          fill="none"
          stroke="#F0D5CC"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />

        {/* Envelope flap fill */}
        <path d="M10 30 L100 85 L190 30 L190 30 L10 30Z" fill="#FFD6E0" opacity="0.3" />

        {/* Decorative lines on envelope */}
        <motion.line
          x1="50" y1="90" x2="150" y2="90"
          stroke="#E8D5F5"
          strokeWidth="1"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
        />
        <motion.line
          x1="60" y1="100" x2="140" y2="100"
          stroke="#E8D5F5"
          strokeWidth="1"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.6 }}
        />
        <motion.line
          x1="70" y1="110" x2="130" y2="110"
          stroke="#E8D5F5"
          strokeWidth="1"
          strokeDasharray="4 3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.7 }}
        />
      </motion.svg>

      {/* Wax Seal */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 15 }}
      >
        <div className="w-14 h-14 rounded-full bg-rose-gold flex items-center justify-center shadow-float">
          <motion.svg
            viewBox="0 0 24 24"
            className="w-7 h-7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <motion.path
              d="M5 12l5 5L19 7"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            />
          </motion.svg>
        </div>
      </motion.div>

      {/* Sparkle bursts */}
      {[
        { x: -20, y: -10, delay: 0.9 },
        { x: 30, y: -25, delay: 1.0 },
        { x: 40, y: 10, delay: 1.1 },
        { x: -30, y: 15, delay: 1.05 },
        { x: 0, y: -35, delay: 0.95 },
      ].map((spark, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            x: spark.x,
            y: spark.y,
          }}
          transition={{ delay: spark.delay, duration: 0.6, ease: 'easeOut' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={i % 2 === 0 ? '#FFD6E0' : '#E8D5F5'}>
            <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
