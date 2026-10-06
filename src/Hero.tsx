import { useEffect, useRef, type MouseEvent } from "react";
import { event } from "./data";
import seminfoLogo from "./assets/LogoSEMINFO.png";
import "./Hero.css";

const waveLines = Array.from({ length: 48 }, (_, i) => ({
  upper: `M-100 ${-90 + i * 7} C200 ${20 + i * 9} 300 ${260 + i * 8} 620 ${200 + i * 5} S980 ${5 + i * 7} 1220 ${80 + i * 5} S1510 ${350 + i * 3} 1780 ${100 + i * 7}`,
  lower: `M-100 ${150 + i * 7} C200 ${360 + i * 7} 350 ${610 + i * 5} 660 ${430 + i * 6} S1000 ${740 + i * 2} 1270 ${540 + i * 3} S1550 ${220 + i * 4} 1780 ${370 + i * 6}`,
  opacity: 0.18 + Math.sin((i / 47) * Math.PI) * 0.62,
}));

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Waves() {
  return (
    <svg className="hero-waves" viewBox="0 0 1672 750" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hero-wave-upper" x1="0" y1="250" x2="1672" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#263cb5" />
          <stop offset=".48" stopColor="#006cf5" />
          <stop offset=".66" stopColor="#5e26d8" />
          <stop offset=".82" stopColor="#f53bd3" />
          <stop offset="1" stopColor="#3930d4" />
        </linearGradient>
        <linearGradient id="hero-wave-lower" x1="0" y1="400" x2="1672" y2="550" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8536d1" />
          <stop offset=".38" stopColor="#163cbe" />
          <stop offset=".55" stopColor="#00bce5" />
          <stop offset=".73" stopColor="#4833f2" />
          <stop offset=".92" stopColor="#ee3acb" />
          <stop offset="1" stopColor="#6544dd" />
        </linearGradient>
      </defs>
      <g className="hero-wave-drift hero-wave-drift-upper" stroke="url(#hero-wave-upper)" strokeWidth="1.15">
        {waveLines.map((line, i) => <path key={i} d={line.upper} opacity={line.opacity} />)}
      </g>
      <g className="hero-wave-drift hero-wave-drift-lower" stroke="url(#hero-wave-lower)" strokeWidth="1.2">
        {waveLines.map((line, i) => <path key={i} d={line.lower} opacity={line.opacity} />)}
      </g>
    </svg>
  );
}

