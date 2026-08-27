import { useEffect, useRef, useState } from "react";

/* ---------- prefers-reduced-motion ---------- */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/* ---------- intersection observer ---------- */
export function useInView<T extends HTMLElement>(threshold = 0.2, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

/* ---------- scramble / decode text ---------- */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&01";
export function useScramble(text: string, active: boolean, speed = 28) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  const frame = useRef(0);

  useEffect(() => {
    if (reduced || !active) {
      if (reduced) setOut(text);
      return;
    }
    frame.current = 0;
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      if (now - last >= speed) {
        last = now;
        frame.current += 1;
        const revealCount = Math.floor(frame.current / 2);
        const next = text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < revealCount) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
        setOut(next);
        if (revealCount >= text.length) {
          setOut(text);
          return;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, active, reduced, speed]);

  return out;
}

/* ---------- animated counter ---------- */
export function useCountUp(target: number, start: boolean, duration = 1400) {
  const reduced = usePrefersReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setVal(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, reduced]);
  return val;
}

/* ---------- belgrade clock ---------- */
export function useBelgradeClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/Belgrade",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ---------- JS-driven marquee (works even when CSS animations are blocked) ---------- */
export function useMarquee(
  trackRef: { current: HTMLElement | null },
  wrapRef: { current: HTMLElement | null },
  speed = 70
) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!track) return;

    let offset = 0;
    let last = performance.now();
    let raf = 0;
    const v = reduced ? speed * 0.35 : speed;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      offset += v * dt;
      const half = track.scrollWidth / 2;
      if (half > 0 && offset >= half) offset -= half;
      track.style.transform = `translate3d(${-offset}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    /* glitch bursts — pure JS so they always fire */
    let timers: number[] = [];
    let loop = 0;
    if (wrap && !reduced) {
      const steps = [
        { x: -36, skew: -4, clip: "inset(0 0 55% 0)", f: "drop-shadow(4px 0 rgba(69,224,160,.9)) drop-shadow(-4px 0 rgba(232,163,61,.9))" },
        { x: 28, skew: 3, clip: "inset(48% 0 0 0)", f: "drop-shadow(-4px 0 rgba(69,224,160,.85)) drop-shadow(4px 0 rgba(232,163,61,.85))" },
        { x: -12, skew: -1.5, clip: "inset(18% 0 32% 0)", f: "none" },
        { x: 0, skew: 0, clip: "inset(0 0 0 0)", f: "none" },
      ];
      const burst = () => {
        steps.forEach((s, i) => {
          timers.push(
            window.setTimeout(() => {
              wrap.style.transform = `translateX(${s.x}px) skewX(${s.skew}deg)`;
              wrap.style.clipPath = s.clip;
              wrap.style.filter = s.f;
            }, i * 72)
          );
        });
      };
      const schedule = () => {
        loop = window.setTimeout(() => {
          if (!document.hidden) burst();
          schedule();
        }, 2400 + Math.random() * 2000);
      };
      schedule();
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(loop);
      timers.forEach(clearTimeout);
      if (wrap) {
        wrap.style.transform = "";
        wrap.style.clipPath = "";
        wrap.style.filter = "";
      }
    };
  }, [trackRef, wrapRef, speed, reduced]);
}

/* ---------- scroll progress (0..1) ---------- */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
        setY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { progress, y };
}
