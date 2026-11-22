import { motion } from 'framer-motion';
import { SkillGroup } from './SkillGroup.jsx';
import { PageHeading } from '../PageHeadings.jsx';

export function TechStacksPhase({ progress, exitProgress, techOpacity, techY, techBlur, techPointer, techStacks }) {
  const total = techStacks.reduce((n, g) => n + g.items.length, 0);
  let running = 0;

  return (
    <motion.div
      style={{
        opacity: techOpacity,
        y: techY,
        filter: techBlur,
        pointerEvents: techPointer,
      }}
      className="absolute inset-0 z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pt-16 md:px-12 lg:px-20"
    >
      <div className="mb-4">
        <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-300">
          What I Work With
        </p>
        <PageHeading
          name="techStacks"
          warpStrength={0.12}
          warpScale={2.2}
          speed={1.25}
          pointerStrength={1.35}
          refraction={0.024}
          fontSize={82}
          fontWeight={700}
          letterSpacing="-0.04em"
          lineHeight={0.9}
          className="!h-[72px] !min-h-0 !w-[260px] md:!h-[82px] md:!w-[330px]"
          style={{ height: '72px', width: '260px' }}
        />
        <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-cyan-300" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {techStacks.map((group, i) => {
          const startIndex = running;
          running += group.items.length;
          return (
            <SkillGroup
              key={group.title}
              progress={progress}
              exitProgress={exitProgress}
              index={i}
              title={group.title}
              accent={group.accent}
              items={group.items}
              wide={group.wide}
              startIndex={startIndex}
              total={total}
            />
          );
        })}
      </div>
    </motion.div>
  );
}