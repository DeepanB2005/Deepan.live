import SideRays from '../components/effects/SideRays.jsx';

function AboutPage() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* Side Rays Background */}
      <div className="absolute inset-0 z-0">
        <SideRays
          rayColor1="#ff8da2"
          rayColor2="#0ff1ec"
          origin="top-right"
          speed={2.5}
          intensity={2.3}
          spread={2}
          density={5}
          followMouse
          blend={0.6}
          sharpness={0.5}
          tilt={0}
          falloff={1.25}
          glow={1}
          saturation={1.25}
          dust={0}
          mouseInfluence={0.5}
          intro
          lightMode={false}
          opacity={1}
        />
      </div>

      {/* About Content */}
      <div className="relative z-10">
        {/* Your existing About page content */}
      </div>
    </section>
  );
}

export default AboutPage;