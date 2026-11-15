import { motion, useTransform } from 'framer-motion';
import { SkillTile } from './SkillTile.jsx';

export function SkillGroup({ progress, index, title, accent, items, wide }) {
  const s = 0.74 + index * 0.02;
  const e = s + 0.1;
  const opacity = useTransform(progress, [s, e], [0, 1]);
  const y = useTransform(progress, [s, e], [40, 0]);
  const filter = useTransform(progress, [s, e], ['blur(8px)', 'blur(0px)']);

  return (
    <motion.div
      style={{ opacity, y, filter }}
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md ${
        wide ? 'lg:col-span-2' : ''
      }`}
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
        />
        <h3 className="text-sm font-semibold uppercase tracking-widest text-white md:text-base">
          {title}
        </h3>
        <span
          className="h-px flex-1"
          style={{
            background: `linear-gradient(to right, ${accent}66, transparent)`,
          }}
        />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {items.map((skill, i) => (
          <SkillTile key={skill.label} skill={skill} index={index * 3 + i} />
        ))}
      </div>
    </motion.div>
  );
}
