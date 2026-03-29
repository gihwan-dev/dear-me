'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Sparkles from '@/components/ui/Sparkles';

export default function StepLanding() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center overflow-hidden">
      <div className="relative">
        <Sparkles count={5} />

        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[280px] mx-auto mb-6"
        >
          <Image
            src="/images/optimized/hero.webp"
            alt="Dear Me - 봉인된 편지 일러스트"
            width={1280}
            height={714}
            unoptimized
            preload
            className="w-full h-auto drop-shadow-sm"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative z-10 font-[family-name:var(--font-script)] text-4xl text-rose-gold mb-3"
        >
          Dear Me
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative z-10 text-sm text-warm-gray font-[family-name:var(--font-body)] leading-relaxed max-w-[300px] mx-auto"
        >
          미래의 나에게, 혹은 소중한 사람에게<br />
          마음을 담은 편지를 보내보세요
        </motion.p>
      </div>
    </div>
  );
}
