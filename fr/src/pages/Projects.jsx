import club from '../assets/projects/club.png';
import res from '../assets/projects/resumeparser.png';
import skillbridge from '../assets/projects/skillbridge.png';
import quickshift from '../assets/projects/quickshift.png';
import spa from '../assets/projects/spa.png';
import gene from '../assets/projects/gene.png';
import cnc from '../assets/projects/cnc.png';
import LightRays from '../components/effects/Lightrays.jsx';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import CircularCarousel from '../components/effects/CircularCarousel.jsx';

const EASE = [0.22, 1, 0.36, 1];
const pad = (n) => String(n).padStart(2, '0');
// Scroll timeline (0 -> 1 across this section's pinned distance).
// AboutPage uses EXPERIENCES_FADE; HomePage uses PROJECTS_FADE / PROJECTS_NAV_TARGET.
// ---------------------------------------------------------------------------
export const PROJECTS_SCREENS = 5.5;          // section height in screens (= scroll length)
export const EXPERIENCES_FADE = [0.06, 0.22]; // Experiences: 1 -> 0
export const PROJECTS_FADE = [0.12, 0.28];    // Projects:    0 -> 1
export const ORBIT_RANGE = [0.34, 0.94];      // orbit spins after the cross-fade
export const PROJECTS_NAV_TARGET = 0.3;       // where the "Projects" nav link lands

/**
 * Live 0 -> 1 progress of a tall section while its sticky child is pinned.
 * Reads getBoundingClientRect() on every scroll, so it stays correct inside
 * HomePage's pinned wrapper (framer's useScroll target can drift there).
 */
export function useSectionProgress(ref) {
  const progress = useMotionValue(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      progress.set(travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [ref, progress]);

  return progress;
}

// ---------------------------------------------------------------------------
// EDIT ME: replace with your real projects.
//   date    : shown on page 1 of the card
//   preview : URL of the deployed site, shown in the iframe on page 2.
//             Leave it '' to show the screenshot instead (e.g. GitHub pages
//             and many sites refuse to be embedded in an iframe).
//   github / live : buttons on page 2
//   tags    : tech-stack chips on page 2
// ---------------------------------------------------------------------------
const projects = [
  {
    title: 'Club Management System',
    date: 'Month YYYY',
    description: 'A complete platform for managing club memberships, events, announcements and student activities.',
    tags: ['React', 'Full Stack', 'Database'],
    images: [club],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'Resume Parser',
    date: 'Month YYYY',
    description: 'An intelligent resume parsing application that extracts and structures candidate information.',
    tags: ['Python', 'NLP', 'GenAI'],
    images: [res],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'SkillBridge',
    date: 'Month YYYY',
    description: 'A skill-development and opportunity platform designed to connect learners with practical growth paths.',
    tags: ['React', 'Node.js', 'MongoDB'],
    images: [skillbridge],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'QuickShift',
    date: 'Month YYYY',
    description: 'A fast, responsive application experience built around streamlined workflows and quick interactions.',
    tags: ['React', 'JavaScript', 'UI/UX'],
    images: [quickshift],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'Smart Process Automation',
    date: 'Month YYYY',
    description: 'An automation-oriented solution for simplifying repetitive digital processes and operations.',
    tags: ['Automation', 'Python', 'Workflow'],
    images: [spa],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'Gene Analysis',
    date: 'Month YYYY',
    description: 'A data-focused project exploring genomic datasets and transforming results into useful insights.',
    tags: ['Python', 'Data Science', 'AI'],
    images: [gene],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
  {
    title: 'CNC Monitoring',
    date: 'Month YYYY',
    description: 'A monitoring interface for CNC workflows, machine activity and operational data visualization.',
    tags: ['React', 'IoT', 'Data Visualization'],
    images: [cnc],
    preview: '',
    github: 'https://github.com/DeepanB2005',
    live: 'https://github.com/DeepanB2005',
  },
];

// Map the project data onto the shape CircularCarousel expects.
const orbitItems = projects.map((p) => ({
  title: p.title,
  date: p.date,
  description: p.description,
  image: p.images[0],
  preview: p.preview,
  git: p.github,
  live: p.live,
  stack: p.tags,
}));

// Deterministic floating particles (no Math.random -> stable between renders).
const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin(i * 999 + n * 77) * 10000;
    return x - Math.floor(x);
  };
  return {
    left: r(1) * 100,
    top: r(2) * 100,
    size: 2 + r(3) * 3,
    duration: 6 + r(4) * 8,
    delay: r(5) * 5,
    drift: 20 + r(6) * 50,
    pink: r(7) > 0.7,
  };
});

/**
 * `progress` (optional): 0 -> 1 MotionValue supplied by AboutPage so Experiences
 * fades out in sync. Used standalone, it measures itself.
 */
