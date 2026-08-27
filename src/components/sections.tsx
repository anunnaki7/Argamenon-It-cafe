import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n";
import { useBelgradeClock, useCountUp, useInView } from "../hooks";
import { LogoMark, Reveal, SectionHead } from "./chrome";

/* ============================================================
   SPECS — neofetch + counters
============================================================ */
/* ---------- live [ SYSTEMS CHECK ] panel ---------- */
function SystemsCheck() {
  const { t } = useLang();
  const S = t.specs.systems;
  const clock = useBelgradeClock();
  const [ping, setPing] = useState(4);
  const [seats, setSeats] = useState(18);
  const [brewing, setBrewing] = useState(true);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPing(3 + Math.floor(Math.random() * 5));
      setSeats((s) =>
        Math.max(6, Math.min(28, s + (Math.random() > 0.5 ? 1 : -1) * (Math.random() > 0.7 ? 2 : 1)))
      );
      setBrewing((b) => (Math.random() > 0.72 ? !b : b));
    }, 2600);
    const lid = setInterval(() => setLogIdx((i) => (i + 1) % S.logs.length), 3200);
    return () => {
      clearInterval(id);
      clearInterval(lid);
    };
  }, [S.logs.length]);

  const occ = Math.round(((96 - seats) / 96) * 100);
  const seatsBusy = occ >= 70;

  const rows = [
    {
      label: S.server,
      status: S.operational,
      ok: true,
      value: `${ping} ms`,
      sub: S.pingNow,
      load: 8,
    },
    {
      label: S.seats,
      status: seatsBusy ? S.busy : S.available,
      ok: !seatsBusy,
      value: `${seats}`,
      sub: `${S.load} ${occ}%`,
      load: occ,
    },
    {
      label: S.kitchen,
      status: brewing ? S.busy : S.ready,
      ok: !brewing,
      value: brewing ? "9.1 bar" : "0.0 bar",
      sub: brewing ? S.brewing : S.ready,
      load: brewing ? 78 : 12,
    },
  ];

  return (
    <Reveal className="mt-10">
      <div className="border border-line bg-ink-2/80">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-7">
          <p className="flex items-center gap-2.5 font-mono text-xs font-bold tracking-[0.2em] text-term">
            <span className="pulse-dot h-2 w-2 rounded-full bg-term" />
            {S.title}
          </p>
          <p className="font-mono text-[11px] text-moss">
            {S.sync}: <span className="text-fog">{clock}</span>
          </p>
        </div>

        {/* rows */}
        <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {rows.map((r) => (
            <div key={r.label} className="group px-5 py-5 transition-colors hover:bg-panel/60 sm:px-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-moss">{r.label}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-display text-3xl font-bold text-fog">{r.value}</p>
                <span
                  className={`flex shrink-0 items-center gap-1.5 border px-2 py-1 font-mono text-[10px] font-bold tracking-wider ${
                    r.ok ? "border-term-dim/60 text-term" : "border-brew/60 text-brew"
                  }`}
                >
                  <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${r.ok ? "bg-term" : "bg-brew"}`} />
                  {r.status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-1 flex-1 overflow-hidden bg-line">
                  <span
                    className={`block h-full transition-all duration-700 ${r.ok ? "bg-term" : "bg-brew"}`}
                    style={{ width: `${r.load}%` }}
                  />
                </span>
                <span className="font-mono text-[10px] text-moss">{r.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* live log */}
        <div className="flex items-center justify-between gap-4 border-t border-line bg-[#0b1210] px-5 py-2.5 font-mono text-[11px] sm:px-7">
          <p className="truncate text-mist">
            <span className="text-term">$</span> tail -f /var/log/argamenon
            <span className="text-moss"> → </span>
            <span key={logIdx} className="merge-pop inline-block text-moss">
              {S.logs[logIdx]}
            </span>
          </p>
          <span className="caret hidden shrink-0 text-term sm:inline">▌</span>
        </div>
      </div>
    </Reveal>
  );
}

const ASCII_CUP = `         )  )   (  (
        (  (     )  )
      ┌───────────────┐
      │               │▌
      │   A R G A     │▌
      │   M E N O N   │▌
      │               │
      └───────────────┘
         └───────────┘
      ~ najbolja kafa ~`;

function CounterBlock({
  value,
  suffix,
  label,
  note,
  start,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  note: string;
  start: boolean;
  delay: number;
}) {
  const n = useCountUp(value, start);
  return (
    <Reveal delay={delay} className="h-full">
      <div className="group h-full border border-line bg-panel p-6 transition-all duration-400 hover:-translate-y-1 hover:border-term-dim hover:shadow-[0_18px_50px_-20px_rgba(69,224,160,0.35)]">
        <p className="font-display text-4xl font-bold text-term sm:text-5xl">
          {n}
          <span className="text-brew">{suffix}</span>
        </p>
        <p className="mt-3 font-mono text-[13px] text-fog">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-moss">{note}</p>
        <span className="mt-4 block h-px w-8 bg-line-2 transition-all duration-500 group-hover:w-full group-hover:bg-term-dim" />
      </div>
    </Reveal>
  );
}

export function Specs() {
  const { t } = useLang();
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  const keys = t.specs.keys;
  const vals = t.specs.vals;
  const rows: Array<[string, string]> = [
    [keys.uptime, vals.uptime],
    [keys.uticnice, vals.uticnice],
    [keys.stolovi, vals.stolovi],
    [keys.sedista, vals.sedista],
    [keys.net, vals.net],
    [keys.wifi, vals.wifi],
    [keys.ping, vals.ping],
    [keys.sobe, vals.sobe],
    [keys.monitori, vals.monitori],
    [keys.masina, vals.masina],
    [keys.zrna, vals.zrna],
    [keys.buka, vals.buka],
  ];

  return (
    <section id="specs" className="relative scroll-mt-20 py-24">
      <div className="glow-amber pointer-events-none absolute left-[-12%] top-1/3 h-[480px] w-[480px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead kicker={t.specs.kicker} title={t.specs.title} sub={t.specs.sub} />

        <SystemsCheck />

        {/* neofetch — full width so nothing wraps */}
        <Reveal className="mt-14">
          <div className="border border-line bg-ink-2/80 p-7 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss">
                guest@argamenon <span className="text-line-2">·</span> neofetch
              </p>
              <p className="font-mono text-[11px] text-moss">
                kernel <span className="text-term">6.6-lts-argamenon</span>
              </p>
            </div>

            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[auto_1fr]">
              {/* cup + palette */}
              <div className="flex flex-col items-center gap-6 border-line lg:border-r lg:pr-10">
                <pre className="font-mono text-[11px] leading-[1.4] text-term sm:text-xs" aria-hidden="true">
                  {ASCII_CUP}
                </pre>
                <div className="flex gap-2" aria-hidden="true">
                  {["#45e0a0", "#2a8f66", "#e8a33d", "#b57722", "#5cc8de", "#e6efe9"].map((c) => (
                    <span key={c} className="h-3.5 w-6 border border-black/30" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* specs in two columns */}
              <dl className="grid gap-x-12 gap-y-1 font-mono text-[13px] sm:grid-cols-2">
                {rows.map(([k, v], i) => (
                  <div
                    key={k}
                    className="group flex items-baseline gap-3 border-b border-line/60 py-2.5 transition-colors hover:border-term-dim"
                    style={{ transitionDelay: `${i * 30}ms` }}
                  >
                    <dt className="w-[140px] shrink-0 text-term sm:w-[150px]">{k}</dt>
                    <dd className="text-mist transition-colors group-hover:text-fog">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        {/* counters */}
        <div ref={ref} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.specs.counters.map((c, i) => (
            <CounterBlock key={c.label} {...c} start={inView} delay={i * 110} />
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-6 font-mono text-xs text-moss">
            <span className="text-brew">*</span> {t.specs.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   INTERACTIVE TERMINAL
============================================================ */
type Line = { type: "in" | "out"; text: string };

export function TerminalSection({ onReboot }: { onReboot?: () => void }) {
  const { t, lang } = useLang();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const booted = useRef(false);

  // welcome message on lang change
  useEffect(() => {
    setLines(t.terminal.welcome.map((text) => ({ type: "out" as const, text })));
    booted.current = true;
  }, [t]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    const out: string[] = [];
    const c = t.terminal.commands;
    let isBoot = false;

    if (!cmd) return;
    if (["clear", "cls", "ocisti", "očisti"].includes(cmd)) {
      setLines([]);
      return;
    }
    if (["help", "pomoc", "pomoć", "?"].includes(cmd)) out.push(...c.help);
    else if (["kafa", "cafe", "coffee", "menu", "meni"].includes(cmd)) out.push(...c.kafa);
    else if (["wifi", "net", "internet"].includes(cmd)) out.push(...c.wifi);
    else if (["stolovi", "tables", "seats", "sedista", "sedišta"].includes(cmd)) out.push(...c.stolovi);
    else if (["radno", "hours", "sati", "radno-vreme"].includes(cmd)) out.push(...c.radno);
    else if (["lokacija", "location", "gde", "adresa", "address"].includes(cmd)) out.push(...c.lokacija);
    else if (cmd === "ping") out.push(...c.ping);
    else if (cmd === "whoami") out.push(...c.whoami);
    else if (cmd.startsWith("sudo")) out.push(...c.sudo);
    else if (["boot", "reboot", "restart", "restartuj", "ponovo"].includes(cmd)) {
      out.push(...c.boot);
      isBoot = true;
    } else out.push(`${t.terminal.notFound} ${cmd}`, t.terminal.hintAfter);

    setLines((prev) => [...prev, { type: "in", text: raw }, ...out.map((text) => ({ type: "out" as const, text }))]);

    if (isBoot && onReboot) window.setTimeout(onReboot, 1100);
  };

  const submit = () => {
    run(input);
    setInput("");
  };

  return (
    <section id="terminal" className="relative scroll-mt-20 border-y border-line bg-ink-2/60 py-24">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="glow-green pointer-events-none absolute right-[-10%] top-0 h-[460px] w-[460px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHead kicker={t.terminal.kicker} title={t.terminal.title} sub={t.terminal.sub} />
            <Reveal delay={260}>
              <p className="mt-6 font-mono text-xs text-moss">
                <span className="text-term">hint:</span> {t.terminal.hint}
              </p>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["help", "kafa", "wifi", "stolovi", "ping", "sudo", "boot", "clear"].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      run(chip);
                      inputRef.current?.focus();
                    }}
                    className="border border-line-2 bg-panel px-3.5 py-2 font-mono text-xs text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-term hover:text-term"
                  >
                    $ {chip}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div
              className="overflow-hidden border border-line-2 bg-[#0b1210] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)]"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e0564a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-brew" />
                  <span className="h-2.5 w-2.5 rounded-full bg-term" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-moss">
                  {t.hero.termTitle} — {lang === "sr" ? "interaktivni" : "interactive"} shell
                </span>
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-term" />
              </div>

              <div
                ref={bodyRef}
                aria-label={t.terminal.ariaLabel}
                className="scanlines h-72 overflow-y-auto px-5 py-4 font-mono text-[13px] leading-[1.7] sm:text-sm"
              >
                {lines.map((l, i) =>
                  l.type === "in" ? (
                    <p key={i} className="text-fog">
                      <span className="text-term">{t.terminal.prompt}</span> {l.text}
                    </p>
                  ) : (
                    <p key={i} className={l.text.includes("✓") || l.text.includes("★") ? "text-term" : "text-mist"}>
                      {l.text}
                    </p>
                  )
                )}
                <div className="flex items-center gap-2 text-fog">
                  <span className="shrink-0 text-term">{t.terminal.prompt}</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder={t.terminal.inputPlaceholder}
                    aria-label={t.terminal.ariaLabel}
                    spellCheck={false}
                    autoComplete="off"
                    className="w-full bg-transparent text-fog caret-term outline-none placeholder:text-moss/50"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SPACE — gallery with ken burns
============================================================ */
export function Space() {
  const { t } = useLang();
  const items: Array<{ span: string; inner: string }> = [
    { span: "lg:col-span-7", inner: "aspect-[16/10] lg:aspect-[16/10]" },
    { span: "lg:col-span-5", inner: "aspect-[16/10] lg:aspect-auto lg:h-full" },
    { span: "lg:col-span-5", inner: "aspect-[16/10] lg:aspect-auto lg:h-full" },
    { span: "lg:col-span-7", inner: "aspect-[16/10]" },
    { span: "col-span-12", inner: "aspect-[16/10] lg:aspect-[21/9]" },
  ];

  return (
    <section id="space" className="relative scroll-mt-20 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead kicker={t.space.kicker} title={t.space.title} sub={t.space.sub} />

        <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:items-stretch">
          {t.space.images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={i * 90}
              as="figure"
              className={`group relative overflow-hidden border border-line bg-panel ${items[i]?.span ?? "col-span-12"}`}
            >
              <div className={`relative w-full overflow-hidden ${items[i]?.inner ?? "aspect-[16/10]"}`}>
                <img
                  src={img.src}
                  alt={`Argamenon — ${img.tag}`}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={750}
                  className="kenburns absolute inset-0 h-full w-full object-cover opacity-85 saturate-[0.9] transition-opacity duration-700 group-hover:opacity-100 group-hover:saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-term">
                      {t.space.index}.{String(i + 1).padStart(2, "0")} — {img.tag}
                    </p>
                    <p className="mt-1 text-sm text-mist opacity-0 transition-all duration-500 group-hover:opacity-100">
                      {img.note}
                    </p>
                  </div>
                  <span className="mb-1 hidden font-mono text-xs text-line-2 transition-colors group-hover:text-brew sm:block">
                    [+]
                  </span>
                </figcaption>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MENU — package.json style
============================================================ */
export function Menu() {
  const { t } = useLang();

  return (
    <section id="menu" className="relative scroll-mt-20 border-y border-line bg-ink-2/60 py-24">
      <div className="glow-green pointer-events-none absolute left-[-10%] bottom-0 h-[420px] w-[420px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          {/* sticky intro */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead kicker={t.menu.kicker} title={t.menu.title} sub={t.menu.sub} />
            <Reveal delay={300}>
              <div className="mt-8 hidden border border-line bg-panel p-5 font-mono text-xs leading-relaxed text-moss lg:block">
                <p className="text-term">// napomena sa šanka:</p>
                <p className="mt-2">
                  {t.lang === "sr"
                    ? "sve kafe idu sa lokalno prženim zrnom. ako nađeš bug u ukusu — report-uj, fix ide isti dan."
                    : "all coffees use locally roasted beans. if you find a bug in the taste — report it, fix ships same day."}
                </p>
              </div>
            </Reveal>

            {/* CLI view of the coffee menu */}
            <Reveal delay={400}>
              <div className="mt-6 overflow-hidden border border-line-2 bg-[#0b1210]">
                <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#e0564a]" />
                    <span className="h-2 w-2 rounded-full bg-brew" />
                    <span className="h-2 w-2 rounded-full bg-term" />
                  </div>
                  <span className="font-mono text-[10px] tracking-wider text-moss">guest@argamenon — coffee.log</span>
                </div>
                <div className="scanlines px-5 py-4 font-mono text-xs leading-relaxed sm:text-[13px]">
                  <p className="text-fog">
                    <span className="text-term">guest@argamenon:~$</span> cat /menu/coffee
                  </p>
                  <p className="mt-1.5 text-moss"># {t.menu.cli.out}</p>
                  <div className="mt-2.5 space-y-1.5">
                    {t.menu.groups[0].items.map((item, i) => (
                      <Reveal key={item.name} delay={450 + i * 70}>
                        <div className="menu-row flex items-baseline">
                          <span className="truncate text-mist">{item.name}</span>
                          <span className="leader" />
                          <span className="shrink-0 font-bold text-term">
                            {item.price}
                            <span className="ml-1 font-normal text-moss">{t.menu.rsd}</span>
                          </span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <p className="mt-3 text-fog">
                    <span className="text-term">guest@argamenon:~$</span>
                    <span className="caret text-term">▌</span>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* groups */}
          <div className="space-y-12">
            {t.menu.groups.map((g, gi) => (
              <Reveal key={g.name} delay={gi * 80}>
                <div>
                  <div className="flex items-baseline justify-between gap-4 border-b-2 border-line-2 pb-3">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-fog">
                      <span className="mr-3 font-mono text-base text-term">"{g.name}"</span>
                    </h3>
                    <p className="hidden text-right font-mono text-[11px] text-moss sm:block">{g.note}</p>
                  </div>
                  <ul className="mt-2">
                    {g.items.map((item) => (
                      <li
                        key={item.name}
                        className="menu-row group flex items-baseline border-b border-line/70 py-4 transition-all duration-300 hover:bg-panel/60 hover:pl-3"
                      >
                        <div className="min-w-0">
                          <p className="flex flex-wrap items-center gap-2.5 font-mono text-[15px] font-medium text-fog">
                            {item.name}
                            {item.badge && (
                              <span
                                className={`border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                                  item.badge.toLowerCase().includes("bestseller") || item.badge.toLowerCase().includes("hit")
                                    ? "border-brew/60 text-brew"
                                    : "border-term-dim/60 text-term"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </p>
                          <p className="mt-1 text-[13px] text-moss">{item.desc}</p>
                        </div>
                        <span className="leader" />
                        <p className="shrink-0 font-mono text-[15px] font-bold text-term">
                          {item.price}
                          <span className="ml-1 text-[11px] font-normal text-moss">{t.menu.rsd}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EVENTS
============================================================ */
export function Events() {
  const { t } = useLang();

  return (
    <section id="events" className="relative scroll-mt-20 py-24">
      <div className="glow-amber pointer-events-none absolute right-[-10%] top-10 h-[440px] w-[440px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead kicker={t.events.kicker} title={t.events.title} sub={t.events.sub} />

        <ul className="mt-14 border-t border-line">
          {t.events.list.map((ev, i) => (
            <Reveal key={ev.name} as="li" delay={i * 80}>
              <a
                href="#info"
                className="group grid grid-cols-[64px_1fr] items-center gap-x-5 gap-y-2 border-b border-line py-6 transition-all duration-400 hover:bg-panel/70 hover:pl-4 sm:grid-cols-[90px_1fr_auto] sm:gap-x-8"
              >
                <span className="grid h-14 w-14 place-items-center border border-line-2 bg-ink-2 font-mono text-sm font-bold text-term transition-colors duration-400 group-hover:border-term group-hover:bg-term group-hover:text-ink sm:h-16 sm:w-16 sm:text-base">
                  {t.events.days[ev.day]}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-xl font-bold text-fog transition-colors group-hover:text-term sm:text-2xl">
                      {ev.name}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="text-line-2 transition-all duration-400 group-hover:translate-x-1 group-hover:text-term"
                    >
                      <path d="M3 9h11M10 4.5L14.5 9 10 13.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-mist">{ev.desc}</span>
                </span>
                <span className="col-start-2 font-mono text-sm text-brew sm:col-start-auto">{ev.time}</span>
              </a>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200}>
          <a
            href="#info"
            className="mt-10 inline-flex items-center gap-3 border border-line-2 px-6 py-3.5 font-mono text-sm text-mist transition-all duration-300 hover:border-brew hover:text-brew"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1.5" y="2.5" width="11" height="10" rx="1" />
              <path d="M1.5 5.5h11M4.5 1v3M9.5 1v3" strokeLinecap="round" />
            </svg>
            {t.events.cta}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   LOYALTY — achievements / rewards (git-style)
============================================================ */
type Commit = { hash: string; msg: string };

function StickerArt() {
  return (
    <div className="relative h-28 w-full">
      <span className="absolute left-4 top-3 -rotate-6 border-2 border-term bg-panel px-3 py-2 font-mono text-[11px] font-bold text-term shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]">
        sudo make kafa
      </span>
      <span className="absolute right-3 top-9 rotate-3 border-2 border-brew bg-panel px-3 py-2 font-mono text-[11px] font-bold text-brew shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]">
        works on my machine™
      </span>
    </div>
  );
}

function CoasterArt() {
  return (
    <svg viewBox="0 0 120 120" className="mx-auto h-28 w-28 transition-transform duration-700 group-hover:rotate-45" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#101915" stroke="#2a3a31" strokeWidth="2" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="#1e2b24" strokeWidth="1.5" />
      <g stroke="#2a8f66" strokeWidth="1.6" fill="none">
        <path d="M60 16v22M60 82v22M16 60h22M82 60h22" />
        <path d="M30 30l14 14M90 30L76 44M30 90l14-14M90 90L76 76" />
      </g>
      <g fill="#45e0a0">
        <circle cx="60" cy="16" r="3" />
        <circle cx="60" cy="104" r="3" />
        <circle cx="16" cy="60" r="3" />
        <circle cx="104" cy="60" r="3" />
      </g>
      <g fill="#e8a33d">
        <circle cx="30" cy="30" r="2.5" />
        <circle cx="90" cy="30" r="2.5" />
        <circle cx="30" cy="90" r="2.5" />
        <circle cx="90" cy="90" r="2.5" />
      </g>
      <rect x="48" y="48" width="24" height="24" rx="3" fill="none" stroke="#e8a33d" strokeWidth="2" />
      <path d="M54 57l4 3.5-4 3.5M60 64h6" stroke="#45e0a0" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KeycapArt() {
  return (
    <div className="flex h-28 items-center justify-center">
      <div className="keycap-top" style={{ width: 80, height: 80 }}>
        <span className="font-mono text-xs font-bold text-term">ESC</span>
      </div>
    </div>
  );
}

export function Loyalty() {
  const { t } = useLang();
  const L = t.loyalty;
  const [commits, setCommits] = useState<Commit[]>([]);
  const [pressed, setPressed] = useState(false);
  const [clicks, setClicks] = useState(0);
  const msgIdx = useRef(0);
  const pressTimer = useRef(0);

  const addCommit = () => {
    setCommits((prev) => {
      const msg = L.commitMsgs[msgIdx.current % L.commitMsgs.length];
      msgIdx.current += 1;
      return [...prev, { hash: Math.random().toString(16).slice(2, 9), msg }];
    });
    setClicks((c) => c + 1);
    setPressed(true);
    window.clearTimeout(pressTimer.current);
    pressTimer.current = window.setTimeout(() => setPressed(false), 110);
  };

  const reset = () => {
    setCommits([]);
    msgIdx.current = 0;
  };

  const n = commits.length;
  const merged = n >= 5;
  const legendary = n >= 10;
  const status = legendary ? "legendary" : merged ? "merged" : "open";

  return (
    <section id="loyalty" className="relative scroll-mt-20 py-24">
      <div className="glow-amber pointer-events-none absolute left-[-10%] top-1/4 h-[460px] w-[460px]" />
      <div className="glow-green pointer-events-none absolute right-[-8%] bottom-0 h-[420px] w-[420px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead kicker={L.kicker} title={L.title} sub={L.sub} />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ===== pull request card ===== */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col overflow-hidden border border-line-2 bg-[#0b1210] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.85)]">
              {/* window bar */}
              <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e0564a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-brew" />
                  <span className="h-2.5 w-2.5 rounded-full bg-term" />
                </div>
                <span className="font-mono text-[11px] tracking-wider text-moss">{L.pr.repo} · PR #42</span>
                <LogoMark className="h-4 w-4" />
              </div>

              {/* branch line */}
              <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3 font-mono text-xs">
                <span className="border border-line-2 bg-ink px-2 py-0.5 text-mist">{L.pr.base}</span>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-moss">
                  <path d="M13 5H2M5 1.5L1.5 5 5 8.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="border border-term-dim/50 bg-term/10 px-2 py-0.5 text-term">{L.pr.branch}</span>
                <span
                  key={status}
                  className={`merge-pop ml-auto flex items-center gap-1.5 border px-2 py-0.5 font-bold uppercase tracking-wider ${
                    legendary
                      ? "border-brew/60 bg-brew/10 text-brew"
                      : merged
                        ? "border-term-dim/60 bg-term/10 text-term"
                        : "border-line-2 text-moss"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${legendary ? "bg-brew" : merged ? "pulse-dot bg-term" : "bg-brew"}`} />
                  {legendary ? L.pr.legendary.split(" ")[0] : merged ? L.pr.merged.split(" ")[0] : L.pr.open.split(" ")[0]}
                </span>
              </div>

              {/* git log */}
              <div className="scanlines flex-1 px-5 py-4 font-mono text-[13px] leading-relaxed">
                <p className="text-moss">
                  <span className="text-term">$</span> {L.pr.log}
                </p>
                {n === 0 ? (
                  <p className="mt-2 text-moss/70"># {L.pr.empty}</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {[...commits].reverse().slice(0, 6).map((c) => (
                      <li key={c.hash} className="flex items-baseline gap-2.5 text-mist">
                        <span className="shrink-0 text-brew">{c.hash}</span>
                        <span className="truncate">{c.msg}</span>
                      </li>
                    ))}
                    {n > 6 && <li className="text-moss/60">+ {n - 6} starijih commita…</li>}
                  </ul>
                )}
              </div>

              {/* pips + actions */}
              <div className="border-t border-line bg-panel/60 px-5 py-4">
                <div className="flex items-center gap-1.5" aria-label={`${n}/10`}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-3 flex-1 border transition-colors duration-300 ${
                        i < n
                          ? i < 5
                            ? "pip-fill border-term bg-term shadow-[0_0_10px_rgba(69,224,160,0.5)]"
                            : "pip-fill border-brew bg-brew shadow-[0_0_10px_rgba(232,163,61,0.5)]"
                          : "border-line-2 bg-ink"
                      }`}
                    />
                  ))}
                  <span className="ml-2 shrink-0 font-mono text-xs text-moss">{Math.min(n, 10)}/10</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={addCommit}
                    className="border border-term bg-term/10 px-4 py-2.5 font-mono text-xs font-bold text-term transition-all duration-200 hover:bg-term hover:text-ink hover:shadow-[0_0_24px_-6px_rgba(69,224,160,0.6)] active:scale-95"
                  >
                    {L.pr.add}
                  </button>
                  <button
                    onClick={reset}
                    className="border border-line-2 px-4 py-2.5 font-mono text-xs text-mist transition-colors hover:border-[#e0564a] hover:text-[#e0564a]"
                  >
                    {L.pr.reset}
                  </button>
                  <p className={`ml-auto font-mono text-xs ${merged ? "text-term" : "text-moss"}`}>
                    {legendary ? L.pr.legendary : merged ? L.pr.merged : `${5 - n} → merge`}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ===== keycap toy + tiers ===== */}
          <div className="flex flex-col gap-6">
            <Reveal delay={120}>
              <div className="flex items-center gap-6 border border-line bg-panel p-6">
                <button
                  className={`keycap shrink-0 ${pressed ? "pressed" : ""}`}
                  onClick={addCommit}
                  aria-label={L.pr.add}
                >
                  <span className="keycap-top">
                    <LogoMark className="h-8 w-8" />
                  </span>
                </button>
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-moss">
                    <span className="text-brew">{clicks}</span> {L.merch.clicks}
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-mist">{L.pr.hint}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="flex-1">
              <ul className="flex h-full flex-col border border-line bg-ink-2/70">
                {L.tiers.map((tier, i) => {
                  const unlocked = i === 0 ? merged : i === 1 ? legendary : false;
                  const secret = i === 2;
                  return (
                    <li
                      key={tier.at}
                      className={`group flex items-center gap-4 border-b border-line p-5 transition-colors last:border-0 hover:bg-panel/70 ${
                        unlocked ? "bg-term/[0.04]" : ""
                      }`}
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center border font-mono text-[11px] font-bold transition-all duration-300 ${
                          unlocked
                            ? "border-term bg-term/15 text-term shadow-[0_0_18px_-4px_rgba(69,224,160,0.6)]"
                            : secret
                              ? "border-brew/50 text-brew"
                              : "border-line-2 text-moss group-hover:border-term-dim group-hover:text-term"
                        }`}
                      >
                        {secret ? "?_?" : tier.tag.slice(0, 3).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-moss">
                          [{tier.at}]
                          {unlocked && <span className="merge-pop text-term">✓ unlocked</span>}
                        </p>
                        <p className={`mt-0.5 font-display text-lg font-bold ${unlocked ? "text-term" : "text-fog"}`}>
                          {tier.name}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug text-mist">{tier.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* ===== merch ===== */}
        <Reveal delay={150}>
          <p className="mt-16 font-mono text-[13px] uppercase tracking-[0.22em] text-term">
            <span className="text-brew mr-2">▚</span>
            {L.merch.title}
          </p>
        </Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {L.merch.items.map((m, i) => (
            <Reveal key={m.name} delay={i * 110}>
              <div className="group h-full border border-line bg-panel p-6 transition-all duration-400 hover:-translate-y-1 hover:border-term-dim hover:shadow-[0_18px_50px_-20px_rgba(69,224,160,0.3)]">
                {i === 0 && <StickerArt />}
                {i === 1 && <KeycapArt />}
                {i === 2 && <CoasterArt />}
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-bold text-fog">{m.name}</h3>
                  <span className="shrink-0 border border-line-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-moss">
                    {m.note}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-mist">{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 font-mono text-xs italic text-moss">
            <span className="text-term">#</span> {L.pr.back}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   INFO — location, hours, wifi, contact
============================================================ */
function isOpenNow(): boolean {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Belgrade",
      hour: "numeric",
      hour12: false,
      weekday: "short",
    }).formatToParts(new Date());
    const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
    const day = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
    const weekend = day === "Sat" || day === "Sun";
    const open = weekend ? 8 : 7;
    const close = weekend ? 22 : 24;
    return hour >= open && hour < close;
  } catch {
    return true;
  }
}

export function Info() {
  const { t } = useLang();
  const [open, setOpen] = useState(isOpenNow);
  useEffect(() => {
    const id = setInterval(() => setOpen(isOpenNow()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="info" className="relative scroll-mt-20 border-t border-line bg-ink-2/60 py-24">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="glow-green pointer-events-none absolute right-[10%] top-0 h-[380px] w-[380px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead kicker={t.info.kicker} title={t.info.title} />
          <Reveal delay={200}>
            <p
              className={`flex items-center gap-2.5 border px-4 py-2.5 font-mono text-xs ${
                open ? "border-term-dim/60 text-term" : "border-brew/50 text-brew"
              }`}
            >
              <span className={`pulse-dot h-2 w-2 rounded-full ${open ? "bg-term" : "bg-brew"}`} />
              {open ? t.info.openNow : t.info.closedNow}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr_0.9fr]">
          {/* address + cta */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col border border-line bg-panel p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss"># {t.info.addressLabel}</p>
              <p className="mt-3 font-display text-2xl font-bold leading-snug text-fog">{t.info.address}</p>
              <p className="mt-2 text-sm text-mist">{t.info.addressNote}</p>

              <div className="my-6 h-px w-full bg-line" />

              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss"># {t.info.contactLabel}</p>
              <a href={`mailto:${t.info.mail}`} className="nav-link mt-3 w-fit font-mono text-sm text-term hover:text-term">
                {t.info.mail}
              </a>
              <a href={`tel:${t.info.phone.replace(/\s/g, "")}`} className="nav-link mt-2 w-fit font-mono text-sm text-mist">
                {t.info.phone}
              </a>

              <div className="mt-auto pt-8">
                <a
                  href={`mailto:${t.info.mail}?subject=${encodeURIComponent(t.info.cta)}`}
                  className="block border border-term bg-term/10 px-6 py-4 text-center font-mono text-sm font-bold text-term transition-all duration-300 hover:bg-term hover:text-ink hover:shadow-[0_0_34px_-8px_rgba(69,224,160,0.55)]"
                >
                  [ {t.info.cta} ]
                </a>
                <p className="mt-2.5 text-center font-mono text-[11px] text-moss">{t.info.ctaNote}</p>
              </div>
            </div>
          </Reveal>

          {/* hours */}
          <Reveal delay={120} className="h-full">
            <div className="flex h-full flex-col border border-line bg-panel p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss"># {t.info.hoursLabel}</p>
              <ul className="mt-4 flex-1">
                {t.info.hours.map((h) => (
                  <li
                    key={h.d}
                    className="group flex items-baseline justify-between gap-4 border-b border-line/70 py-4 transition-colors hover:border-term-dim"
                  >
                    <span className="text-sm text-mist transition-colors group-hover:text-fog">{h.d}</span>
                    <span className="shrink-0 font-mono text-sm font-bold text-term">{h.h}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border border-line-2 bg-ink p-4 font-mono text-xs leading-relaxed text-moss">
                <p>
                  <span className="text-term">$</span> uptime --last-30-days
                </p>
                <p className="mt-1">
                  → <span className="text-fog">99.98%</span> ·{" "}
                  {t.lang === "sr" ? "pauza samo za espresso mašinu, i to retko" : "downtime only for the espresso machine, and rarely at that"}
                </p>
              </div>
            </div>
          </Reveal>

          {/* wifi card */}
          <Reveal delay={240} className="h-full md:col-span-2 lg:col-span-1">
            <div className="relative flex h-full flex-col overflow-hidden border border-line bg-panel p-7">
              <div className="steam absolute right-7 top-7 flex gap-1.5" aria-hidden="true">
                <i /> <i /> <i />
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss"># {t.info.wifiCard.label}</p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 border border-line-2 bg-ink px-4 py-3">
                  <span className="font-mono text-[11px] uppercase text-moss">ssid</span>
                  <span className="font-mono text-sm font-bold text-term">{t.info.wifiCard.ssid}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border border-line-2 bg-ink px-4 py-3">
                  <span className="font-mono text-[11px] uppercase text-moss">pass</span>
                  <span className="font-mono text-sm font-bold text-brew">{t.info.wifiCard.pass}</span>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-mist">{t.info.wifiCard.note}</p>

              <div className="mt-auto pt-6 font-mono text-xs text-moss">
                <p className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-term">
                    <path d="M1 5.5a9 9 0 0 1 12 0M3 8a5.5 5.5 0 0 1 8 0M5.2 10.3a2.5 2.5 0 0 1 3.6 0" strokeLinecap="round" />
                    <circle cx="7" cy="12.4" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                  WiFi 6E · 1 Gbit/s · ping 4 ms
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
