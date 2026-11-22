import { motion, useTransform } from 'framer-motion';
import { SkillTile } from './SkillTile.jsx';

const FLY_START = 0.84; // first icon starts flying in
const FLY_STAGGER = 0.06; // spread of start times across all icons
const FLY_DURATION = 0.09; // how long each icon takes to land

export function SkillGroup({
  progress,
  exitProgress,
  index,
  title,
  accent,
  items,
  wide,
  startIndex = 0,
  total = 1,
}) {
  // Only the card chrome (background + heading) fades; icons are never faded
  // with it so they stay visible while flying in from outside the page.
  const chromeOpacity = useTransform(progress, [0.84, 0.9], [0, 1]);

  return (
    <div className={`relative p-4 ${wide ? 'lg:col-span-2' : ''}`}>
      <motion.div
        style={{ opacity: chromeOpacity }}
        className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md"
      />

      <motion.div
        style={{ opacity: chromeOpacity }}
        className="relative mb-3 flex items-center gap-3"
      >
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
      </motion.div>

      <div className="relative flex flex-wrap gap-x-4 gap-y-3">
        {items.map((skill, i) => {
          const globalIndex = startIndex + i;
          const start = FLY_START + (globalIndex / Math.max(total, 1)) * FLY_STAGGER;
          return (
            <SkillTile
              key={skill.label}
              skill={skill}
              index={globalIndex}
              progress={progress}
              exitProgress={exitProgress}
              start={start}
              end={start + FLY_DURATION}
            />
          );
        })}
      </div>
    </div>
  );
}