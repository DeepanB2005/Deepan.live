import TechText from "./effects/techtext";

const HeroContent = () => (
  <section id="about" className="max-w-5xl text-left text-white">
    <p className="mb-4 border-l-2 border-cyan-200 pl-3 font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-base">
      The guy behind the screen.
    </p>

    <div className="mb-4 w-full max-w-[900px] overflow-hidden">
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
      </div>
    </div>


  </section>
);

export default HeroContent;