function ProjectsPage({ progress: progressProp }) {
  const sectionRef = useRef(null);
  const controlsRef = useRef(null); // receives { goTo(index) } from the carousel
  const ownProgress = useSectionProgress(sectionRef);
  const progress = progressProp ?? ownProgress;

  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(0);

  // Cross-fade in: invisible while Experiences is still on screen.
  const reveal = useTransform(progress, PROJECTS_FADE, [0, 1]);
  const revealPointer = useTransform(reveal, (v) => (v > 0.5 ? 'auto' : 'none'));
  const revealVisibility = useTransform(reveal, (v) => (v > 0 ? 'visible' : 'hidden'));

  // 0 -> 1 while the orbit turns (drives the HUD progress line)
  const orbitLocal = useTransform(progress, ORBIT_RANGE, [0, 1], { clamp: true });

  // Mount the carousel when the fade starts (and remount when you scroll back
  // up and down again). Its angle comes straight from `progress`.
  useMotionValueEvent(reveal, 'change', (v) => setShown(v > 0));
  useEffect(() => {
    setShown(reveal.get() > 0);
  }, [reveal]);

  const particles = useMemo(() => PARTICLES, []);
  const current = projects[active] ?? projects[0];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="pointer-events-none relative w-full text-white mb-10"
      style={{ height: `${PROJECTS_SCREENS * 100}vh` }}
    >
      <motion.div
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden"
        style={{ opacity: reveal, visibility: revealVisibility, pointerEvents: revealPointer }}
      >
        {/* ---------- background ---------- */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#a4f8f4"
            raysSpeed={1}
            lightSpread={0.12}
            rayLength={3.6}
            glow={0.7}
            haze={0.75}
            followMouse={false}
            mouseInfluence={0.15}
            rayDensity={1}
            tilt={0}
            raySharpness={0.15}
            atmosphere={1}
            intensity={0.8}
            fadeDistance={1}
            saturation={1}
            noiseAmount={0}
            distortion={0}
            pulsating={false}
            cursorShadow
            clickPulse
            intro
            lightMode={false}
          />
        </div>

        {/* faint grid, fading out towards the edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
          }}
        />

        {/* drifting aurora blobs
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-pink-400/10 blur-3xl"
          animate={{ x: [0, -90, 0], y: [0, 50, 0], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        /> */}

        {/* floating particles */}
        {shown &&
          particles.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              className={`pointer-events-none absolute rounded-full ${p.pink ? 'bg-pink-300' : 'bg-cyan-300'}`}
              style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
              animate={{ y: [0, -p.drift, 0], opacity: [0.1, 0.65, 0.1] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

        {/* ---------- heading ---------- */}
        <motion.div
          initial={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
          animate={
            shown
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: -30, filter: 'blur(10px)' }
          }
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute left-0 right-0 z-20 top-[clamp(1.25rem,3.5vh,3.5rem)] text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-4">
            <motion.span
              className="h-px bg-gradient-to-r from-transparent to-cyan-300/70"
              initial={{ width: 0 }}
              animate={{ width: shown ? 56 : 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE }}
            />
            <p className="text-sm uppercase tracking-[0.5em] text-cyan-300/80">Selected Work</p>
            <motion.span
              className="h-px bg-gradient-to-l from-transparent to-cyan-300/70"
              initial={{ width: 0 }}
              animate={{ width: shown ? 56 : 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE }}
            />
          </div>
          <motion.h2
            className="bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl"
            style={{
              backgroundImage: 'linear-gradient(90deg,#ffffff,#7ffcf5,#ffb3c1,#ffffff)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
            }}
            animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          >
            Projects
          </motion.h2>
        </motion.div>

        {/* ---------- carousel ---------- */}
        <motion.div
          className="absolute left-0 right-0 z-10 top-[clamp(7.5rem,15vh,10rem)] bottom-[5.75rem] w-full"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {shown && (
            <CircularCarousel
              items={orbitItems}
              preset="orbit"
              // the orbit is driven by this section's scroll progress, no auto spin
              progress={progress}
              scrollRef={sectionRef}
              controlsRef={controlsRef}
              range={ORBIT_RANGE}
              cardWidth={400}
              cardHeight={450}
              gap={60}
              snap
              captions={false}
              depthFade={0.58}
              cornerRadius={22}
              onChange={setActive}
            />
          )}
        </motion.div>

        {/* ---------- HUD: current project, dots, orbit progress ---------- */}
        <motion.div
          className="absolute bottom-4 z-20 left-1/2 flex w-full max-w-2xl -translate-x-1/2 flex-col items-center gap-3 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        >
          <div className="flex h-7 items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex items-baseline gap-3"
              >
                <span className="font-mono text-sm tabular-nums text-cyan-300">
                  {pad(active + 1)}
                  <span className="text-white/30"> / {pad(projects.length)}</span>
                </span>
                <span className="text-lg font-semibold tracking-tight">{current.title}</span>
                <span className="hidden items-center gap-1.5 md:flex">
                  {current.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {projects.map((p, i) => (
              <button
                key={p.title}
                type="button"
                aria-label={`Show ${p.title}`}
                onClick={() => controlsRef.current?.goTo(i)}
                className="group relative flex h-4 items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === active
                      ? 'w-8 bg-cyan-300 shadow-[0_0_12px_rgba(39,255,243,0.8)]'
                      : 'w-1.5 bg-white/25 group-hover:w-3 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-cyan-300 via-cyan-200 to-pink-300"
              style={{ scaleX: orbitLocal }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default ProjectsPage;