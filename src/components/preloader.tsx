import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks";
import { LogoMark } from "./chrome";

/* [threshold, line] — revealed as progress passes the threshold */
const BOOT_LINES: Array<[number, string]> = [
  [0, "ARGAMENON BIOS v2.6.1 — power-on self test"],
  [7, "cpu: developer ×96 ................ OK"],
  [13, "kernel: argamenon-6.6 LTS ......... OK"],
  [19, "mem: kofein 32GB .................. OK"],
  [25, "espresso.mod @ 9 bara ............. OK"],
  [31, "wifi6e: 1 Gbit/s · ping 4ms ....... OK"],
  [38, "utičnice: 128/128 online .......... OK"],
  [44, "zrna: single origin · mleveno ..... OK"],
  [50, "gpu: latte-art renderer ........... OK"],
  [57, "zvučna kartica: meh. tastature .... GLASNA"],
  [64, "montiram /dev/kafa ................ OK"],
  [72, "guest mode: dozvoljen ............. OK"],
  [80, "pokrećem argamenon.rs ............. OK"],
  [90, "sipam prvu šolju .................. OK"],
];

const READY_LINE = "✓ sistem spreman — dobrodošli";

/* boot timeline: moves + dramatic holds, ~6.7s total */
const SEGMENTS = [
  { to: 18, dur: 900 },
  { to: 44, dur: 1000, hold: 350 },
  { to: 71, dur: 1100, hold: 450 },
  { to: 87, dur: 800, hold: 300 },
  { to: 95, dur: 700, hold: 420 },
  { to: 100, dur: 650 },
];
const PLAN = (() => {
  let cursor = 0;
  let from = 0;
  return SEGMENTS.map((s) => {
    const start = cursor;
    const moveEnd = start + s.dur;
    const end = moveEnd + (s.hold ?? 0);
    cursor = end;
    const seg = { from, to: s.to, start, moveEnd, end, dur: s.dur };
    from = s.to;
    return seg;
  });
})();
const TOTAL = PLAN[PLAN.length - 1].end;

/* ---------- ASCII cup that fills with coffee ---------- */
const CUP_TOP = ["       )  )   (  (", "      (  (     )  )", "    ┌───────────────┐"];
const CUP_BOTTOM = ["    └───────────────┘", "       └───────────┘"];
const INNER_ROWS = 6;
const INNER_W = 15;

function CupAscii({ p }: { p: number }) {
  const rowsFilled = (p / 100) * INNER_ROWS;

  return (
    <pre className="select-none font-mono text-[11px] leading-[1.35] sm:text-[13px]" aria-hidden="true">
      <span className="term-glow text-brew">{CUP_TOP[0]}</span>
      {"\n"}
      <span className="term-glow text-brew" style={{ animationDelay: "0.6s" }}>
        {CUP_TOP[1]}
      </span>
      {"\n"}
      <span className="text-moss">{CUP_TOP[2]}</span>
      {"\n"}
      {Array.from({ length: INNER_ROWS }).map((_, i) => {
        const amount = Math.max(0, Math.min(1, rowsFilled - (INNER_ROWS - 1 - i)));
        const chars = Math.round(amount * INNER_W);
        return (
          <span key={i}>
            <span className="text-moss">{"    │ "}</span>
            <span className={chars > 0 ? "text-brew" : "text-line-2"}>
              {"█".repeat(chars).padEnd(INNER_W, " ")}
            </span>
            <span className="text-moss">{" │"}</span>
            <span className="text-term">▌</span>
            {"\n"}
          </span>
        );
      })}
      <span className="text-moss">{CUP_BOTTOM[0]}</span>
      {"\n"}
      <span className="text-moss">{CUP_BOTTOM[1]}</span>
    </pre>
  );
}

/* ---------- segmented block bar ---------- */
const SEGMENTS_BAR = 28;
function BlockBar({ p }: { p: number }) {
  const filled = Math.round((p / 100) * SEGMENTS_BAR);
  const hasTip = filled > 0 && filled < SEGMENTS_BAR;
  return (
    <div className="font-mono text-sm tracking-[0.18em] sm:text-base" aria-hidden="true">
      <span className="text-term">{"█".repeat(filled)}</span>
      {hasTip && <span className="text-brew">▓</span>}
      <span className="text-line-2">{"░".repeat(Math.max(0, SEGMENTS_BAR - filled - (hasTip ? 1 : 0)))}</span>
    </div>
  );
}

