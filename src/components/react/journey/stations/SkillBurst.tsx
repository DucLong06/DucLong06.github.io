/**
 * SkillBurst.tsx — Expanded sub-skills for one active cluster (TRANSFORM).
 * Each item shows a name, a 1–5 level bar, and optional years — all real DOM.
 */
import { motion } from 'framer-motion';
import type { SkillCluster } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  cluster: SkillCluster;
}

export default function SkillBurst({ cluster }: Props) {
  return (
    <motion.ul
      className="skill-burst"
      role="list"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      style={{ ['--cluster-color' as string]: cluster.color }}
    >
      {cluster.items.map((item) => (
        <li key={item.name} className="skill-burst__item">
          <span className="skill-burst__name">{item.name}</span>
          <span className="skill-burst__bar" aria-hidden="true">
            <span className="skill-burst__fill" style={{ width: `${(item.level / 5) * 100}%` }} />
          </span>
          <span className="skill-burst__meta">
            {item.level}/5{item.years ? ` · ${item.years}y` : ''}
          </span>
        </li>
      ))}
    </motion.ul>
  );
}
