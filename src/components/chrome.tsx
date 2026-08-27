import { useRef, useState, type ReactNode } from "react";
import { useLang } from "../i18n";
import { useBelgradeClock, useInView, useMarquee, usePrefersReducedMotion, useScrollProgress } from "../hooks";

/* ================= Logo ================= */
export function LogoMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* steam */}
      <path
        d="M11.5 3.5c0 2.2 2 2.3 2 4.5M18.5 3.5c0 2.2 2 2.3 2 4.5"
        stroke="#E8A33D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* cup */}
      <path
        d="M6.5 12h17v7.5a7.5 7.5 0 0 1-7.5 7.5h-2a7.5 7.5 0 0 1-7.5-7.5V12Z"
        stroke="#45E0A0"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* handle */}
      <path d="M23.5 14h1.5a4 4 0 0 1 0 8h-1.5" stroke="#45E0A0" strokeWidth="2.2" strokeLinecap="round" />
      {/* terminal prompt >_ */}
      <path d="M11 16.5l3.2 2.7L11 21.9" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 22h4.5" stroke="#E8A33D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ================= Reveal ================= */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "figure" | "article";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ================= Section heading ================= */
export function SectionHead({
  kicker,
  title,
  sub,
  align = "left",
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <Reveal>
        <p className="font-mono text-[13px] tracking-[0.22em] text-term uppercase">
          <span className="text-brew mr-2">▚</span>
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="reveal-line mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-fog sm:text-4xl lg:text-5xl">
          <span>{title}</span>
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={180}>
          <p className={`mt-5 max-w-xl text-[15px] leading-relaxed text-mist ${align === "center" ? "mx-auto" : ""}`}>
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ================= Header ================= */
export function Header() {
  const { lang, setLang, t } = useLang();
  const clock = useBelgradeClock();
  const [open, setOpen] = useState(false);
  const { y, progress } = useScrollProgress();

  const links = [
    { href: "#space", label: t.nav.space },
    { href: "#specs", label: t.nav.specs },
    { href: "#menu", label: t.nav.menu },
    { href: "#events", label: t.nav.events },
    { href: "#loyalty", label: t.nav.rewards },
    { href: "#info", label: t.nav.info },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-all duration-500 ${
        y > 40 ? "border-line bg-ink/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      {/* scroll progress */}
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 z-10 h-[2px] bg-term shadow-[0_0_12px_rgba(69,224,160,0.7)]"
        style={{ width: `${progress * 100}%` }}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* logo */}
        <a href="#top" className="group flex items-center gap-3" aria-label="Argamenon">
          <span className="grid h-9 w-9 place-items-center border border-line-2 bg-panel transition-all duration-300 group-hover:border-term-dim group-hover:shadow-[0_0_18px_-4px_rgba(69,224,160,0.5)]">
            <LogoMark className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-fog">
            argamenon<span className="text-term">.cafe</span>
          </span>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link font-mono text-[13px] text-mist transition-colors hover:text-term"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* clock */}
          <span className="hidden items-center gap-2 font-mono text-xs text-mist md:flex">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-term" />
            {clock}
          </span>

          {/* lang toggle */}
          <div className="flex border border-line-2 bg-panel font-mono text-xs" role="group" aria-label="language">
            {(["sr", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1.5 uppercase transition-all duration-300 ${
                  lang === l ? "bg-term font-bold text-ink" : "text-mist hover:text-fog"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* mobile burger */}
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center border border-line-2 bg-panel text-term lg:hidden"
            aria-label="meni"
            aria-expanded={open}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open ? (
                <path d="M2 1l12 10M14 1L2 11" />
              ) : (
                <>
                  <path d="M0 1h16" />
                  <path d="M0 6h11" />
                  <path d="M0 11h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <div
        className={`overflow-hidden border-line bg-ink/95 backdrop-blur-md transition-all duration-400 lg:hidden ${
          open ? "max-h-80 border-b" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-5 py-4">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 font-mono text-sm text-mist last:border-0 hover:text-term"
            >
              <span className="mr-3 text-term-dim">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

/* ================= Ticker ================= */
/* one lucide-style icon per spec, matched by position */
const TICKER_ICONS: ReactNode[] = [
  /* zap — utičnice */
  <path key="0" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  /* bars — bandwidth */
  <g key="1">
    <path d="M3 20h18" />
    <path d="M6 20v-6" />
    <path d="M12 20V8" />
    <path d="M18 20v-10" />
  </g>,
  /* wifi */
  <g key="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </g>,
  /* activity — ping */
  <path key="3" d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  /* layout — stolovi */
  <g key="4">
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </g>,
  /* users — sobe */
  <g key="5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </g>,
  /* clock — radno vreme */
  <g key="6">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </g>,
  /* heart — pet friendly */
  <path
    key="7"
    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.04 3 5.5l7 7Z"
  />,
  /* rotate — refill */
  <g key="8">
    <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
    <path d="M21 3v5h-5" />
  </g>,
  /* monitor */
  <g key="9">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </g>,
  /* coffee */
  <g key="10">
    <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <path d="M7 2v2M11 2v2" />
  </g>,
  /* moon — tiha zona */
  <path key="11" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
];

export function Ticker() {
  const { t } = useLang();
  const items = [...t.ticker, ...t.ticker];
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useMarquee(trackRef, wrapRef, 70);

  return (
    <div className="edge-fade-x relative overflow-hidden border-y border-line bg-ink-2 py-4" aria-hidden="true">
      <div ref={wrapRef} className="will-change-transform">
        <div ref={trackRef} className="flex w-max items-center whitespace-nowrap will-change-transform">
          {items.map((item, i) => (
            <span key={i} className="group flex items-center font-mono text-[13px] tracking-wide sm:text-sm">
              <span className="flex items-center gap-2.5 px-7 transition-colors duration-300 sm:px-9">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-term-dim transition-colors duration-300 group-hover:text-brew"
                >
                  {TICKER_ICONS[i % TICKER_ICONS.length]}
                </svg>
                <span className={i % 3 === 1 ? "text-brew" : "text-mist"}>{item}</span>
              </span>
              <span className="h-4 w-px bg-line-2" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Giant marquee ================= */
export function BigMarquee() {
  const { t } = useLang();
  const seq = [...t.marquee, ...t.marquee, ...t.marquee];
  const items = [...seq, ...seq]; /* duplicated for a seamless -50% loop */
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useMarquee(trackRef, wrapRef, 115);

  return (
    <div className="edge-fade-x-lg relative overflow-hidden border-y border-line bg-ink-2/70 py-7 sm:py-10" aria-hidden="true">
      <div ref={wrapRef} className="will-change-transform">
        <div ref={trackRef} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform sm:gap-12">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 sm:gap-12">
            <span
              data-text={w}
              style={{ ["--gd" as never]: `${(i % 6) * -1.15}s` }}
              className={`font-display text-[clamp(48px,8vw,116px)] font-bold uppercase leading-[0.95] tracking-tight ${
                i % 3 === 0 ? "glitch text-fog" : i % 3 === 1 ? "text-outline-term" : "text-outline-brew"
              }`}
            >
              {w}
            </span>
            <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0 text-term-dim">
              <path d="M9 1L17 9L9 17L1 9Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}

/* ================= Footer ================= */
export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const nav = [
    { href: "#space", label: t.nav.space },
    { href: "#specs", label: t.nav.specs },
    { href: "#menu", label: t.nav.menu },
    { href: "#events", label: t.nav.events },
    { href: "#loyalty", label: t.nav.rewards },
    { href: "#info", label: t.nav.info },
  ];

  return (
    <footer className="relative border-t border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border border-line-2 bg-panel">
                <LogoMark className="h-6 w-6" />
              </span>
              <span className="font-display text-xl font-bold text-fog">
                argamenon<span className="text-term">.cafe</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">{t.footer.desc}</p>
            <p className="mt-5 flex items-center gap-2 font-mono text-xs text-moss">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-term" />
              {t.footer.hoursShort}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-moss"># {t.footer.navTitle}</p>
            <ul className="mt-4 space-y-2.5">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="nav-link font-mono text-sm text-mist hover:text-term">
                    → {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-moss"># {t.footer.socialsTitle}</p>
            <ul className="mt-4 space-y-2.5">
              {t.footer.socials.map((s, i) => (
                <li key={s}>
                  <a
                    href={["https://github.com", "https://discord.com", "https://instagram.com", "https://x.com"][i]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link font-mono text-sm text-mist hover:text-term"
                  >
                    → {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 font-mono text-xs text-moss sm:flex-row sm:items-center">
          <p>
            © {year} Argamenon · {t.footer.tagline} · {t.footer.rights}
          </p>
          <p className="text-term-dim">
            <span className="text-brew">$</span> {t.footer.made}
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ================= Back to top ================= */
export function BackToTop() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();
  const { progress, y } = useScrollProgress();
  const visible = y > 420;

  const R = 22;
  const C = 2 * Math.PI * R;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label={t.backToTop}
      title={t.backToTop}
      className={`group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-50 grid h-14 w-14 place-items-center transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={R} fill="#101915" stroke="#2a3a31" strokeWidth="1.5" />
        <circle
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="#45e0a0"
          strokeWidth="2"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="relative text-term transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path d="M8 14V3M3 7.5L8 2.5l5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap border border-line-2 bg-panel px-2.5 py-1.5 font-mono text-[11px] text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
        {t.backToTop} <span className="text-term">↑</span>
      </span>
    </button>
  );
}
