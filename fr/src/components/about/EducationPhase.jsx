import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa6';
import ElectricBorder from '../effects/ElectricBorder.jsx';

export function EducationPhase({ eduOpacity, eduY, eduBlur, eduPointer }) {
  return (
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
            <div className="flex h-12 w-22 shrink-0 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/10 text-cyan-300">
              <FaGraduationCap size={22} />
            </div>

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
  );
}
