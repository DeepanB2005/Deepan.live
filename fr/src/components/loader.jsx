import { useEffect } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

const NAME = 'DEEPAN';
const MIN_DURATION = 2.4; // seconds the progress line takes
const MAX_WAIT = 6000; // ms: never block longer than this waiting for window load
const EASE = [0.22, 1, 0.36, 1];

function Loader({ onComplete }) {
  const reduce = useReducedMotion();

  // Motion values drive the line + counter without re-rendering React.
  const progress = useMotionValue(0);
  const scaleX = useTransform(progress, (v) => v / 100);
  const label = useTransform(progress, (v) =>
    String(Math.round(v)).padStart(3, '0')
  );

  // Lock scrolling while the loader is visible.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let holdTimer;
    let maxTimer;

    const windowLoaded = new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
        return;
      }
      window.addEventListener('load', resolve, { once: true });
      maxTimer = setTimeout(resolve, MAX_WAIT);
    });

    const controls = animate(progress, 100, {
      duration: reduce ? 0.6 : MIN_DURATION,
      ease: [0.65, 0, 0.35, 1],
    });
    const lineDone = new Promise((resolve) => controls.then(resolve));

    Promise.all([lineDone, windowLoaded]).then(() => {
      if (cancelled) return;
      // brief hold on 100% before revealing the site
      holdTimer = setTimeout(() => {
        if (!cancelled) onComplete();
      }, 250);
    });

    return () => {
      cancelled = true;
      controls.stop();
      clearTimeout(holdTimer);
      clearTimeout(maxTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black text-white"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.9, delay: 0.2, ease: 'easeInOut' },
      }}
    >
      {/* soft breathing glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute h-[45vmin] w-[45vmin] rounded-full bg-cyan-300/10 blur-3xl"
        animate={reduce ? undefined : { scale: [0.85, 1.15, 0.85] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative flex w-[min(80vw,420px)] flex-col items-center"
        exit={{
          scale: 1.12,
          opacity: 0,
          filter: 'blur(6px)',
          transition: { duration: 0.7, ease: EASE },
        }}
      >
        {/* Name, revealed letter by letter */}
        <div
          className="flex overflow-hidden pb-2 pl-[0.3em] text-5xl tracking-[0.3em] sm:text-6xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {NAME.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={reduce ? false : { y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: EASE }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Progress line */}
        <div className="mt-10 h-px w-full overflow-hidden bg-white/10">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-cyan-300 via-white to-violet-400"
            style={{ scaleX }}
          />
        </div>

        <div className="mt-4 flex w-full justify-between text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
          <span>Loading</span>
          <motion.span className="tabular-nums">{label}</motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Loader;