'use client';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import GradientText from './effects/textgradient';
import WarpText from './effects/warp';
import GlowCursor from './effects/cursor';

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  activeHref = '/',
  className = ''
}) => {
  const isHomeSection = activeHref === '/';
  const [navVisible, setNavVisible] = useState(isHomeSection);
  const isNavVisible = isHomeSection || navVisible;

  useEffect(() => {
    setNavVisible(isHomeSection);
    if (isHomeSection) return undefined;

    const revealDistance = 110;

    const handleMouseMove = (event) => {
      setNavVisible(event.clientY <= revealDistance);
    };

    const handleMouseLeave = () => {
      setNavVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHomeSection]);

  const basePillClasses =
    'relative isolate flex items-center justify-center rounded-full px-6 md:px-8 py-3 font-semibold text-[0.82rem] md:text-[0.92rem] uppercase tracking-[0.12em] transition-colors duration-300';

  return (
    <motion.div
      initial={false}
      animate={{ opacity: isNavVisible ? 1 : 0, y: isNavVisible ? 0 : -20, scale: isNavVisible ? 1 : 0.9 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-1/2 top-5 z-50 w-[min(92vw,980px)] -translate-x-1/2 ${className}`}
      style={{ pointerEvents: isNavVisible ? 'auto' : 'none' }}
    >

        <nav
          className="relative z-10 flex h-full items-center justify-between gap-3 rounded-[999px] border border-white/10 bg-white/[0.06] px-2 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
          aria-label="Primary navigation"
        >
          <ul className="flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-full bg-transparent px-1 py-1">

            {items.map((item) => {
              const isActive = activeHref === item.href;
              const isHomeTab = item.href === '/';

              return (
                <li key={item.href} className="flex-1">
                  <Link
                    to={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${basePillClasses} ${
                      isActive
                        ? 'text-white'
                        : 'text-white/90 hover:text-white'
                    }`}
                    style={{ minWidth: '110px' }}
                  >

                    {/* Shared animated active pill */}
                    {isActive && (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 z-0 rounded-full border border-white/20 bg-white/20 shadow-[0_0_20px_rgba(103,232,249,0.12),inset_0_0_12px_rgba(255,255,255,0.08)]"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                          mass: 0.7
                        }}
                      />
                    )}

                    {/* Navigation text */}
                    <span className="relative z-0 flex w-full items-center justify-center">
                      {item.label}
                      {/* {isActive && isHomeTab ? (
                        <GradientText
                          colors={['#27ff86', '#f4daa1', '#46f2ec']}
                          animationSpeed={1.5}
                          showBorder
                        >
                          {item.label}
                        </GradientText>
                      ) : (
                        <WarpText
                          text={item.label}
                          color="#f8f5ff"
                          warpStrength={0.08}
                          warpScale={2.5}
                          speed={1.55}
                          pointerInfluence={6}
                          pointerStrength={4.38}
                          refraction={0.018}
                          ripple
                          fontSize={20}
                          lineHeight={0.89}
                          className="!min-h-0 !h-[26px] !w-full"
                          style={{
                            height: '26px',
                            width: '100%'
                          }}
                        />
                      )} */}
                    </span>

                  </Link>
                </li>
              );
            })}

          </ul>
        </nav>
    </motion.div>
  );
};

export default PillNav;


// 'use client';

// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';

// import GradientText from './effects/textgradient';
// import GlowCursor from './effects/cursor';

// const PillNav = ({
//   logo,
//   logoAlt = 'Logo',
//   items = [],
//   activeHref = '/',
//   className = ''
// }) => {
//   const basePillClasses =
//     'relative isolate flex items-center justify-center rounded-full px-6 md:px-8 py-3 font-semibold text-[0.82rem] md:text-[0.92rem] uppercase tracking-[0.12em] transition-colors duration-300';

//   return (
//     <motion.div
//       initial={false}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.3 }}
//       className={`absolute left-1/2 top-5 z-50 w-[min(92vw,980px)] -translate-x-1/2 ${className}`}
//     >
//       <GlowCursor
//         color="#67E8F9"
//         secondaryColor="#A78BFA"
//         trailLength={40}
//         trailWidth={8}
//         trailTaper={0.8}
//         followSpeed={0.16}
//         glowIntensity={1.2}
//         glowSpread={1}
//         hotspot={0.65}
//         brightness={1.1}
//         opacity={0.45}
//         pulseSpeed={1.1}
//         noiseStrength={0.02}
//         idleFade
//         idleTimeout={700}
//         fadeDuration={900}
//         blendMode="normal"
//         className="w-full h-full"
//       >
//         <nav
//           className="flex items-center justify-between gap-3 rounded-full border border-white/5 bg-transparent px-2 py-2 h-full"
//           aria-label="Primary navigation"
//         >
//           <ul className="flex flex-1 items-center justify-center gap-3 overflow-hidden rounded-full bg-transparent px-1 py-1">

//             {items.map((item) => {
//               const isActive = activeHref === item.href;
//               const isHomeTab = item.href === '/';

//               return (
//                 <li key={item.href} className="flex-1">
//                   <Link
//                     to={item.href}
//                     aria-current={isActive ? 'page' : undefined}
//                     className={`${basePillClasses} ${
//                       isActive
//                         ? 'text-white'
//                         : 'text-white/90 hover:text-white'
//                     }`}
//                     style={{ minWidth: '110px' }}
//                   >

//                     {/* Stable active background */}
//                     {isActive && (
//                       <motion.span
//                         className="absolute inset-0 z-0 rounded-full border border-white/15 bg-white/[0.08] shadow-[0_0_15px_rgba(103,232,249,0.08)]"
//                         transition={{
//                           duration: 0.2,
//                           ease: 'easeOut'
//                         }}
//                       />
//                     )}

//                     {/* Navigation text */}
//                     <span className="relative z-10 flex w-full items-center justify-center">

//                       {isActive && isHomeTab ? (
//                         <GradientText
//                           colors={['#27ff86', '#f4daa1', '#46f2ec']}
//                           animationSpeed={1.5}
//                           showBorder={false}
//                         >
//                           {item.label}
//                         </GradientText>
//                       ) : (
//                         <span className="flex h-[26px] w-full items-center justify-center whitespace-nowrap text-[0.92rem] font-semibold tracking-[0.12em] text-[#f8f5ff] transition-all duration-300 hover:text-cyan-200">
//                           {item.label}
//                         </span>
//                       )}

//                     </span>
//                   </Link>
//                 </li>
//               );
//             })}

//           </ul>
//         </nav>
//       </GlowCursor>
//     </motion.div>
//   );
// };

// export default PillNav;
