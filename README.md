<div align="center">

<table align="center">
<tr>
<td>

<pre>
         )  )   (  (
        (  (     )  )
      ┌───────────────┐
      │               │▌
      │   A R G A     │▌
      │   M E N O N   │▌
      │    >_         │
      └───────────────┘
</pre>

</td>
</tr>
</table>

# ☕ ARGAMENON — IT Café · Belgrade

**Where code gets written, deploys get celebrated, and coffee never falls out of production.**

An IT café with 128 power outlets, 1 Gbit/s symmetric fiber and the best coffee in town —
presented through a full terminal aesthetic: boot sequences, neofetch, a git-commit loyalty
program and an interactive shell.

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel&logoColor=fff)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=fff)](https://vite.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](#-license)

🌐 Fully bilingual — **Serbian / English** toggle in the header.

</div>

---

## 📖 About

**Argamenon** is a concept website for an IT café — imagined as a place where developers,
designers and remote workers gather, work and drink coffee. Instead of a classic café landing
page, the entire experience is built as a **terminal session**: from a BIOS-style preloader,
through `neofetch` venue specs, to an interactive shell and a git-commit loyalty program.

> *"Looks like a debug session, smells like coffee."*

---

## ✨ Features

### 🖥️ Boot Preloader
- BIOS-style **power-on self test** with typing POST lines (`espresso.mod @ 9 bar ... OK`)
- ASCII coffee cup that **fills up** as the percentage climbs
- `000% → 100%` counter with a **liquid-fill effect** and an amber waterline on the surface
- CRT power-on flash, glitch exit and a wipe transition into the site
- Click anywhere to skip; `$ boot` in the terminal replays the whole sequence

### 🏠 Hero
- Scramble/decode animation on the **ARGAMENON** title with periodic RGB glitch bursts
- A terminal window typing a live SSH boot sequence
- Live status tray: clock (Europe/Belgrade), ping, free seats, uptime

### 📊 System Specs
- **`[ SYSTEMS CHECK ]`** — live dashboard: server/internet, seats and kitchen status with
  `OPERATIONAL` / `BUSY` indicators, load bars and a `tail -f` log feed
- Full-width **`neofetch`** panel with the ASCII cup and color palette
- Animated counters: **128 outlets · 1000 Mb/s · 42 desks · 4 ms ping**

### ⌨️ Interactive Terminal
A real shell — type commands and Argamenon answers:

| Command | What it does |
|---|---|
| `help` | list all commands |
| `kafa` | short menu |
| `wifi` | SSID + password (`kafajedeploy`) |
| `stolovi` | workspace capacity |
| `ping` | network test |
| `sudo` | …this incident will be reported |
| `boot` | replays the preloader |
| `clear` | clears the screen |

### 🎁 Loyalty Program — `[ ACHIEVEMENTS / REWARDS ]`
- **Pull Request card**: every coffee is a *commit*; 5 commits = **MERGE** = reward
- A clickable **mechanical keycap** that adds commits (with a real press-down effect)
- Tier list: `5 commits` → laptop sticker · `10 commits` → keycap keychain · `sudo bug-hunter` → secret reward
- Merch showcase: stickers, keycap keychains and circuit-board coasters (custom SVG art)

### 🎨 Visual Identity & Motion
- Terminal palette: deep green `#0a0f0d` + terminal green `#45e0a0` + coffee amber `#e8a33d`
- Type: **Space Grotesk** (display) · **IBM Plex Sans** (body) · **JetBrains Mono** (code)
- Two JavaScript-driven marquee strips with **glitch slice-tear** effects
- Ken Burns gallery, scroll-reveal animations, scanlines + noise layers
- Full `prefers-reduced-motion` support

### 🔍 SEO & PWA
- Open Graph + Twitter cards with a custom OG image
- **JSON-LD `CafeOrCoffeeShop`** schema (address, opening hours, amenities)
- Geo tags, `robots.txt`, `sitemap.xml`, canonical link
- Web manifest — the site installs as an app
- Meta tags stay in sync with the active language (SR/EN)

---

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** (builds to a single-file `dist/index.html`)
- **Tailwind CSS 4** (utility-first, custom theme via `@theme`)
- No heavy dependencies — all motion is CSS + `requestAnimationFrame`

---

## 📸 Screenshot
![Website Screenshot](public/images/argamenon.png)

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg            # logo: coffee cup with a >_ prompt
│   ├── icons/icon-512.png     # PWA / apple-touch icon
│   ├── images/                # interior, latte, meetup, machine, OG banner
│   ├── site.webmanifest       # installable as an app
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── chrome.tsx         # header, ticker, marquee, footer, back-to-top, logo
│   │   ├── hero.tsx           # hero + boot terminal + live tray
│   │   ├── sections.tsx       # specs, systems check, terminal, gallery,
│   │   │                      # menu, events, loyalty, info
│   │   └── preloader.tsx      # BIOS boot sequence
│   ├── hooks.ts               # scroll, inView, scramble, countUp, clock, marquee
│   ├── i18n.tsx               # full SR/EN dictionary + LangProvider
│   ├── index.css              # theme, keyframes, glitch, reduced-motion
│   └── App.tsx
├── index.html                 # SEO meta, OG, JSON-LD, fonts
└── README.md
```

---

## 🚀 Running Locally

```bash
# 1. clone the repo
git clone https://github.com/anunnaki7/argamenon.git
cd argamenon

# 2. install dependencies
npm install

# 3. dev server
npm run dev          # → http://localhost:5173

# 4. production build
npm run build        # → dist/index.html (single file)
npm run preview      # local preview of the build
```

> No environment variables needed — the site is fully static.

---

## 🌍 Post-Deploy Checklist

Before sharing the link, replace the placeholder domain `argamenon.rs` with your real one in:

- [ ] `index.html` → `canonical`, `og:url`, `og:image`, JSON-LD `url` / `logo`
- [ ] `public/robots.txt` → `Sitemap:` URL
- [ ] `public/sitemap.xml` → `<loc>` and `<image:loc>` URLs

Then:

- [ ] **Google Search Console** → add the site → submit `sitemap.xml`
- [ ] Verify the share card on [opengraph.xyz](https://www.opengraph.xyz)
- [ ] Test `prefers-reduced-motion` behavior (System Settings → Accessibility)

---

## 🥚 Easter Eggs

The site hides a few treats for curious visitors — try them in the interactive terminal:

```
guest@argamenon:~$ sudo
guest@argamenon:~$ whoami
guest@argamenon:~$ ping
guest@argamenon:~$ boot
```

…and press the **keycap** in the *Rewards* section. ☕

---

## 🤝 Contributing

Pull requests are welcome — just like in the café: every coffee is a commit.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/new-joke`)
3. Commit your changes (`git commit -m 'feat: new joke'`)
4. Push and open a PR

---

## 📄 License

MIT — use it, modify it, deploy it freely.
If you ever open a real IT café based on this design, let us know — we're coming for coffee. ☕

---

<div align="center">

```
$ echo "brewed with too much coffee · exit 0"
```

**Argamenon** · 404 Technology Boulevard, Belgrade · `hello@argamenon.rs`

</div>
