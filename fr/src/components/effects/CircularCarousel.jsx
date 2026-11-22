'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Sample data – replace with your own projects                       */
/*  preview : page that is shown inside the iframe                     */
/*  git     : repository link                                          */
/*  live    : deployed site link                                       */
/*  stack   : tech stack chips                                         */
/* ------------------------------------------------------------------ */
const DEFAULT_ITEMS = [
  {
    title: 'Portfolio v3',
    date: 'Nov 2026',
    description:
      'A personal portfolio with scroll-driven 3D sections, a case-study CMS and a fully accessible, keyboard-friendly layout. Built to load in under a second on mid-range phones.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/portfolio',
    live: 'https://example.com',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion']
  },
  {
    title: 'Shopline',
    date: 'Aug 2026',
    description:
      'Headless e-commerce storefront with cart, checkout, order tracking and an admin dashboard for inventory and discounts.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/shopline',
    live: 'https://example.com',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe']
  },
  {
    title: 'Chatterbox',
    date: 'May 2026',
    description:
      'Real-time team chat with channels, typing indicators, file sharing and presence, designed to scale horizontally.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/chatterbox',
    live: 'https://example.com',
    stack: ['Vue', 'Socket.IO', 'Redis', 'MongoDB']
  },
  {
    title: 'Weatherly',
    date: 'Feb 2026',
    description:
      'Minimal weather app with hourly radar, location search and offline caching. Installable as a PWA.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/weatherly',
    live: 'https://example.com',
    stack: ['Svelte', 'Vite', 'PWA', 'OpenWeather API']
  },
  {
    title: 'Taskflow',
    date: 'Oct 2025',
    description:
      'Kanban-style project planner with drag and drop, recurring tasks, comments and calendar sync.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/taskflow',
    live: 'https://example.com',
    stack: ['React', 'Redux', 'Express', 'MySQL']
  },
  {
    title: 'Dataviz Lab',
    date: 'Jun 2025',
    description:
      'Interactive dashboards that turn raw CSV uploads into shareable charts, with custom themes and embeds.',
    preview: 'https://example.com',
    git: 'https://github.com/your-username/dataviz-lab',
    live: 'https://example.com',
    stack: ['D3', 'Next.js', 'Python', 'FastAPI']
  }
];

const PRESETS = {
  // flat cards that always face the viewer while they orbit
  orbit: { tilt: -10, perspective: 1700, spread: 1.25, billboard: true },
  // flat cards that face outward, like a rotating drum
  cylinder: { tilt: -4, perspective: 2400, spread: 1.05, billboard: false }
};

const PREVIEW_WIDTH = 1280; // virtual desktop width of the iframe page
const CAPTION_SPACE = 64;
const TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrap = degrees => ((((degrees + 180) % 360) + 360) % 360) - 180;
const pad = n => String(n).padStart(2, '0');

// keyframes used by the card styling (injected once with the carousel)
const KEYFRAMES = `
@keyframes cc-spin { to { transform: rotate(360deg); } }
@keyframes cc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes cc-flash {
  from { box-shadow: inset 0 0 70px rgba(39,255,243,.55); }
  to   { box-shadow: inset 0 0 0 rgba(39,255,243,0); }
}
@keyframes cc-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes cc-nudge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
@keyframes cc-shimmer { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
@media (prefers-reduced-motion: reduce) {
  [data-cc-root] * { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
}
`;

const rotateX = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};

const rotateY = (p, degrees) => {
  const r = degrees * TO_RAD;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
};

