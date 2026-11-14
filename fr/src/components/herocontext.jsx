import { motion, useReducedMotion } from "framer-motion";
import TechText from "./effects/techtext.jsx";
import { useIntroReady } from "./introContext.jsx";

const EASE = [0.22, 1, 0.36, 1];

const HeroContent = () => {
  const ready = useIntroReady();
  const reduce = useReducedMotion();
  const show = ready || reduce;

  const hidden = { opacity: 0, y: 28 };
  const visible = { opacity: 1, y: 0 };

  return (
    <section id="about" className="max-w-5xl text-left text-white">
      <motion.p
        className="mb-4 border-l-2 border-cyan-200 pl-3 font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-base"
        initial={reduce ? false : hidden}
        animate={show ? visible : hidden}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      >
        The guy behind the screen.
      </motion.p>

      <motion.div
        className="mb-4 w-full max-w-[900px] overflow-hidden"
        initial={reduce ? false : { opacity: 0, y: 36 }}
        animate={show ? visible : { opacity: 0, y: 36 }}
        transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
      >
        <div
          style={{
            width: "100%",
            height: "250px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {/* Mounted after the loader so its own "assemble" intro is actually seen */}
          {ready && (
            <TechText
              text="Deepan"
              fontWeight={500}
              fontSize={330}
              reveal="area"
              dashLength={6}
              dashGap={2}
              specks={20}
              intro="assemble"
              introDuration={2}
              clickKick
              guides={false}
              fontFamily={'Georgia, "Times New Roman", serif'}
              letterSpacing={0.01}
              accentColor="#38fcf6"
              reach={200}
              softness={0.8}
              lineStyle="dashed"
              strokeWidth={1.75}
              speed={1.3}
              bounce={0.4}
              selection
              labels
              color="#ffffff"
              align="center"
              draggable
              sweep
            />
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroContent;