"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  trigger: boolean;
  type?: "normal" | "celebration";
}

export default function Confetti({ trigger, type = "normal" }: ConfettiProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!trigger || firedRef.current) return;
    firedRef.current = true;

    if (type === "celebration") {
      const duration = 3000;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#0B3C26", "#A3E4D7", "#D4AC0D", "#E6F4EA"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#0B3C26", "#A3E4D7", "#D4AC0D", "#E6F4EA"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
        colors: ["#0B3C26", "#A3E4D7", "#D4AC0D", "#E6F4EA"],
        scalar: 0.9,
      });
    }

    return () => { firedRef.current = false; };
  }, [trigger, type]);

  return null;
}
