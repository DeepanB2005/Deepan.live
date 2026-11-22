import { motion, useTransform } from 'framer-motion';

// Golden angle spreads the launch directions evenly around the page
const GOLDEN_ANGLE = 2.399963;

export function SkillTile({ skill, index, progress, exitProgress, start = 0.84, end = 0.95 }) {
  const { label, title, logo, icon, glow, invert } = skill;

  // Each tile launches from a different direction, far outside the viewport
  const angle = index * GOLDEN_ANGLE;
  const distance = 1100 + (index % 5) * 160;
  const fromX = Math.cos(angle) * distance;
  const fromY = Math.sin(angle) * distance;
  const fromRotate = (index % 2 === 0 ? 1 : -1) * (240 + (index % 4) * 60);

  const x = useTransform(progress, [start, end], [fromX, 0]);
  const y = useTransform(progress, [start, end], [fromY, 0]);
  const rotate = useTransform(progress, [start, end], [fromRotate, 0]);
  const scale = useTransform(progress, [start, end], [0.4, 1]);
  const opacity = useTransform(progress, [start, start + (end - start) * 0.25], [0, 1]);

  const scatterAngle = index * GOLDEN_ANGLE + 0.35;
  const scatterDistance = 420 + (index % 6) * 90;
  const scatterX = useTransform(exitProgress, [0.08, 0.58], [0, Math.cos(scatterAngle) * scatterDistance]);
  const scatterY = useTransform(exitProgress, [0.08, 0.58], [0, Math.sin(scatterAngle) * scatterDistance]);
  const scatterRotate = useTransform(exitProgress, [0.08, 0.58], [0, (index % 2 ? 1 : -1) * (90 + index * 8)]);
  const scatterOpacity = useTransform(exitProgress, [0.38, 0.62], [1, 0]);

  return (
    // Scroll-driven scatter wrapper: each icon leaves independently
    <motion.div style={{ x: scatterX, y: scatterY, rotate: scatterRotate, opacity: scatterOpacity }}>
      {/* Scroll-driven fly-in wrapper */}
      <motion.div style={{ x, y, rotate, scale, opacity }}>
        <motion.div
          whileHover={{ y: -10, scale: 1.12, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
          className="group flex w-[76px] cursor-pointer flex-col items-center gap-2"
          style={{ '--glow': glow }}
          title={title || label}
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 3 + (index % 4) * 0.35,
              delay: index * 0.12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-2"
          >
            <div className="relative flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md transition-all duration-300 group-hover:border-[color:var(--glow)] group-hover:bg-white/10 group-hover:shadow-[0_0_28px_var(--glow)]">
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 50% 40%, var(--glow), transparent 70%)',
                }}
              />

              <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

              {logo ? (
                <img
                  src={logo}
                  alt={label}
                  loading="lazy"
                  draggable={false}
                  className={`relative z-10 h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110 ${
                    invert ? 'invert' : ''
                  }`}
                />
              ) : (
                <span
                  className="relative z-10 text-[30px] transition-transform duration-300 group-hover:scale-110"
                  style={{ color: glow }}
                >
                  {icon}
                </span>
              )}
            </div>

            <span className="text-center text-[11px] font-medium leading-tight text-gray-300 transition-colors duration-300 group-hover:text-white">
              {label}
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}