// Pointer and scroll input never enter React state or trigger layout on each frame.
function useHeroDepth() {
  const stage = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    const background = scene.current;
    const mark = brand.current;
    if (!root || !background || !mark) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
    let frame = 0;
    let inView = false;
    let bounds = root.getBoundingClientRect();
    let pageTop = bounds.top + window.scrollY;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let velocityX = 0;
    let velocityY = 0;
    let previousTime = 0;

    const update = (time: number) => {
      frame = 0;
      if (!inView || reduced.matches || document.hidden) return;
      const dt = Math.min((time - previousTime) / 1000 || 1 / 60, 1 / 30);
      previousTime = time;
      // A damped spring carries velocity when the cursor changes direction.
      velocityX += ((targetX - x) * 100 - velocityX * 20) * dt;
      velocityY += ((targetY - y) * 100 - velocityY * 20) * dt;
      x += velocityX * dt;
      y += velocityY * dt;
      const progress = Math.max(0, Math.min(1, (window.scrollY - pageTop) / bounds.height));
      const scrollDepth = progress * (desktop.matches ? 24 : 10);
      background.style.transform = `translate3d(${x * 8}px, ${y * 6 + scrollDepth}px, 0)`;
      background.style.opacity = String(1 - progress * 0.25);
      mark.style.transform = `translate3d(${x * -2}px, ${y * -1.5 - scrollDepth * 0.3}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(velocityX) + Math.abs(velocityY) > 0.002) {
        frame = requestAnimationFrame(update);
      }
    };
    const requestUpdate = () => {
      if (!frame && inView && !reduced.matches && !document.hidden) {
        previousTime = performance.now();
        frame = requestAnimationFrame(update);
      }
    };
    const measure = () => {
      bounds = root.getBoundingClientRect();
      pageTop = bounds.top + window.scrollY;
      requestUpdate();
    };
    const move = (e: PointerEvent) => {
      if (!desktop.matches || reduced.matches || e.pointerType !== "mouse") return;
      targetX = (e.clientX - bounds.left) / bounds.width - 0.5;
      targetY = (e.clientY + window.scrollY - pageTop) / bounds.height - 0.5;
      requestUpdate();
    };
    const leave = () => { targetX = 0; targetY = 0; requestUpdate(); };
    const preferencesChanged = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      targetX = targetY = x = y = velocityX = velocityY = 0;
      background.style.transform = "";
      background.style.opacity = "";
      mark.style.transform = "";
      measure();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      root.dataset.motionActive = String(inView && !document.hidden);
      if (inView) measure();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    const visibility = () => {
      root.dataset.motionActive = String(inView && !document.hidden);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestUpdate();
    };
    const resize = new ResizeObserver(measure);
    observer.observe(root);
    resize.observe(root);
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", requestUpdate, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preferencesChanged);
    desktop.addEventListener("change", preferencesChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", requestUpdate);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preferencesChanged);
      desktop.removeEventListener("change", preferencesChanged);
      background.style.transform = "";
      background.style.opacity = "";
      mark.style.transform = "";
    };
  }, []);

  return { stage, scene, brand };
}

export function Hero({ isAbout, isActivities, onPrimary }: {
  isAbout: boolean;
  isActivities: boolean;
  onPrimary: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const { stage, scene, brand } = useHeroDepth();
  const live = event.phase === "live" && !isAbout;
  const exploreRegistrations = isActivities && event.phase === "registration";
  return (
    <section className={`event-hero${live ? " event-hero-live" : ""}`} ref={stage} aria-labelledby="hero-heading">
      <div className="hero-scene" ref={scene} aria-hidden="true"><Waves /></div>
      <div className="hero-composition">
        <div className="hero-grid">
          <div className="hero-message">
            <p className="hero-eyebrow">26–29 outubro · Campus Muzambinho</p>
            <h1 id="hero-heading" className="hero-headline">
              {isAbout ? <><span className="hero-line">Uma semana.</span><span className="hero-line">Muitas <em>conexões.</em></span></>
                : isActivities ? <><span className="hero-line">Encontre a sua</span><span className="hero-line"><em>próxima</em></span><span className="hero-line">descoberta.</span></>
                  : live ? <><span className="hero-line">A SEMINFO</span><span className="hero-line"><em>acontece agora.</em></span></>
                    : event.phase === "finished" ? <><span className="hero-line">Encontros que</span><span className="hero-line"><em>ficam com você.</em></span></>
                    : <><span className="hero-line">Informática</span><span className="hero-line"><em>além da aula.</em></span></>}
            </h1>
            <p className="hero-description">
              {isAbout
                ? "A Semana da Informática do IFSULDEMINAS, Campus Muzambinho. Um espaço para aprender, trocar experiências e conhecer novas possibilidades."
                : "Quatro dias de palestras, oficinas e experiências para aprender, trocar ideias e conhecer novas possibilidades."}
            </p>
            <div className="hero-actions">
              <a className="button hero-primary" href={exploreRegistrations ? "#/atividades" : "#/programacao"} onClick={onPrimary}>
                {exploreRegistrations ? "Explorar inscrições" : isAbout ? "Consultar programação" : "Explorar programação"}<Arrow />
              </a>
              <a className="text-link hero-secondary" href={isAbout ? "#/atividades" : "#/sobre"}>
                <span>{isAbout ? "Conhecer atividades" : "Conheça a SEMINFO"}</span><Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-brand-depth" ref={brand}>
            <img className="hero-official-mark" src={seminfoLogo} alt="XXI SEMINFO" width="1673" height="940" fetchPriority="high" decoding="async" />
          </div>
        </div>
        <div className="hero-facts" aria-label="Informações do evento">
          <span>XXI edição</span><span>2026</span><span>Evento gratuito</span>
        </div>
      </div>
    </section>
  );
}
