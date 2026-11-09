import "./smoke.css";

const smokePositions = [
  { className: "smoke-layer smoke-top-left smoke-4", delayClass: "smoke-delay-1" },
  { className: "smoke-layer smoke-bottom-right smoke-4", delayClass: "smoke-delay-2" },
];

const smokeImage =
  "https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/animation-smoke-img/images/smoke-4.png";

function SmokeEffect() {
  return (
    <div className="smoke-effect pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {smokePositions.map(({ className, delayClass }, index) => (
        <div key={`${className}-${index}`} className={`${className} ${delayClass}`}>
          <img src={smokeImage} alt="" />
        </div>
      ))}
    </div>
  );
}

export default SmokeEffect;