/* ------------------------------------------------------------------ */
/*  One project card = two sliding pages                               */
/* ------------------------------------------------------------------ */
const ProjectCard = ({
  item,
  index,
  count,
  page,
  pageDirection = 1,
  active,
  interacting,
  autoPage,
  pageInterval,
  onInteract,
  onSelect,
  onPagePrev,
  onPageNext,
  onPageSet,
  cardW
}) => {
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (page === 1) setOpened(true);
  }, [page]);

  const scale = cardW / PREVIEW_WIDTH;
  const stack = item.stack || [];
  const focusable = active ? 0 : -1;
  const onFirst = page === 0;
  const onSecond = page === 1;

  // staggered "rise in" for the content of a page
  const rise = (show, i) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(14px)',
    transition:
      'opacity .6s ease, transform .7s cubic-bezier(0.22,1,0.36,1), background-color .3s ease, border-color .3s ease',
    transitionDelay: show ? `${160 + i * 80}ms` : '0ms'
  });

  return (
    <div
      className={`
        relative flex h-full w-full flex-col overflow-hidden
        rounded-[26px] border bg-[#242129] p-[8px] text-neutral-100
        transition-[border-color,box-shadow] duration-700
        [border-radius:var(--cc-radius)]
        ${active
          ? 'border-cyan-300 shadow-[0_0_70px_-12px_rgba(39,255,243,0.55)]'
          : 'border-cyan-200/30 shadow-2xl shadow-black/50'}
      `}
    >
      {/* light that runs around the frame of the front card */}
      {active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'cc-fade .8s both' }}
        >
          <div
            className="h-full w-full"
            style={{
              animation: 'cc-spin 7s linear infinite',
              background:
                'conic-gradient(from 0deg, transparent 0deg, rgba(39,255,243,.95) 70deg, transparent 140deg, transparent 220deg, rgba(255,141,162,.85) 290deg, transparent 360deg)'
            }}
          />
        </div>
      )}

      <div
        className={`
          relative z-10 flex h-full w-full flex-col overflow-hidden
          rounded-[18px] border
          bg-[linear-gradient(160deg,#06161c_0%,#000_55%)]
          transition-colors duration-700
          ${active ? 'border-cyan-400/80' : 'border-cyan-400/30'}
        `}
      >
        {/* auto-page timer bar */}
        {active && autoPage && !interacting && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[2px] bg-white/5">
            <div
              key={page}
              className="h-full origin-left bg-gradient-to-r from-cyan-300 to-pink-300"
              style={{ animation: `cc-progress ${pageInterval}s linear both` }}
            />
          </div>
        )}

        {/* page dots */}
        {active && (
          <div className="absolute left-1/2 top-3 z-40 flex -translate-x-1/2 gap-1.5">
            {[0, 1].map(n => (
              <button
                key={n}
                type="button"
                aria-label={n === 0 ? 'Show overview' : 'Show preview'}
                onClick={event => {
                  event.stopPropagation();
                  onPageSet?.(n);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  page === n ? 'w-6 bg-cyan-300' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* sliding pages */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className="flex h-full w-[200%] transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
            style={{
              transform: `translateX(${page === 1 ? -50 : 0}%) perspective(1000px) rotateY(${page === 1 ? -1.5 : 1.5}deg)`,
              filter: 'saturate(1.08)'
            }}
          >
            {/* page 1 – name, date, description */}
            <section
              className="relative flex h-full w-1/2 flex-col p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                opacity: page === 0 ? 1 : 0,
                transform:
                  page === 0
                    ? 'translateX(0) scale(1)'
                    : `translateX(${pageDirection > 0 ? '-4%' : '4%'}) scale(.96)`,
                filter: page === 0 ? 'blur(0px)' : 'blur(5px)'
              }}
              aria-hidden={page !== 0}
            >
              {/* big ghost number */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-1 top-1 select-none text-[110px] font-black leading-none tracking-tighter text-white/[0.04]"
              >
                {pad(index + 1)}
              </span>

              <span
                style={rise(onFirst, 0)}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300/70"
              >
                Project · {pad(index + 1)}/{pad(count)}
              </span>

              <h3
                style={{
                  ...rise(onFirst, 1),
                  backgroundImage: 'linear-gradient(90deg,#fff,#7ffcf5,#ffb3c1,#fff)',
                  backgroundSize: '200% 100%',
                  animation: active ? 'cc-shimmer 6s linear infinite' : undefined
                }}
                className="mt-3 bg-clip-text text-[30px] font-semibold leading-[1.1] tracking-tight text-transparent [-webkit-background-clip:text]"
              >
                {item.title}
              </h3>

              {item.date && (
                <span
                  style={rise(onFirst, 2)}
                  className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-[12px] opacity-80"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {item.date}
                </span>
              )}

              <div
                className="mt-5 h-px bg-gradient-to-r from-cyan-300 to-transparent"
                style={{
                  width: onFirst ? 72 : 0,
                  transition: 'width .9s cubic-bezier(0.22,1,0.36,1)',
                  transitionDelay: onFirst ? '420ms' : '0ms'
                }}
              />

              <p
                style={rise(onFirst, 3)}
                className="mt-4 line-clamp-[9] text-[14px] leading-relaxed text-neutral-300/80"
              >
                {item.description}
              </p>

              <div
                style={rise(onFirst, 5)}
                className="mt-auto flex items-center gap-2 pt-4 text-[11px] uppercase tracking-[0.2em] text-cyan-200/60"
              >
                Live preview
                <span aria-hidden="true" style={{ animation: 'cc-nudge 1.6s ease-in-out infinite' }}>
                  →
                </span>
              </div>
            </section>

            {/* page 2 – iframe, links, stack */}
            <section
              className="flex h-full w-1/2 flex-col items-center p-5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{
                opacity: page === 1 ? 1 : 0,
                transform:
                  page === 1
                    ? 'translateX(0) scale(1)'
                    : `translateX(${pageDirection > 0 ? '4%' : '-4%'}) scale(.96)`,
                filter: page === 1 ? 'blur(0px)' : 'blur(5px)'
              }}
              aria-hidden={page !== 1}
            >
              <div
                style={rise(onSecond, 0)}
                className="relative min-h-0 w-full flex-1 overflow-hidden rounded-[12px] border border-white/10 bg-neutral-900"
              >
                {item.image ? (
                  // screenshot: shown when there is no `preview` URL, and while the iframe loads
                  <img
                    src={item.image}
                    alt={`${item.title} screenshot`}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-10 text-center text-[12px] leading-relaxed opacity-40">
                    Loading preview… if it stays blank, this site blocks embedding — use the live link below.
                  </div>
                )}
                {opened && item.preview && (
                  <iframe
                    title={`${item.title} preview`}
                    src={item.preview}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    referrerPolicy="no-referrer"
                    tabIndex={-1}
                    className="absolute left-0 top-0 origin-top-left border-0 bg-white"
                    style={{
                      width: PREVIEW_WIDTH,
                      height: `${(100 / scale).toFixed(3)}%`,
                      transform: `scale(${scale})`,
                      // keep the page scroll working while the pointer is over the preview
                      pointerEvents: interacting ? 'auto' : 'none'
                    }}
                  />
                )}
                {item.preview && (
                  <button
                    type="button"
                    tabIndex={page === 1 ? focusable : -1}
                    onClick={onInteract}
                    className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur transition-all hover:border-cyan-300/60 hover:bg-black"
                  >
                    {interacting ? 'Done' : 'Interact'}
                  </button>
                )}
              </div>

              <div className="w-full shrink-0 space-y-2.5 border-t border-white/10 p-3">
                <div style={rise(onSecond, 1)} className="flex gap-2 text-[12px] font-medium">
                  {item.git && (
                    <a
                      href={item.git}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={page === 1 ? focusable : -1}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/10"
                    >
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                      GitHub
                    </a>
                  )}
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={page === 1 ? focusable : -1}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-200 to-white py-2 text-neutral-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(39,255,243,0.7)]"
                    >
                      Live site <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
                {stack.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                    {stack.map((tech, i) => (
                      <li
                        key={tech}
                        style={rise(onSecond, 2 + i * 0.6)}
                        className="rounded-md border border-white/5 bg-white/[0.08] px-2 py-[3px] text-[10.5px] text-neutral-200 hover:border-cyan-300/40 hover:bg-cyan-300/15"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </div>
        </div>

        {active && (
          <>
            <button
              type="button"
              aria-label={`Previous page for ${item.title}`}
              tabIndex={0}
              onClick={event => {
                event.stopPropagation();
                onPagePrev?.();
              }}
              className="pointer-events-auto absolute left-3 top-1/2 z-[60] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/65 text-3xl leading-none text-white shadow-[0_8px_30px_rgba(0,0,0,.45)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-cyan-300/70 hover:bg-cyan-300/15 active:scale-95"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={`Next page for ${item.title}`}
              tabIndex={0}
              onClick={event => {
                event.stopPropagation();
                onPageNext?.();
              }}
              className="pointer-events-auto absolute right-3 top-1/2 z-[60] grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/65 text-3xl leading-none text-white shadow-[0_8px_30px_rgba(0,0,0,.45)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-cyan-300/70 hover:bg-cyan-300/15 active:scale-95"
            >
              ›
            </button>
          </>
        )}

        {/* flash when a card arrives at the front */}
        {active && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[35] rounded-[inherit]"
            style={{ animation: 'cc-flash 1s ease-out both' }}
          />
        )}

        {/* clicking a card that is not in front brings it to the front */}
        {!active && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Show ${item.title}`}
            onClick={onSelect}
            className="group absolute inset-0 z-20 flex cursor-pointer items-end justify-center pb-6 outline-none"
          >
            <span className="absolute inset-0 bg-cyan-300/0 transition-colors duration-300 group-hover:bg-cyan-300/[0.08]" />
            <span className="relative translate-y-2 rounded-full border border-cyan-300/40 bg-black/70 px-4 py-1.5 text-[12px] font-medium tracking-wide text-cyan-200 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Bring to front
            </span>
          </button>
        )}
        {/* depth shading */}
        <div className="pointer-events-none absolute inset-0 z-30 bg-[var(--cc-fade)] opacity-[var(--cc-depth,0)]" />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Carousel – the orbit is driven by the page scroll                  */
/* ------------------------------------------------------------------ */
const CircularCarousel = ({
  items = DEFAULT_ITEMS,
  preset = 'orbit',
  cardWidth = 380,
  cardHeight = 500,
  gap = 40,
  height = '100vh', // height of the pinned stage (standalone mode only)
  progress, // optional framer MotionValue 0→1: the parent owns the pinned section
  scrollRef, // ref of that tall parent section (turns card jumps into scroll distance)
  range = [0, 1], // slice of `progress` over which the orbit turns
  scrollPerCard = 80, // vh of scrolling needed to move one card
  snap = true, // settle on the nearest card when scrolling stops
  smoothing = 0.14, // seconds – higher = floatier spin
  depthFade = 0.6,
  fadeColor = '#000000',
  cornerRadius = 16,
  captions = true,
  autoPage = true, // front card slides Overview ⇄ Preview by itself
  pageInterval = 4, // seconds each page stays up
  controlsRef, // optional ref that receives { goTo(index) }
  onChange,
  onItemClick,
  className = '',
  style
}) => {
  const list = items && items.length ? items : DEFAULT_ITEMS;
  const count = list.length;
  const shape = PRESETS[preset] ? preset : 'orbit';
  const layout = PRESETS[shape];
  const reduced = usePrefersReducedMotion();

  const cardW = Math.max(240, cardWidth);
  const cardH = Math.max(320, cardHeight);
  const step = 360 / count;
  const external = Boolean(progress && scrollRef);

  const radius = useMemo(() => {
    const n = Math.max(count, 3);
    const pitch = (cardW + gap) * layout.spread;
    return pitch / (2 * Math.sin(Math.PI / n));
  }, [count, cardW, gap, layout.spread]);

  const trackRef = useRef(null);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const ringRef = useRef(null);
  const cardRefs = useRef([]);
  const wakeRef = useRef(() => {});
  const measureRef = useRef(() => {});
  const activeRef = useRef(0);

  const [active, setActive] = useState(0);
  const [page, setPage] = useState(0); // page shown on the front card
  const [pageDirection, setPageDirection] = useState(1);
  const [interactive, setInteractive] = useState(-1);

  // each time a card comes to the front it starts on page 1, then the two
  // pages alternate on a timer (paused while "Interact" is on)
  useEffect(() => {
    setPageDirection(1);
    setPage(0);
  }, [active]);
  const paused = interactive === active;
  useEffect(() => {
    if (!autoPage || paused) return undefined;
    const timer = setTimeout(() => {
      setPageDirection(1);
      setPage(p => 1 - p);
    }, Math.max(1, pageInterval) * 1000);
    return () => clearTimeout(timer);
  }, [autoPage, paused, pageInterval, active, page]);

  const stateRef = useRef({ angle: 0, last: 0, fit: 1, snapTimer: 0, flight: 0 });

  const jumpRef = useRef(() => {});
  const stopFlightRef = useRef(() => {});

  const settings = {
    external,
    progress,
    scrollRef,
    range,
    count,
    step,
    radius,
    billboard: layout.billboard,
    tilt: layout.tilt,
    perspective: layout.perspective,
    cardW,
    cardH,
    depthFade: clamp(depthFade, 0, 1),
    smoothing: Math.max(0.01, smoothing),
    snap,
    captions,
    reduced
  };
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // switching to another card closes "interact" mode
  useEffect(() => {
    setInteractive(current => (current === active ? current : -1));
  }, [active]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const root = rootRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const ring = ringRef.current;
    if (!track || !root || !stage || !camera || !ring) return undefined;
    const state = stateRef.current;
    let raf = 0;
    let visible = true;

    // raw scroll progress of the pinned section (parent-supplied or measured here)
    const rawProgress = () => {
      const s = settingsRef.current;
      if (s.external) return s.progress.get();
      const rect = track.getBoundingClientRect();
      return -rect.top / Math.max(rect.height - root.offsetHeight, 1);
    };
    // scroll distance (px) that covers raw progress 0 → 1
    const travel = () => {
      const s = settingsRef.current;
      if (s.external) return Math.max((s.scrollRef.current?.offsetHeight || 0) - window.innerHeight, 1);
      return Math.max(track.offsetHeight - root.offsetHeight, 1);
    };
    // 0 → 1 across the orbit range
    const localProgress = () => {
      const [a, b] = settingsRef.current.range;
      return clamp((rawProgress() - a) / Math.max(b - a, 0.001), 0, 1);
    };
    const targetAngle = () => {
      const s = settingsRef.current;
      return -localProgress() * (s.count - 1) * s.step;
    };

    // --- scroll the page so that card `index` sits at the front ----------
    // Feedback loop: every frame we look at where the progress really is and
    // nudge the page towards the target. It does not matter if the parent's
    // progress is measured over a different distance than we assume – the
    // pixels-per-progress ratio is learned while scrolling.
    const stopFlight = () => {
      cancelAnimationFrame(state.flight);
      state.flight = 0;
      window.removeEventListener('wheel', stopFlight);
      window.removeEventListener('touchstart', stopFlight);
    };
    stopFlightRef.current = stopFlight;

    jumpRef.current = index => {
      stopFlight();
      const s = settingsRef.current;
      const n = Math.max(s.count - 1, 1);
      const [a, b] = s.range;
      const want = a + (clamp(index, 0, s.count - 1) / n) * (b - a);

      let pxPer = travel();
      let lastP = rawProgress();
      let lastY = window.scrollY;
      let frames = 0;

      const tick = () => {
        const cur = settingsRef.current;
        const p = rawProgress();
        const err = want - p;

        // learn how many px of scrolling make one unit of progress
        const dy = window.scrollY - lastY;
        const dp = p - lastP;
        if (Math.abs(dp) > 2e-4 && Math.abs(dy) > 1 && dy / dp > 0) {
          pxPer = clamp(pxPer * 0.6 + (dy / dp) * 0.4, 50, 1e7);
        }
        lastP = p;
        lastY = window.scrollY;

        if (Math.abs(err) < 0.0004 || ++frames > 420) {
          stopFlight();
          return;
        }

        const maxStep = window.innerHeight * 0.12;
        const gain = cur.reduced ? 1 : 0.16;
        let dyStep = clamp(err * pxPer * gain, -maxStep, maxStep);
        if (cur.reduced) dyStep = err * pxPer;
        else if (Math.abs(dyStep) < 1) dyStep = Math.sign(dyStep) || 0;

        window.scrollBy({ top: dyStep, behavior: 'instant' });
        state.flight = requestAnimationFrame(tick);
      };

      // any manual scrolling cancels the glide
      window.addEventListener('wheel', stopFlight, { passive: true });
      window.addEventListener('touchstart', stopFlight, { passive: true });
      state.flight = requestAnimationFrame(tick);
    };

    const measure = () => {
      const s = settingsRef.current;
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const room = s.captions ? CAPTION_SPACE : 0;
      const P = s.perspective;
      // Project the front card (and its neighbours) through the real camera,
      // tilt included: the tilt pushes the front card down, which is what used
      // to push its bottom out of view.
      let minY = Infinity;
      let maxY = -Infinity;
      let frontMinX = Infinity;
      let frontMaxX = -Infinity;
      const corners = [
        [-s.cardW / 2, -s.cardH / 2],
        [s.cardW / 2, -s.cardH / 2],
        [-s.cardW / 2, s.cardH / 2],
        [s.cardW / 2, s.cardH / 2]
      ];
      for (let a = -s.step; a <= s.step + 0.001; a += s.step / 4) {
        for (const [cx, cy] of corners) {
          let p;
          if (s.billboard) {
            const c = rotateY([0, 0, s.radius], a);
            p = rotateX([c[0] + cx, cy, c[2]], s.tilt);
          } else {
            p = rotateX(rotateY([cx, cy, s.radius], a), s.tilt);
          }
          p = [p[0], p[1], p[2] - s.radius];
          if (p[2] >= P * 0.95) continue;
          const k = P / (P - p[2]);
          minY = Math.min(minY, p[1] * k);
          maxY = Math.max(maxY, p[1] * k);
          if (Math.abs(a) < 0.001) {
            frontMinX = Math.min(frontMinX, p[0] * k);
            frontMaxX = Math.max(frontMaxX, p[0] * k);
          }
        }
      }
      const spanY = Math.max(maxY - minY, 1);
      const spanX = Math.max(frontMaxX - frontMinX, 1);
      const fit = Math.min(1, (rect.width * 0.94) / spanX, ((rect.height - room) * 0.94) / spanY);
      state.fit = fit;
      stage.style.perspective = `${P}px`;
      // centre the projected cards vertically in the stage
      stage.style.transform = `translate3d(0, ${-((minY + maxY) / 2) * fit - room / 2}px, 0) scale(${fit})`;
    };
    measureRef.current = measure;

    const render = s => {
      const angle = state.angle;
      camera.style.transform = `translate3d(0, 0, ${-s.radius}px) rotateX(${s.tilt}deg)`;
      ring.style.transform = `rotateY(${angle}deg)`;

      for (let index = 0; index < s.count; index++) {
        const card = cardRefs.current[index];
        if (!card) continue;
        const base = index * s.step;
        let transform = `rotateY(${base}deg) translateZ(${s.radius}px)`;
        if (s.billboard) transform += ` rotateY(${-(base + angle)}deg)`;
        card.style.transform = transform;

        const facing = Math.cos(wrap(base + angle) * TO_RAD);
        const fade = s.depthFade * Math.pow((1 - facing) / 2, 1.25);
        card.style.setProperty('--cc-depth', fade.toFixed(3));
      }

      const index = ((Math.round(-angle / s.step) % s.count) + s.count) % s.count || 0;
      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        onChangeRef.current?.(index);
      }
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      const dt = state.last ? Math.min((now - state.last) / 1000, 0.05) : 1 / 60;
      state.last = now;
      const target = targetAngle();
      const k = s.reduced ? 1 : 1 - Math.exp(-dt / s.smoothing);
      state.angle += (target - state.angle) * k;
      const diff = Math.abs(target - state.angle);
      if (diff < 0.01) state.angle = target;
      render(s);
      if (diff >= 0.01 && visible && !document.hidden) raf = requestAnimationFrame(frame);
      else state.last = 0;
    };

    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    wakeRef.current = wake;

    const onScroll = () => {
      wake();
      clearTimeout(state.snapTimer);
      if (!settingsRef.current.snap) return;
      state.snapTimer = setTimeout(() => {
        // don't fight a click-to-front glide that is still running
        if (state.flight) return;
        const s = settingsRef.current;
        const n = s.count - 1;
        const el = s.external ? s.scrollRef.current : track;
        if (n < 1 || !el) return;
        // only snap while the section is pinned and inside the orbit range
        const rect = el.getBoundingClientRect();
        const stageH = s.external ? window.innerHeight : root.offsetHeight;
        if (rect.top > 1 || rect.bottom < stageH - 1) return;
        const raw = rawProgress();
        const [a, b] = s.range;
        if (raw < a - 0.002 || raw > b + 0.002) return;
        const i = Math.round(localProgress() * n);
        const y = window.scrollY + (a + (i / n) * (b - a) - raw) * travel();
        if (Math.abs(y - window.scrollY) > 2) {
          window.scrollTo({ top: y, behavior: s.reduced ? 'auto' : 'smooth' });
        }
      }, 180);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      } else wake();
    };

    const resize = new ResizeObserver(() => {
      measure();
      wake();
    });
    resize.observe(root);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        state.last = 0;
      }
    });
    io.observe(settingsRef.current.external ? root : track);
    const offProgress = settingsRef.current.external ? settingsRef.current.progress.on('change', wake) : undefined;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    measure();
    state.angle = targetAngle(); // start exactly where the page is scrolled
    render(settingsRef.current);
    wake();

    return () => {
      cancelAnimationFrame(raf);
      stopFlight();
      resize.disconnect();
      io.disconnect();
      clearTimeout(state.snapTimer);
      offProgress?.();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [progress]);

  useLayoutEffect(() => {
    measureRef.current();
    wakeRef.current();
  }, [radius, cardW, cardH, preset, captions, count]);

  // bring a card to the front and give the carousel keyboard focus
  const goTo = useCallback(index => {
    jumpRef.current(index);
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!controlsRef) return undefined;
    controlsRef.current = { goTo };
    return () => {
      controlsRef.current = null;
    };
  }, [controlsRef, goTo]);

  const handleKeyDown = event => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') goTo(activeRef.current + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') goTo(activeRef.current - 1);
    else if (event.key === 'Home') goTo(0);
    else if (event.key === 'End') goTo(count - 1);
    else if (event.key === 'Enter' || event.key === ' ') onItemClick?.(list[activeRef.current], activeRef.current);
    else return;
    event.preventDefault();
  };

  const current = list[active] || list[0];
  const label = current ? current.title || `Project ${active + 1}` : '';

  return (
    // tall track: its height is what turns page scrolling into rotation
    <div
      ref={trackRef}
      className="relative w-full"
      style={{ height: external ? '100%' : `calc(${height} + ${Math.max(count - 1, 0) * scrollPerCard}vh)` }}
    >
      <style>{KEYFRAMES}</style>
      <div
        ref={rootRef}
        data-cc-root=""
        className={`${external ? 'relative' : 'sticky top-0'} w-full select-none overflow-hidden outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(128,128,140,0.55)] ${className}`.trim()}
        style={{
          height: external ? '100%' : height,
          ...style,
          '--cc-fade': fadeColor,
          '--cc-radius': `${Math.max(0, cornerRadius)}px`
        }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Projects carousel"
        tabIndex={0}
        data-shape={shape}
        onKeyDown={handleKeyDown}
      >
        <div className="absolute inset-0">
          <div ref={stageRef} className="absolute inset-0 flex items-center justify-center">
            <div ref={cameraRef} className="relative h-0 w-0 [transform-style:preserve-3d]">
              <div ref={ringRef} className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]">
                {list.map((item, index) => (
                  <div
                    key={index}
                    ref={element => {
                      cardRefs.current[index] = element;
                    }}
                    className="absolute left-0 top-0 h-0 w-0 [transform-style:preserve-3d]"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${item.title || `Project ${index + 1}`}, ${index + 1} of ${count}`}
                  >
                    <div
                      className={`absolute ${shape === 'cylinder' ? '[-webkit-backface-visibility:hidden] [backface-visibility:hidden]' : ''}`}
                      style={{
                        left: -cardW / 2,
                        top: -cardH / 2,
                        width: cardW,
                        height: cardH,
                        // the front card lifts slightly towards the viewer
                        transform: index === active ? 'scale(1.035)' : 'scale(1)',
                        transition: 'transform .8s cubic-bezier(0.22,1,0.36,1)'
                      }}
                    >
                      <ProjectCard
                        item={item}
                        index={index}
                        count={count}
                        cardW={cardW}
                        page={index === active ? page : 0}
                        pageDirection={pageDirection}
                        active={index === active}
                        interacting={interactive === index}
                        autoPage={autoPage}
                        pageInterval={Math.max(1, pageInterval)}
                        onInteract={() => setInteractive(value => (value === index ? -1 : index))}
                        onPagePrev={() => {
                          if (index !== active) return;
                          setPageDirection(-1);
                          setPage(value => 1 - value);
                        }}
                        onPageNext={() => {
                          if (index !== active) return;
                          setPageDirection(1);
                          setPage(value => 1 - value);
                        }}
                        onPageSet={n => {
                          if (index !== active) return;
                          setPageDirection(n > page ? 1 : -1);
                          setPage(n);
                        }}
                        onSelect={() => {
                          goTo(index);
                          onItemClick?.(item, index);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {captions && current && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-1.5 px-4 text-center text-white"
            aria-hidden="true"
          >
            <span className="text-[15px] font-medium leading-[1.35]">{current.title}</span>
            <span className="inline-flex items-center gap-2 text-[12px] leading-none tabular-nums opacity-50">
              {pad(active + 1)} / {pad(count)}
              <span aria-hidden="true">·</span>
              scroll to orbit ↓
            </span>
          </div>
        )}

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {`${label}, ${active + 1} of ${count}`}
        </div>
      </div>
    </div>
  );
};

export default CircularCarousel;