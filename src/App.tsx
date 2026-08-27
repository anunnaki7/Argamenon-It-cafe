import { useState } from "react";
import { LangProvider } from "./i18n";
import { BackToTop, BigMarquee, Footer, Header, Ticker } from "./components/chrome";
import { Hero } from "./components/hero";
import { Events, Info, Loyalty, Menu, Space, Specs, TerminalSection } from "./components/sections";
import { Preloader } from "./components/preloader";

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const reboot = () => {
    window.scrollTo({ top: 0 });
    setRevealed(false);
    setShowPreloader(true);
  };

  return (
    <LangProvider>
      <div className="relative min-h-screen bg-ink text-fog antialiased">
        {/* film grain */}
        <div className="noise-layer" aria-hidden="true" />

        {showPreloader && <Preloader onReveal={() => setRevealed(true)} onDone={() => setShowPreloader(false)} />}

        <Header />

        <div
          className={`transition-all duration-700 ease-out ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <main>
            <Hero />
            <Ticker />
            <Space />
            <Specs />
            <TerminalSection onReboot={reboot} />
            <Menu />
            <BigMarquee />
            <Events />
            <Loyalty />
            <Info />
          </main>

          <Footer />
        </div>

        <BackToTop />
      </div>
    </LangProvider>
  );
}