/* ---------- log line with progressive typing ---------- */
function bootLineText(threshold: number, line: string, p: number) {
  const chars = Math.floor(Math.max(0, p - threshold) * 1.8);
  return line.slice(0, Math.min(line.length, chars));
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function Preloader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const reduced = usePrefersReducedMotion();
  const [p, setP] = useState(0);
  const [exiting, setExiting] = useState(false);
  const finished = useRef(false);
  const skip = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setExiting(true);
    onReveal();
    window.setTimeout(onDone, reduced ? 400 : 900);
  };

  /* scroll lock while booting */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* progress engine — always runs the full boot (click to skip) */
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const elapsed = now - t0;

      if (skip.current || elapsed >= TOTAL) {
        setP(100);
        window.setTimeout(finish, skip.current ? 150 : 700);
        return;
      }

      const seg = PLAN.find((s) => elapsed < s.end) ?? PLAN[PLAN.length - 1];
      let next: number;
      if (elapsed >= seg.moveEnd) {
        next = seg.to; /* holding — dramatic pause */
      } else {
        const local = easeInOut((elapsed - seg.start) / seg.dur);
        next = seg.from + (seg.to - seg.from) * local;
      }
      setP(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const pp = Math.floor(p);
  const numStr = `${String(pp).padStart(3, "0")}%`;
  const visibleLines = BOOT_LINES.filter(([th]) => p >= th);
  const ready = p >= 100;

  return (
    <div
      className={`preloader-panel fixed inset-0 z-[100] overflow-hidden bg-ink ${exiting ? "preloader-exit" : ""}`}
      role="status"
      aria-label="Učitavanje sajta"
      onClick={() => {
        skip.current = true;
      }}
    >
      <div className="crt-on relative flex h-full flex-col">
        {/* ambient */}
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="glow-green pointer-events-none absolute left-[-10%] top-[-10%] h-[480px] w-[480px]" />
        <div className="glow-amber pointer-events-none absolute bottom-[-12%] right-[-8%] h-[460px] w-[460px]" />
        <div className="preloader-edge" />

        {/* machine frame */}
        <div className="pointer-events-none absolute inset-3 border border-line sm:inset-5">
          {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map(
            (pos) => (
              <span key={pos} className={`absolute h-4 w-4 border-term ${pos}`} />
            )
          )}
        </div>

        {/* top strip */}
        <div className="relative flex items-center justify-between px-7 pt-7 font-mono text-[10px] uppercase tracking-[0.25em] text-moss sm:px-11 sm:pt-9 sm:text-[11px]">
          <span className="flex items-center gap-2">
            <LogoMark className="h-4 w-4" /> argamenon systems
          </span>
          <span className="flicker hidden text-brew sm:inline">● ekstrakcija u toku</span>
          <span>boot v2.6.1</span>
        </div>

        {/* main grid */}
        <div className="relative flex flex-1 items-center">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-7 sm:px-11 lg:grid-cols-[auto_1fr] lg:gap-14">
            {/* cup */}
            <div className="hidden justify-center border-r border-line pr-14 lg:flex">
              <CupAscii p={p} />
            </div>

            {/* percent + name lockup */}
            <div className="flex flex-col items-end">
              <span
                aria-hidden="true"
                className="text-outline-term select-none font-display text-[clamp(30px,5vw,72px)] font-bold uppercase leading-[0.9] tracking-[0.06em]"
              >
                Argamenon
              </span>
              {/* liquid-fill counter: dim glass shell fills with glowing green */}
              <p className="relative -mt-1 font-display text-[clamp(88px,19vw,210px)] font-bold leading-[0.82] tracking-tighter tabular-nums sm:-mt-2">
                <span className="text-outline-term">{numStr}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-term"
                  style={{
                    clipPath: `inset(${Math.max(0, 100 - p)}% 0 0 0)`,
                    filter: "drop-shadow(0 0 26px rgba(69,224,160,0.4))",
                  }}
                >
                  {numStr}
                </span>
                {/* amber waterline riding the fill surface */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 h-[3px] bg-brew shadow-[0_0_18px_rgba(232,163,61,0.9)]"
                  style={{
                    top: `${Math.max(0, 100 - p)}%`,
                    opacity: p > 1.5 && p < 99.5 ? 1 : 0,
                    transition: "opacity 200ms",
                  }}
                />
              </p>
              <div className="mt-5 flex flex-col items-end gap-2.5">
                <BlockBar p={p} />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-moss">
                  {ready ? <span className="text-term">spremno — ulazim u lokal</span> : "ekstrakcija sistema"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* boot log */}
        <div className="relative border-t border-line bg-ink-2/70 px-7 py-5 sm:px-11">
          <div className="mx-auto flex h-[76px] max-w-7xl flex-col justify-end font-mono text-[11px] leading-[1.7] sm:text-xs">
            {visibleLines.slice(-3).map(([th, line], i, arr) => {
              const isLast = i === arr.length - 1;
              const typed = bootLineText(th, line, p);
              return (
                <p key={line} className="truncate text-mist">
                  <span className="text-term">$</span> {typed}
                  {isLast && !ready && typed.length < line.length && <span className="caret text-term">▌</span>}
                </p>
              );
            })}
            {ready && (
              <p className="truncate font-bold text-term">
                <span>$</span> {READY_LINE}
                <span className="caret">▌</span>
              </p>
            )}
          </div>
          <p className="mx-auto mt-3 hidden max-w-7xl text-right font-mono text-[10px] uppercase tracking-[0.2em] text-moss/60 sm:block">
            klik = preskoči ▸
          </p>
        </div>
      </div>
    </div>
  );
}
