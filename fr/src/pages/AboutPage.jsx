import ElectricBorder from '../components/effects/ElectricBorder.jsx';
import { useEffect, useRef, useState } from 'react';
import {
  FaLinkedin,
  FaGithub,
  FaCode,
  FaGraduationCap,
} from 'react-icons/fa6';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import SideRays from '../components/effects/SideRays.jsx';
import WebThreads from '../components/effects/webthreads.jsx';
import meImage from '../assets/me.png';
import WarpText from '../components//effects/warp';
import GradientText from '../components/effects/textgradient.jsx';
import { techStacks, nameColors } from '../data/aboutPageData.jsx';
import { SkillGroup } from '../components/about/SkillGroup.jsx';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const nameClass =
  '!inline-flex !w-fit !shrink-0 !p-0 !m-0 text-2xl font-medium md:text-3xl';

// Fine-tune the starting position of the floating "Deepan" (px).
// Negative = move up, positive = move down.
const NAME_START_Y_NUDGE = 0;
// How far below the image the name ends up (px).
const NAME_END_GAP = 88;

function AboutPage() {
  const sectionRef = useRef(null); // tall scroll track
  const stickyRef = useRef(null); // pinned viewport
  const placeholderRef = useRef(null); // where "Deepan" sits in the sentence
  const imageRef = useRef(null);

  // ---- Scroll progress across the whole tall section (0 -> 1) ----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.4,
  });

  // Phase 1 (About Me) fades out
  const introOpacity = useTransform(progress, [0.04, 0.24], [1, 0]);
  const introY = useTransform(progress, [0.04, 0.24], [0, -40]);
  const introBlur = useTransform(
    progress,
    [0.04, 0.24],
    ['blur(0px)', 'blur(8px)']
  );
  const introPointer = useTransform(progress, (v) =>
    v > 0.12 ? 'none' : 'auto'
  );

  // Phase 2 (Education) fades in, holds longer, then fades out
  const eduOpacity = useTransform(progress, [0.24, 0.58, 0.88], [0, 1, 0]);
  const eduY = useTransform(progress, [0.24, 0.58, 0.88], [40, 0, -20]);
  const eduBlur = useTransform(
    progress,
    [0.24, 0.58, 0.88],
    ['blur(8px)', 'blur(0px)', 'blur(10px)']
  );
  const eduPointer = useTransform(progress, (v) =>
    v > 0.8 ? 'none' : 'auto'
  );

  // Deepan fades out when Education starts to take over
  const deepanFadeOpacity = useTransform(progress, [0.18, 0.36], [1, 0]);
  const deepanFadeBlur = useTransform(progress, [0.18, 0.36], ['blur(0px)', 'blur(8px)']);

  // Image + "Deepan" fade away after the education content is done
  const tailOpacity = useTransform(progress, [0.78, 0.96], [1, 0]);
  const tailBlur = useTransform(
    progress,
    [0.78, 0.96],
    ['blur(0px)', 'blur(8px)']
  );

  // Phase 3 (Tech Stacks) layer starts after education is fully settled
  const techOpacity = useTransform(progress, [0.82, 0.98], [0, 1]);
  const techY = useTransform(progress, [0.82, 0.98], [40, 0]);
  const techBlur = useTransform(
    progress,
    [0.82, 0.98],
    ['blur(8px)', 'blur(0px)']
  );
  // Only let the glass icons receive hover once the layer is visible
  const techPointer = useTransform(progress, (v) =>
    v > 0.88 ? 'auto' : 'none'
  );

  // Phase 3: background threads fade away after the education phase has finished
  const threadsOpacity = useTransform(progress, [0.62, 0.9], [1, 0]);
  const threadsBlur = useTransform(progress, [0.62, 0.9], ['blur(0px)', 'blur(18px)']);

  // ---- "Deepan" stays inline with the sentence; no travel animation ----
  const [start, setStart] = useState(null); // { left, top }
  const dx = useMotionValue(0);
  const dy = useMotionValue(0);
  const travel = useTransform(progress, [0, 1], [0, 0]);
  const nameX = useTransform([travel, dx], ([t, d]) => 0);
  const nameY = useTransform([travel, dy], ([t, d]) => 0);
  const nameScale = useTransform(travel, [0, 1], [1, 1]);

  useEffect(() => {
    const measure = () => {
      if (!stickyRef.current || !placeholderRef.current) return;
      const c = stickyRef.current.getBoundingClientRect();
      const ph = placeholderRef.current.getBoundingClientRect();

      const startLeft = ph.left - c.left;
      const startTop = ph.top - c.top + NAME_START_Y_NUDGE;

      setStart({ left: startLeft, top: startTop });
      dx.set(0);
      dy.set(0);
    };

    // wait for the intro animation to settle before measuring
    const t = setTimeout(measure, 2000);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [dx, dy]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[450vh] w-full bg-black text-white"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* Background Light Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <SideRays
            rayColor1="#fbf4f5"
            rayColor2="#ffffff"
            origin="top-right"
            speed={2.5}
            intensity={1.8}
            spread={2}
            density={5}
            followMouse
            blend={0.6}
            sharpness={0.5}
            tilt={0}
            falloff={1.25}
            glow={1}
            saturation={2.25}
            dust={0}
            mouseInfluence={0.2}
            intro
            lightMode={false}
            opacity={1}
          />
        </motion.div>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <motion.div
              style={{
                opacity: threadsOpacity,
                filter: threadsBlur,
              }}
              className="absolute inset-0"
            >
              <WebThreads
                colors={['#ff8da2', '#27fff3']}
                coreColor="#FFFFFF"
                threadCount={6}
                spread={0.18}
                lightMode={false}
                speed={0.2}
                frequency={5}
                taper={1 }
                position={0.45}
                pinch={0.655}
                nodes={1}
                angle={-1}
                glow={0.015}
                falloff={0.6}
                thickness={1.05}
                brightness={0.4}
                opacity={1}
                depth={0}
                pulses={0}
                mirror
                shimmer={false}
                fade={0}
                grain={0.05}
                intro
                mouseInteraction
                mouseStrength={0.41}
                pulseOnClick
                paused={false}
              />
            </motion.div>
          </div>
        </div>

        {/* Main Content (phases 1 + 2) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 pt-16 md:px-12 lg:px-20"
        >
          {/* Heading: "About ME():" -> "Education" */}
          <motion.div variants={item} className="relative mb-12 mt-10">
            <motion.div
              style={{
                opacity: introOpacity,
                y: introY,
                filter: introBlur,
              }}
            >
              <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-300">
                Meet the Developer
              </p>
              <div className="flex items-center gap-0 whitespace-nowrap">
                <div className="inline-flex h-[82px] min-h-0 w-[170px] -ml-3 overflow-visible md:h-[95px] md:w-[220px]">
                  <WarpText
                    text="About"
                    color="#f8f5ff"
                    warpStrength={0.08}
                    warpScale={2.5}
                    speed={1.55}
                    pointerInfluence={6}
                    pointerStrength={4.38}
                    refraction={0.018}
                    ripple
                    fontSize={190}
                    lineHeight={0.85}
                    className="!h-[82px] !min-h-0 !w-full !overflow-visible !rounded-none md:!h-[95px]"
                    style={{
                      height: '82px',
                      width: '100%',
                    }}
                  />
                </div>

                <span className="inline-block text-5xl -ml-2 font-bold tracking-tight text-cyan-300 md:text-7xl">
                  ME():
                </span>
              </div>
            </motion.div>

            {/* Education heading overlays the same spot */}
            <motion.div
              style={{
                opacity: eduOpacity,
                y: eduY,
                filter: eduBlur,
              }}
              className="pointer-events-none absolute inset-0 flex flex-col justify-end -translate-y-[50px]"
            >
              <p className="mb-2 text-sm uppercase tracking-[0.4em] text-cyan-300">
                Academic Background
              </p>
              <h2 className="text-5xl font-bold tracking-tight text-[#f8f5ff] md:text-7xl">
                Education
              </h2>
            </motion.div>

            <motion.div
              style={{ opacity: introOpacity, filter: introBlur }}
              className="mt-2 h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-cyan-300"
            />
          </motion.div>

          {/* Introduction / Education + Image */}
          <div className="grid items-center justify-items-center gap-1 lg:grid-cols-2">
            {/* Left column: both phases stacked in the same cell */}
            <div className="relative grid w-full max-w-xl">
              {/* Phase 1: introduction */}
              <motion.div
                variants={container}
                style={{
                  opacity: introOpacity,
                  y: introY,
                  filter: introBlur,
                  pointerEvents: introPointer,
                  gridArea: '1 / 1',
                }}
                className="w-full max-w-xl space-y-6"
              >
                <div className="flex flex-nowrap items-center justify-start gap-2 whitespace-nowrap">
                  <motion.span
                    variants={item}
                    className="shrink-0 text-2xl font-medium leading-tight text-gray-200 md:text-3xl"
                  >
                    Hi, It's
                  </motion.span>

                  {/* Invisible placeholder keeps the sentence layout and
                      marks where the floating name starts */}
                  <span
                    ref={placeholderRef}
                    aria-hidden="true"
                    className="invisible inline-flex shrink-0"
                  >
                    <GradientText
                      colors={nameColors}
                      animationSpeed={1.5}
                      showBorder={false}
                      className={nameClass}
                    >
                      Deepan
                    </GradientText>
                  </span>

                  <motion.span
                    variants={item}
                    className="shrink-0 text-2xl font-medium leading-tight text-gray-200 md:text-3xl"
                  >
                    . Let's turn
                  </motion.span>
                </div>

                <motion.p
                  variants={item}
                  className="text-2xl font-medium leading-relaxed text-gray-200 md:text-3xl -mt-3"
                >
                  ambitious ideas into intelligent digital experiences.
                </motion.p>

                <motion.p
                  variants={item}
                  className="max-w-xl leading-8 text-gray-300"
                >
                  A Final-year Artificial Intelligence and Data Science student
                  at Kongu Engineering College, passionate about Full Stack
                  Development, Generative AI, and solving real-world problems.
                </motion.p>

                <motion.div
                  variants={item}
                  className="flex items-center gap-5 pt-4"
                >
                  {/* GitHub */}
                  <a
                    href="https://github.com/DeepanB2005"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    <FaGithub size={23} />
                  </a>

                  {/* LeetCode */}
                  <a
                    href="https://leetcode.com/u/B_Deepan/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LeetCode"
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-yellow-400 bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-[#FFA116] hover:bg-[#FFA116]/15 hover:text-[#FFA116]"
                  >
                    <FaCode size={23} />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/deepanb0202"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="group flex h-12 w-12 items-center justify-center rounded-full border border-blue-500 bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-[#0A66C2] hover:bg-[#0A66C2]/15 hover:text-[#0A66C2]"
                  >
                    <FaLinkedin size={23} />
                  </a>
                </motion.div>
              </motion.div>

              {/* Phase 2: education */}
              <motion.div
                style={{
                  opacity: eduOpacity,
                  y: eduY,
                  filter: eduBlur,
                  pointerEvents: eduPointer,
                  gridArea: '1 / 1',
                }}
                className="mt-20 flex w-full -translate-y-[150px] items-center"
              >
                <ElectricBorder
                  color="#7df9ff"
                  speed={1}
                  chaos={0.5}
                  spread={0.6}
                  strands={3}
                  thickness={1.5}
                  borderRadius={24}
                >
                  <div className="flex min-h-[200px] w-full max-w-[580px] items-center rounded-[24px] bg-white/10 p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-22 shrink-0 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/10 text-cyan-300">
                        <FaGraduationCap size={22} />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 space-y-3">
                        <h3 className="text-xl font-semibold leading-snug text-white md:text-2xl">
                          Kongu Engineering College
                        </h3>

                        <p className="text-sm leading-relaxed text-gray-200 md:text-base">
                          B.Tech in Artificial Intelligence and Data Science
                        </p>

                        <p className="text-gray-300">CGPA: 7.84</p>

                        <p className="text-gray-400">Erode, Tamil Nadu</p>

                        <p className="pt-2 text-sm uppercase tracking-widest text-cyan-300">
                          2024 – 2027
                        </p>
                      </div>
                    </div>
                  </div>
                </ElectricBorder>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              variants={item}
              className="flex w-full items-start justify-center lg:justify-center"
            >
              <motion.div
                style={{ opacity: tailOpacity, filter: tailBlur }}
                className="w-full"
              >
                <div
                  ref={imageRef}
                  className="relative mx-auto mt-[-200px] w-full max-w-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-white/5 shadow-[0_0_25px_rgba(34,211,238,0.14)] md:max-w-[340px]"
                >
                  <img
                    src={meImage}
                    alt="Deepan portrait"
                    className="mx-auto block h-[340px] w-full object-cover object-center md:h-[420px]"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating "Deepan": starts on the "Hi, It's" line, glides to below the image */}
        {start && (
          <motion.div
            style={{
              position: 'absolute',
              left: start.left,
              top: start.top,
              x: nameX,
              y: nameY,
              scale: nameScale,
              opacity: deepanFadeOpacity,
              filter: deepanFadeBlur,
              transformOrigin: 'center center',
            }}
            className="pointer-events-none z-20"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              // flex (not block) so the box is exactly the text height,
              // matching the placeholder and sitting on the same line
              className="flex"
            >
              <GradientText
                colors={nameColors}
                animationSpeed={1.5}
                showBorder={false}
                className={nameClass}
              >
                Deepan
              </GradientText>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 3: Tech Stacks */}
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
            <h2 className="text-5xl font-bold tracking-tight text-[#f8f5ff] md:text-6xl">
              Tech Stacks
            </h2>
            <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-cyan-300" />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {techStacks.map((group, i) => (
              <SkillGroup
                key={group.title}
                progress={progress}
                index={i}
                title={group.title}
                accent={group.accent}
                items={group.items}
                wide={group.wide}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPage;