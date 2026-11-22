import WarpText from './effects/warp.jsx';

export const PAGE_HEADINGS = Object.freeze({
  about: 'About',
  education: 'Education',
  techStacks: 'Tech Stacks',
  experiences: 'Experiences',
});

export function PageHeading({
  name,
  className = '',
  style,
  ...warpProps
}) {
  const text = PAGE_HEADINGS[name];

  if (!text) {
    console.warn(`Unknown page heading: ${name}`);
    return null;
  }

  return (
    <WarpText
      text={text}
      color="#f8f5ff"
      warpStrength={0.08}
      warpScale={2.5}
      speed={0.55}
        lens="bulge"
      pointerInfluence={0.28}
      pointerStrength={1.2}
      refraction={0.018}
      ripple
        intro
      fontSize={290}
      fontWeight={800}
      lineHeight={0.85}
      className={className}
      style={style}
      {...warpProps}
    />
  );
}
