import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';

import AboutPage from './AboutPage.jsx';
import Hero from '../components/hero.jsx';
import PillNav from '../components/nav.jsx';
import { useIntroReady } from '../components/introContext.jsx';
import logo from '../assets/react.svg';

// How far (in screen heights) the user scrolls while Home dissolves into
// About. During this distance both sections stay pinned in place.
const FADE_SCREENS = 1.5;

const EASE = [0.22, 1, 0.36, 1];

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function HomePage() {
  const location = useLocation();
  const introReady = useIntroReady();
  const reduceMotion = useReducedMotion();
  const [aboutActive, setAboutActive] = useState(false);
  const [aboutIntroKey, setAboutIntroKey] = useState(0);
  const [homeIntroKey, setHomeIntroKey] = useState(0);
  const [navIntroKey, setNavIntroKey] = useState(0);
  const lastProgressRef = useRef(0);

  const { scrollY } = useScroll();

  // 0 -> 1 across the pinned fade distance (recomputed from the live
  // viewport height, so resizing/mobile address-bar changes stay correct).
  const rawProgress = useTransform(scrollY, (y) =>
    clamp01(y / (window.innerHeight * FADE_SCREENS))
  );

  // Light smoothing so wheel/trackpad steps feel fluid, and the animation
  // stays scroll-synced in both directions.
  const progress = useSpring(rawProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.3,
    restDelta: 0.0005,
  });

  // ---- HOME: fades out while drifting up and shrinking slightly (0 -> 0.5)
  const heroOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  // Once gone, hide it entirely so it can't catch the pointer or cost paint.
  const heroVisibility = useTransform(progress, (v) => (v < 0.5 ? 'visible' : 'hidden'));

  // ---- ABOUT: rays + content intensify from blank, in place (0.45 -> 1)
  const aboutOpacity = useTransform(progress, [0.45, 1], [0, 1]);

  // Re-render only when crossing the halfway point (drives the nav highlight).
  useMotionValueEvent(rawProgress, 'change', (v) => {
    setAboutActive(v > 0.5);

    if (v > 0.45 && lastProgressRef.current <= 0.45) {
      setAboutIntroKey((key) => key + 1);
    }

    if (v < 0.3 && lastProgressRef.current >= 0.3) {
      setHomeIntroKey((key) => key + 1);
      setNavIntroKey((key) => key + 1);
    }

    lastProgressRef.current = v;
  });

  // ---- Nav: "About" scrolls to the About state, "Home" back to the top.
  useEffect(() => {
    if (!introReady || location.pathname !== '/') return undefined;

    const scrollToY = (y) =>
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });

    if (location.hash === '#about') {
      const t = setTimeout(() => scrollToY(window.innerHeight * FADE_SCREENS), 50);
      return () => clearTimeout(t);
    }
    // 'default' key = first load/refresh: leave browser scroll restoration alone.
    if (location.key !== 'default') {
      scrollToY(0);
    }
    return undefined;
  }, [location.key, location.hash, location.pathname, introReady, reduceMotion]);

  const navItems = [
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '#about' },
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  const navShown = introReady || reduceMotion;

  return (
    <div className="relative w-full bg-black text-white">
      {/* Fixed so the nav stays visible during the whole transition */}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-0"
        initial={reduceMotion ? false : { opacity: 0, y: -24 }}
        animate={navShown ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      >
        <PillNav
          key={navIntroKey}
          logo={logo}
          logoAlt="Company Logo"
          items={navItems}
          activeHref={aboutActive ? '#about' : location.pathname}
        />
      </motion.div>

      <main>
        {/**
          Pinning layout (no fixed heights, so About can be any length):
          - Hero is a sticky full-screen layer on top.
          - About is pulled up (-100vh) to sit exactly under the hero and is
            sticky too, so its first screen stays put while it fades in.
          - The trailing spacer is the extra scroll distance that gives the
            fade room to play; after it, About scrolls normally.
        */}
        <section id="home" className="relative w-full">
          <motion.div
            className="sticky top-0 z-20 h-screen w-full will-change-transform"
            style={{
              opacity: heroOpacity,
              visibility: heroVisibility,
            }}
          >
            <Hero key={homeIntroKey} />
          </motion.div>

          <motion.div
            className="sticky top-0 z-10 -mt-[100vh]"
            style={{ opacity: aboutOpacity }}
          >
            <AboutPage key={aboutIntroKey} />
          </motion.div>

          <div aria-hidden="true" style={{ height: `${FADE_SCREENS * 100}vh` }} />
        </section>
      </main>
    </div>
  );
}

export default HomePage;