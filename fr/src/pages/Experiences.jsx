import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ReflectiveCard from '../components/effects/ReflectiveCard';
import chain from '../assets/chain.png';
import SoftAurora from '../components/effects/SoftAurora';

const EASE = [0.22, 1, 0.36, 1];
const COLS = 16;
const ROWS = 9;

function PixelReveal({ active, runKey }) {
  const randoms = useMemo(
    () => Array.from({ length: COLS * ROWS }, () => Math.random()),
    [runKey]
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {randoms.map((r, i) => (
        <motion.div
          key={`${runKey}-${i}`}
          initial={{ opacity: 1, backgroundColor: '#030712' }}
          animate={
            active
              ? { opacity: [1, 1, 0], backgroundColor: ['#030712', '#22d3ee', '#030712'] }
              : { opacity: 1, backgroundColor: '#030712' }
          }
          transition={
            active
              ? { duration: 0.7, delay: r * 0.9, times: [0, 0.5, 1], ease: 'easeOut' }
              : { duration: 0.15 }
          }
        />
      ))}
    </div>
  );
}

const headingVariants = {
  hidden: { opacity: 0, y: -30, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay: 0.1 },
  },
};

// Cards fly in from the far left / far right and land with a soft spring.
// custom = -1 (from left) or 1 (from right)
const cardVariants = {
  hidden: (dir) => ({
    opacity: 0,
    x: `${dir * 85}vw`,
    rotate: dir * 10,
    scale: 0.9,
  }),
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 55,
      damping: 15,
      mass: 1,
      delay: 0.9,
    },
  },
};

// Card text appears only after the card has landed.
const contentVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 1.5 },
  },
};

const experiences = [
  {
    side: -1,
    name: 'ChainAims Corps',
    role: 'Senior Developer Intern',
    tint: '#ed7f7f',
    title: 'Software Engineer Intern',
    period: 'Jan 2024 - Present',
    points: [
      'Developed and maintained web applications using React and Node.js.',
      'Collaborated with cross-functional teams to design and implement new features.',
      'Optimized application performance and improved user experience.',
    ],
  },
  {
    side: 1,
    name: 'SystimaNX',
    role: 'Software Engineer Intern',
    tint: '#fab958',
    title: 'Software Engineer Intern',
    period: 'Jan 2024 - Present',
    points: [
      'Built feature-rich interfaces and improved product usability.',
      'Worked closely with engineering teams to deliver clean, scalable solutions.',
      'Focused on performance tuning, UI polish, and maintainability.',
    ],
  },
];

function Experiences() {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.9 });

  // Bump the key every time the section scrolls into view, so the aurora,
  // heading and cards all remount and replay their intro on every visit.
  // (State is adjusted during render so there is no flash of the old state.)
  const [introKey, setIntroKey] = useState(0);
  const [wasInView, setWasInView] = useState(false);
  if (inView !== wasInView) {
    setWasInView(inView);
    if (inView) setIntroKey((k) => k + 1);
  }

  const state = inView ? 'visible' : 'hidden';

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white"
    >
      <PixelReveal active={inView} runKey={introKey} />

      <div className="absolute inset-0 z-0">
        <SoftAurora
          key={`aurora-${introKey}`}
          speed={0.45}
          scale={1.7}
          brightness={1.3}
          color1="#f8fdff"
          color2="#ffeba9"
          bandHeight={0.45}
          bandSpread={0.75}
          enableMouseInteraction
          mouseInfluence={0.22}
          spectrum={0.9}
          colorSpeed={0.8}
          noiseFrequency={1.5}
          noiseAmplitude={1.1}
          tilt={6}
          octaveDecay={0.12}
          layerOffset={0.1}
          clickPulse
          intro
          lightMode={false}
          opacity={0.9}
          className="opacity-90"
          style={{ filter: 'saturate(1.2)' }}
        />
      </div>

      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(39,255,243,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_30%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-20 md:px-10 lg:px-12">
        <div className="w-full">
          <motion.div
            key={`heading-${introKey}`}
            variants={headingVariants}
            initial="hidden"
            animate={state}
            className="mb-12 text-center"
          >
            <p className="mb-3 text-sm uppercase tracking-[0.5em] text-cyan-300/80">
              Journey
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Experience
            </h1>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-2">
            {experiences.map((exp) => (
              <motion.div
                key={`${exp.name}-${introKey}`}
                custom={exp.side}
                variants={cardVariants}
                initial="hidden"
                animate={state}
                className="flex justify-center will-change-transform"
              >
                <ReflectiveCard
                  name={exp.name}
                  role={exp.role}
                  videoSrc="/videos/reflection.mp4"
                  webcam={false}
                  tint={exp.tint}
                  metalness={1}
                  roughness={0.2}
                  blurStrength={6}
                  shine={0.2}
                  glare={0.5}
                  grayscale={1}
                  warp={0.6}
                  warpScale={1}
                  bevel={5}
                  tiltStrength={12}
                  radius={24}
                  enableTilt
                  intro
                  width={380}
                  height={500}
                >
                  <motion.div
                    variants={contentVariants}
                    initial="hidden"
                    animate={state}
                    className="flex flex-col items-center gap-3 text-center"
                  >
                    <img src={chain} alt={exp.name} className="h-10 w-10" />
                    <h2 className="text-3xl font-bold text-cyan-300">{exp.name}</h2>
                    <p className="text-lg text-gray-200">{exp.title}</p>
                    <p className="text-sm text-gray-400">{exp.period}</p>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-left text-sm leading-6 text-gray-300">
                      {exp.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </motion.div>
                </ReflectiveCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experiences;