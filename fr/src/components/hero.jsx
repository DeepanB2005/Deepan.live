import { useRef, useState, useEffect } from "react";

import raysVideo from "../assets/4s.mp4";
import reverseVideo from "../assets/rev1.mp4";
import HeroContent from "./herocontent";
import "./effects/smoke.css";
import SmokeEffect from "./effects/smokeEffect";

function Hero() {
  const forwardRef = useRef(null);
  const reverseRef = useRef(null);

  const lastPointerX = useRef(null);

  const [direction, setDirection] = useState("forward");

  const PLAYBACK_RATE = 4;

  // ===== PLAY REGION =====
  const LEFT_WIDTH = 300;
  const LEFT_OFFSET = 1150;

  // Preload both videos
  useEffect(() => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;

    if (!forward || !reverse) return;

    forward.load();
    reverse.load();

    forward.pause();
    reverse.pause();
  }, []);

  // ==============================
  // FORWARD
  // ==============================

  const playForward = () => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;

    if (!forward || !reverse) return;

    reverse.pause();

    forward.pause();
    forward.currentTime = 0;
    forward.playbackRate = PLAYBACK_RATE;

    const start = () => {
      setDirection("forward");
      forward.play().catch(() => {});

      forward.onended = () => {
        // Fade out before resetting
        forward.style.transition = "opacity 500ms ease-in-out";
        forward.style.opacity = "0.5";

        setTimeout(() => {
          forward.pause();
          forward.currentTime = 0;

          // Fade back in after resetting
          forward.style.opacity = "1";

          setTimeout(() => {
            forward.style.transition = "";
          }, 350);
        }, 350);
      };
    };

    if (forward.readyState >= 3) {
      start();
    } else {
      forward.addEventListener("canplay", start, { once: true });
    }
  };

  // ==============================
  // REVERSE
  // ==============================
  const playReverse = () => {
    const forward = forwardRef.current;
    const reverse = reverseRef.current;

    if (!forward || !reverse) return;

    forward.pause();
    reverse.currentTime = 0;
    reverse.playbackRate = PLAYBACK_RATE;

    const start = () => {
      setDirection("reverse");
      reverse.play().catch(() => {});
    };

    if (reverse.readyState >= 3) {
      start();
    } else {
      reverse.addEventListener("canplay", start, { once: true });
    }
  };

  // ==============================
  // CURSOR MOVEMENT
  // ==============================
  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const regionStart = LEFT_OFFSET;
    const regionEnd = LEFT_OFFSET + LEFT_WIDTH;

    const previousX = lastPointerX.current;

    // RIGHT → LEFT
    if (
      previousX !== null &&
      previousX > regionEnd &&
      x >= regionStart &&
      x <= regionEnd
    ) {
      playReverse();
    }

    // LEFT → RIGHT
    if (
      previousX !== null &&
      previousX < regionStart &&
      x >= regionStart &&
      x <= regionEnd
    ) {
      playForward();
    }

    lastPointerX.current = x;
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
    >
      <SmokeEffect/>
      {/* ================= FORWARD ================= */}
      <video
        ref={forwardRef}
        src={raysVideo}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
          direction === "forward" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ================= REVERSE ================= */}
      <video
        ref={reverseRef}
        src={reverseVideo}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
          direction === "reverse" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0, 0, 0, 0.08),rgba(2,6,23,0.7))]" />

      {/* ================= RED REGION ================= */}
      <div
        className="absolute top-0 bottom-0 z-20"
        style={{
          width: `${LEFT_WIDTH}px`,
          left: `${LEFT_OFFSET}px`,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-30 flex min-h-screen items-center px-6 sm:px-8 lg:px-16">
        <div className="mx-10 w-full max-w-4xl -translate-x-2 -translate-y-10">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}

export default Hero;