import { FaLinkedin, FaGithub, FaCode } from 'react-icons/fa6';

import { motion } from 'framer-motion';
import SideRays from '../components/effects/SideRays.jsx';
import WebThreads from '../components/effects/webthreads.jsx';
import meImage from '../assets/me.png';

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

function AboutPage() {


  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
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
          <WebThreads
            colors={['#ff8da2', '#27fff3']}
            coreColor="#FFFFFF"
            threadCount={6}
            spread={0.18}
            lightMode={false}
            speed={0.2}
            frequency={5}
            taper={1}
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
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:px-12 lg:px-20"

      >
        {/* Heading */}
        <motion.div variants={item} className="mb-12 mt-20">
          <p className="mb-4 text-sm uppercase tracking-[0.4em] text-cyan-300">
            Get to know me
          </p>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            About <span className="text-cyan-300">Me.</span>
          </h1>

          <div className="mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-pink-400 to-cyan-300" />
        </motion.div>

        {/* Introduction and Highlights */}
        <div className="grid items-center justify-items-center gap-1 lg:grid-cols-2">

          {/* Introduction */}
          <motion.div
            variants={container}
            className="w-full max-w-xl space-y-6"
          >
            <motion.p
              variants={item}
              className="text-2xl font-medium leading-relaxed text-gray-200 md:text-3xl"
            >
              Hi, I'm Deepan. I build intelligent applications
              by combining software engineering and AI.
            </motion.p>

            <motion.p
              variants={item}
              className="max-w-xl leading-8 text-gray-400"
            >
              I'm a final-year Artificial Intelligence and Data
              Science student at Kongu Engineering College,
              passionate about Full Stack Development,
              Generative AI, and solving real-world problems.
            </motion.p>

            <motion.div
  variants={item}
  className="flex items-center gap-5 pt-4"
>
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/deepanb0202"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-[#0A66C2] hover:bg-[#0A66C2]/15 hover:text-[#0A66C2]"
  >
    <FaLinkedin size={23} />
  </a>

  {/* LeetCode */}
  <a
    href="https://leetcode.com/u/B_Deepan/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LeetCode"
    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-[#FFA116] hover:bg-[#FFA116]/15 hover:text-[#FFA116]"
  >
    <FaCode size={23} />
  </a>

  {/* GitHub */}
  <a
    href="https://github.com/DeepanB2005"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-white hover:bg-white/10 hover:text-white"
  >
    <FaGithub size={23} />
  </a>
</motion.div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex w-full items-start justify-center lg:justify-center"
          >
            <div className="relative mx-auto mt-[-200px] w-full max-w-[300px] overflow-hidden rounded-[18px] border border-white/10 bg-white/5 shadow-[0_0_25px_rgba(34,211,238,0.14)] md:max-w-[340px]">
              <img
                src={meImage}
                alt="Deepan portrait"
                className="mx-auto block h-[340px] w-full object-cover object-center md:h-[420px]"
              />
            </div>
          </motion.div>
        </div>



      </motion.div>
    </section>
  );
}

export default AboutPage;
