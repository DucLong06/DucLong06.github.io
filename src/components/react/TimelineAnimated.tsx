/**
 * TimelineAnimated.tsx — React island for stagger-reveal timeline.
 * Uses framer-motion whileInView with 0.1s stagger per child.
 * Hydrated client:visible — zero JS cost until scrolled into view.
 * Only imports `motion` to keep bundle minimal.
 */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // --ease-soft
    },
  },
};

export default function TimelineAnimated({ children }: Props) {
  return (
    <motion.div
      className="timeline-animated"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Each direct child gets the item animation */}
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  );
}
