import { useRef } from 'react';
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
  useSpring,
  useMotionValue,
} from 'framer-motion';
import SideRays from '../components/effects/SideRays.jsx';
import WebThreads from '../components/effects/webthreads.jsx';
import meImage from '../assets/me.png';
import WarpText from '../components//effects/warp';
import GradientText from '../components/effects/textgradient.jsx';
import { techStacks, nameColors } from '../data/aboutPageData.jsx';
import { SkillGroup } from '../components/about/SkillGroup.jsx';
import { EducationPhase } from '../components/about/EducationPhase.jsx';
import { TechStacksPhase } from '../components/about/TechStacksPhase.jsx';

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

// Share of the scroll track used by phases 1-3. With a 600vh track this is
// 350vh of scrolling, identical to the old 450vh track.
const BASE_END = 0.7;

const nameClass =
  '!inline-flex !w-fit !shrink-0 !p-0 !m-0 text-2xl font-medium md:text-3xl';

function AboutPage() {
  const sectionRef = useRef(null); // tall scroll track
  const stickyRef = useRef(null); // pinned viewport
  const imageRef = useRef(null);

  // ---- Scroll progress across the whole tall section (0 -> 1) ----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.4,
  });

  // The first BASE_END of the track drives phases 1-3 exactly as before
  // (remapped to 0 -> 1 so none of the numbers below need to change).
  // The remaining tail is the exit: hold -> icons scatter -> About fades away.
  const progress = useTransform(smoothProgress, [0, BASE_END], [0, 1]);
  const exitProgress = useTransform(smoothProgress, [BASE_END, 1], [0, 1]);

  // Tech stacks: stay fixed for a while (0 -> 0.3), then burst outward (0.3 -> 0.7)
  const scatterScale = useTransform(exitProgress, [0.3, 0.7], [1, 2.2]);
  const scatterOpacity = useTransform(exitProgress, [0.3, 0.62], [1, 0]);
  const scatterBlur = useTransform(
    exitProgress,
    [0.3, 0.7],
    ['blur(0px)', 'blur(14px)']
  );
  const scatterPointer = useTransform(exitProgress, (v) =>
    v > 0.05 ? 'none' : 'auto'
  );

  // Whole About scene fades away in place at the very end (0.65 -> 1)
  const aboutExitOpacity = useTransform(exitProgress, [0.65, 1], [1, 0]);
  const aboutExitBlur = useTransform(
    exitProgress,
    [0.65, 1],
    ['blur(0px)', 'blur(12px)']
  );

  // Phase 1 (About Me) fades out
  const introOpacity = useTransform(progress, [0.04, 0.24, 0.34, 0.46], [1, 1, 0, 0]);
  const introY = useTransform(progress, [0.04, 0.24, 0.34, 0.46], [0, 0, -14, -40]);
  const introBlur = useTransform(
    progress,
    [0.04, 0.24, 0.34, 0.46],
    ['blur(0px)', 'blur(0px)', 'blur(6px)', 'blur(8px)']
  );
  const introPointer = useTransform(progress, (v) =>
    v > 0.12 ? 'none' : 'auto'
  );

  // Phase 2 (Education) fades in, holds longer, then fades out
  const eduOpacity = useTransform(progress, [0.22, 0.34, 0.7, 0.82, 0.96], [0, 1, 1, 0, 0]);
  const eduY = useTransform(progress, [0.22, 0.34, 0.7, 0.82, 0.96], [40, 0, 0, -10, -20]);
  const eduBlur = useTransform(
    progress,
    [0.22, 0.34, 0.7, 0.82, 0.96],
    ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(6px)', 'blur(10px)']
  );
  const eduPointer = useTransform(progress, (v) =>
    v > 0.8 ? 'none' : 'auto'
  );

  // Image + intro text fade away together, after a longer hold at their landing position
  const tailOpacity = useTransform(progress, [0.72, 0.84, 0.9, 1], [1, 1, 0, 0]);
  const tailBlur = useTransform(
    progress,
    [0.72, 0.84, 0.9, 1],
    ['blur(0px)', 'blur(0px)', 'blur(6px)', 'blur(8px)']
  );

  // Phase 3 (Tech Stacks) layer starts after education is fully settled
  // The layer itself appears almost instantly; the icons then fly in on their own
  const techOpacity = useTransform(progress, [0.8, 0.84, 0.94, 1], [0, 1, 1, 1]);
  const techY = useTransform(progress, [0.8, 0.84, 0.94, 1], [0, 0, 0, 0]);
  const techBlur = useTransform(
    progress,
    [0.8, 0.84, 0.94, 1],
    ['blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)']
  );
  // Only let the glass icons receive hover once they have landed
  const techPointer = useTransform(progress, (v) =>
    v > 0.95 ? 'auto' : 'none'
  );

  // Phase 3: background threads fade away after the education phase has finished
  const threadsOpacity = useTransform(progress, [0.62, 0.8, 0.9], [1, 1, 0]);
  const threadsBlur = useTransform(progress, [0.62, 0.8, 0.9], ['blur(0px)', 'blur(0px)', 'blur(18px)']);

  // The name stays inline with the sentence and fades with the nearby intro text.
  const nameX = useMotionValue(0);
  const nameY = useMotionValue(0);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-[600vh] w-full bg-black text-white"
    >
      <motion.div
        ref={stickyRef}
        style={{
          opacity: aboutExitOpacity,
          filter: aboutExitBlur,
        }}
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

                  <motion.span
                    variants={item}
                    className="inline-flex shrink-0"
                    style={{ opacity: introOpacity, filter: introBlur }}
                  >
                    <GradientText
                      colors={nameColors}
                      animationSpeed={1.5}
                      showBorder={false}
                      className={nameClass}
                    >
                      Deepan
                    </GradientText>
                  </motion.span>

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
              <EducationPhase
                eduOpacity={eduOpacity}
                eduY={eduY}
                eduBlur={eduBlur}
                eduPointer={eduPointer}
              />
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

        {/* Exit wrapper: holds still, then the icons burst outward and fade */}
        <motion.div
          style={{
            opacity: scatterOpacity,
            scale: scatterScale,
            filter: scatterBlur,
            pointerEvents: scatterPointer,
          }}
          className="absolute inset-0 z-20 will-change-transform"
        >
          <TechStacksPhase
            progress={progress}
            exitProgress={exitProgress}
            techOpacity={techOpacity}
            techY={techY}
            techBlur={techBlur}
            techPointer={techPointer}
            techStacks={techStacks}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default AboutPage;