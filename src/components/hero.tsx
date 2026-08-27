import { useEffect, useState } from "react";
import { useLang } from "../i18n";
import { useBelgradeClock, useInView, usePrefersReducedMotion, useScramble } from "../hooks";
import { Reveal } from "./chrome";

/* ---------- typewriter boot sequence ---------- */
function BootTerminal() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const [done, setDone] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.3);

  const lines = t.hero.boot;

  useEffect(() => {
    if (!inView) return;
    setShown([]);
    setTyping("");
    setDone(false);

    if (reduced) {
      setShown(lines);
      setDone(true);
      return;
    }

    let line = 0;
    let char = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      if (cancelled) return;
      if (line >= lines.length) {
        setDone(true);
        return;
      }
      const current = lines[line];
      if (char < current.length) {
        char += 1;
        setTyping(current.slice(0, char));
        timer = setTimeout(step, current.startsWith(">") ? 14 : 26);
      } else {
        setShown((prev) => [...prev, current]);
        setTyping("");
        line += 1;
        char = 0;
        timer = setTimeout(step, current.startsWith("$") ? 420 : 200);
      }
    };
    timer = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [inView, reduced, lines]);

  return (
    <div ref={ref} className="relative">
      {/* glow behind terminal */}
      <div className="glow-green pointer-events-none absolute -inset-10 -z-10" />

      <div className="overflow-hidden border border-line-2 bg-[#0b1210] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0564a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-brew" />
            <span className="h-2.5 w-2.5 rounded-full bg-term" />
          </div>
          <span className="font-mono text-[11px] tracking-wider text-moss">{t.hero.termTitle} — zsh</span>
          <span className={`term-glow h-1.5 w-1.5 rounded-full ${done ? "bg-term" : "bg-brew"}`} />
        </div>

        {/* body */}
        <div className="scanlines relative h-[300px] overflow-hidden px-5 py-4 font-mono text-[13px] leading-[1.75] sm:h-[330px] sm:text-sm">
          {shown.map((l, i) => (
            <p key={i} className={l.startsWith("$") ? "text-fog" : l.includes("✓") ? "text-term" : "text-mist"}>
              {l.startsWith("$") ? (
                <>
                  <span className="text-term">{l.split(" ")[0]}</span>
                  <span>{l.slice(1)}</span>
                </>
              ) : (
                l
              )}
            </p>
          ))}
          {typing && (
            <p className={typing.startsWith("$") ? "text-fog" : "text-mist"}>
              {typing.startsWith("$") ? (
                <>
                  <span className="text-term">{typing.split(" ")[0]}</span>
                  <span>{typing.slice(1)}</span>
                </>
              ) : (
                typing
              )}
              <span className="caret text-term">▌</span>
            </p>
          )}
          {done && (
            <p className="text-fog">
              <span className="text-term">$</span>
              <span className="caret text-term">▌</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- live tray ---------- */
function Tray() {
  const { t } = useLang();
  const clock = useBelgradeClock();
  const [ping, setPing] = useState(4);
  const [seats, setSeats] = useState(17);

  useEffect(() => {
    const id = setInterval(() => {
      setPing(3 + Math.floor(Math.random() * 4));
      setSeats((s) => Math.max(9, Math.min(24, s + (Math.random() > 0.5 ? 1 : -1))));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { label: t.hero.tray.time, value: clock, accent: "text-term" },
    { label: t.hero.tray.ping, value: `${ping} ms`, accent: "text-term" },
    { label: t.hero.tray.seats, value: `${seats}`, accent: "text-brew" },
    { label: t.hero.tray.uptime, value: "99.98%", accent: "text-term" },
    { label: t.hero.tray.ver, value: "stable", accent: "text-moss" },
  ];

  /* explicit borders: 2 cols on mobile, 5 cols on desktop */
  const cellBorder = [
    "",
    "border-l",
    "border-t sm:border-t-0 sm:border-l",
    "border-t sm:border-t-0 border-l",
    "border-t sm:border-t-0 sm:border-l",
  ];

  return (
    <div className="grid grid-cols-2 border border-line bg-ink-2/70 font-mono text-xs sm:grid-cols-5">
      {cells.map((c, i) => (
        <div key={i} className={`border-line px-5 py-4 ${cellBorder[i] ?? ""}`}>
          <p className="truncate text-[10px] uppercase tracking-[0.18em] text-moss">{c.label}</p>
          <p className={`mt-1 truncate text-sm font-medium ${c.accent}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- hero ---------- */
export function Hero() {
  const { t, lang } = useLang();
  const title = useScramble(t.hero.title, true, 34);

  return (
    <section id="top" className="relative overflow-hidden pt-16">
      {/* ambient */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="glow-green pointer-events-none absolute -top-40 left-[-10%] h-[560px] w-[560px]" />
      <div className="glow-amber pointer-events-none absolute right-[-8%] top-24 h-[520px] w-[520px]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* left — words */}
          <div>
            <Reveal>
              <p className="font-mono text-[13px] tracking-[0.18em] text-term">{t.hero.kicker}</p>
            </Reveal>

            <h1 className="mt-5 font-display font-bold leading-[0.92] tracking-tight">
              <span
                className="glitch block w-fit text-[13.5vw] text-fog sm:text-7xl lg:text-[5.6rem]"
                data-text={t.hero.title}
              >
                {title || "\u00A0"}
                <span className="caret text-term">_</span>
              </span>
            </h1>

            <Reveal delay={250}>
              <div className="mt-7 border-l-2 border-brew pl-5 font-display text-lg font-medium leading-snug text-fog/90 sm:text-[22px]">
                <p>{t.hero.line1}</p>
                <p>{t.hero.line2}</p>
                <p className="text-mist">{t.hero.line3}</p>
              </div>
            </Reveal>

            <Reveal delay={380}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#specs"
                  className="group border border-term bg-term/10 px-6 py-3.5 font-mono text-sm font-bold text-term transition-all duration-300 hover:bg-term hover:text-ink hover:shadow-[0_0_30px_-6px_rgba(69,224,160,0.5)]"
                >
                  [ {t.hero.ctaSpecs} ]
                </a>
                <a
                  href="#terminal"
                  className="group flex items-center gap-2.5 border border-line-2 px-6 py-3.5 font-mono text-sm text-mist transition-all duration-300 hover:border-brew hover:text-brew"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2 3l4 4-4 4M8 11h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t.hero.ctaTerminal}
                </a>
              </div>
            </Reveal>

            <Reveal delay={480}>
              <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-moss">
                <span className="flex items-center gap-2">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-term" />
                  <span className="text-term">{t.status.open}</span> {t.status.openUntil}
                </span>
                <span className="hidden text-line-2 sm:inline">│</span>
                <span>
                  <span className="text-brew">17</span> {t.status.seatsFree}
                </span>
              </p>
            </Reveal>
          </div>

          {/* right — terminal */}
          <Reveal delay={200} className="floaty">
            <BootTerminal key={lang} />
          </Reveal>
        </div>

        {/* tray */}
        <Reveal delay={150} className="mt-14">
          <Tray />
        </Reveal>
      </div>
    </section>
  );
}
