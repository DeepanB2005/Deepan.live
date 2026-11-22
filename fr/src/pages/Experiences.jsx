import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import ReflectiveCard from '../components/effects/ReflectiveCard';
import chain from '../assets/chain.png';
import sys from '../assets/systimaNX.png';
import chainOffer from '../assets/chainOfferLetter.png';
import systimaCompletion from '../assets/systimanxof.png';
import SoftAurora from '../components/effects/SoftAurora';
import { PageHeading } from '../components/PageHeadings.jsx';
import { FiGlobe, FiGithub, FiFileText } from 'react-icons/fi';

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
              ? {
                  opacity: [1, 1, 0],
                  backgroundColor: ['#030712', '#22d3ee', '#030712'],
                }
              : { opacity: 1, backgroundColor: '#030712' }
          }
          transition={
            active
              ? {
                  duration: 0.7,
                  delay: r * 0.9,
                  times: [0, 0.5, 1],
                  ease: 'easeOut',
                }
              : { duration: 0.15 }
          }
        />
      ))}
    </div>
  );
}

const headingVariants = {
  hidden: { opacity: 1, filter: 'blur(0px)' },
  visible: { opacity: 1, filter: 'blur(0px)' },
};

const cardVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const experiences = [
  {
    img: chain,
    side: -1,
    name: 'Chain Aim Technology',
    location: 'USA · Remote',
    role: 'Frontend Developer Intern',
    tint: '#ed7f7f',
    period: 'Jul 2025 – Mar 2026',
    companyLink: 'https://www.chainaim.com/',
    githubLink: 'https://github.com/chainaimlabs/ZK-PRET-TEST-V3.git',
    document: chainOffer,
    documentLabel: 'View Offer Letter',
    points: [
      'Developed reusable React components and integrated REST APIs for a technical documentation platform supporting a Mina-based Zero-Knowledge Proof verification system.',
      'Built a Docusaurus developer portal that reduced documentation search,improving accessibility ',
    ],
  },
  {
    img: sys,
    side: 1,
    name: 'SystimaNX IT Solutions',
    location: 'Remote',
    role: 'Generative AI Developer Intern',
    tint: '#fab958',
    period: 'Mar 2025 – Apr 2025',
    companyLink: 'https://systimanx.com/en',
    document: systimaCompletion,
    documentLabel: 'View Completion Letter',
      points: [
    'Preprocessed text datasets using tokenization, normalization, and lemmatization for downstream NLP workflows.',
    'Developed text feature-extraction pipelines using TF-IDF and transformer-based embeddings, and prepared datasets for fine-tuning with Hugging Face.',
  ],
  },
];

function DocumentModal({ document, title, onClose }) {
  if (!document) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.35 }}
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#080f1e] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold text-white md:text-lg">
            {title}
          </h3>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-xl text-gray-300 transition hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
            aria-label="Close document"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3 md:p-5">
          <img
            src={document}
            alt={title}
            className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Experiences() {
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.9 });

  const [introKey, setIntroKey] = useState(0);
  const [wasInView, setWasInView] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  if (inView !== wasInView) {
    setWasInView(inView);
    if (inView) setIntroKey((k) => k + 1);
  }

  const state = inView ? 'visible' : 'hidden';

  return (
    <>
      <motion.div
        ref={rootRef}
        initial={false}
        animate={{ opacity: 1 }}
        className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white"
      >
        {/* <PixelReveal active={inView} runKey={introKey} /> */}

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

        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(39,255,243,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-20 md:px-10 lg:px-12">
          <div className="w-full">
            <motion.div
              key={`heading-${introKey}`}
              variants={headingVariants}
              initial={false}
              animate={state}
              className="mb-12 text-center"
            >
              <p className="mb-3 text-sm uppercase tracking-[0.5em] text-cyan-300/80">
                Intern
              </p>

              <div className="mx-auto h-[72px] w-[280px] md:h-[82px] md:w-[350px] flex items-center justify-center ">
                <PageHeading
                  name="experiences"
                  warpStrength={0.12}
                  warpScale={2.2}
                  speed={1.25}
                  pointerStrength={1.35}
                  refraction={0.024}
                  fontSize={202}
                  fontWeight={700}
                  letterSpacing="-0.04em"
                  lineHeight={0.9}
                  className="!h-[72px] !min-h-0 !w-[280px] md:!h-[82px] md:!w-[350px]"
                  style={{ height: '72px', width: '280px'  }}
                />
              </div>
            </motion.div>

            <div className="grid gap-10 lg:grid-cols-2">
              {experiences.map((exp) => (
                <motion.div
                  key={`${exp.name}-${introKey}`}
                  custom={exp.side}
                  variants={cardVariants}
                  initial={false}
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
                    width={385}
                    height={500}
                  >
                    <motion.div
                      variants={contentVariants}
                      initial={false}
                      animate={state}
                      className="flex flex-col items-center gap-3 text-center"
                    >
                      <img
                        src={exp.img}
                        alt={exp.name}
                        className="h-10 w-10 object-contain"
                      />

                      <h2 className="text-2xl font-bold text-cyan-300 md:text-3xl">
                        {exp.name}
                      </h2>

                      <p className="text-sm text-gray-300">
                        {exp.location}
                      </p>

                      <p className="text-lg text-gray-200">
                        {exp.role}
                      </p>

                      <p className="text-sm text-gray-400">
                        {exp.period}
                      </p>

                      <ul className=" list-disc space-y-2 pl-5 text-left text-sm leading-6 text-gray-300">
                        {exp.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>

                      <div className="mt-3 flex justify-center gap-4">
                        <a
                          href={exp.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Company Website"
                          className="text-cyan-300 transition hover:scale-125 hover:text-cyan-200"
                        >
                          <FiGlobe size={28} />
                        </a>

                        {exp.githubLink && (
                          <a
                            href={exp.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            className="text-white transition hover:scale-125 hover:text-gray-300"
                          >
                            <FiGithub size={32} />
                          </a>
                        )}

                        <button
                          onClick={() =>
                            setSelectedDocument({
                              image: exp.document,
                              title: exp.documentLabel,
                            })
                          }
                          title={exp.documentLabel}
                          className="text-amber-300 transition hover:scale-125 hover:text-amber-200"
                        >
                          <FiFileText size={32} />
                        </button>
                      </div>
                    </motion.div>
                  </ReflectiveCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <DocumentModal
        document={selectedDocument?.image}
        title={selectedDocument?.title}
        onClose={() => setSelectedDocument(null)}
      />
    </>
  );
}

export default Experiences;
