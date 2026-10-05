import { useEffect, useRef } from "react";
import seminfoLogo from "./assets/LogoSEMINFO.png";
import officialArt from "./assets/Apresentação Oficial XXI SEMINFO 2026_compressed-1.png";
import { event } from "./data";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function Circuit({ className = "" }: { className?: string }) {
  return <svg className={`circuit ${className}`} viewBox="0 0 1400 900" fill="none" preserveAspectRatio="none" aria-hidden="true">
    <path className="circuit-wire" d="M-20 140H190Q240 140 240 190V340Q240 390 290 390H400Q450 390 450 440V540Q450 590 500 590H1010Q1060 590 1060 640V790Q1060 840 1110 840H1420" />
    <path className="circuit-secondary" d="M1160-20V140Q1160 190 1110 190H1010Q960 190 960 240V310" />
    <circle cx="400" cy="390" r="7" /><circle cx="960" cy="310" r="7" /><circle cx="1110" cy="840" r="7" />
  </svg>;
}

export function Opening({ onExplore, onProgramme }: { onExplore: () => void; onProgramme: () => void }) {
  const stage = useRef<HTMLElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current;
    const target = mark.current;
    const capable = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!element || !target) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (!capable.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const x = (e.clientX / bounds.width - .5) * 10;
        const y = ((e.clientY - bounds.top) / bounds.height - .5) * 8;
        target.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const reset = () => { cancelAnimationFrame(frame); target.style.transform = ""; };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    capable.addEventListener("change", reset);
    return () => { cancelAnimationFrame(frame); element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", reset); capable.removeEventListener("change", reset); };
  }, []);
  return <section className={`opening ${event.phase === "live" ? "opening-live" : ""}`} ref={stage} aria-labelledby="opening-title">
    <div className="art-window art-window-top" aria-hidden="true"><img src={officialArt} alt="" fetchPriority="high" width="5334" height="3000" /></div>
    <div className="art-window art-window-bottom" aria-hidden="true"><img src={officialArt} alt="" width="5334" height="3000" /></div>
    <Circuit />
    <div className="opening-meta"><span>XXI Semana da Informática</span><span>26—29 outubro 2026</span></div>
    <div className="opening-mark" ref={mark}><img src={seminfoLogo} alt="XXI SEMINFO" width="1673" height="940" fetchPriority="high" /></div>
    <h1 id="opening-title" className="opening-title"><span className="title-mask"><span>Informática.</span></span><span className="title-mask"><span>Encontros <em>reais.</em></span></span></h1>
    <div className="opening-bottom"><p>IFSULDEMINAS<br /><strong>Campus Muzambinho</strong><span className="free-entry">Evento gratuito</span></p>
      <a className="event-action" href={event.phase === "registration" ? "#/atividades" : "#/programacao"} onClick={(e) => { if (event.phase !== "registration") { e.preventDefault(); onProgramme(); } else onExplore(); }}><span>{event.phase === "registration" ? "Encontre sua atividade" : event.phase === "live" ? "Acompanhe o evento" : "Revisite a programação"}<small>{event.phase === "registration" ? "Explore as inscrições" : "Consulte dias e horários"}</small></span><Arrow diagonal /></a>
    </div>
    <button className="scroll-cue" onClick={onProgramme}>Descubra os quatro dias <span><Arrow /></span></button>
  </section>;
}

export function Connection({ about = false }: { about?: boolean }) {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealAll = () => elements.forEach((el) => el.classList.add("is-revealed"));
    if (media.matches || !("IntersectionObserver" in window)) { revealAll(); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-revealed"); observer.unobserve(entry.target); }
    }), { threshold: .25 });
    elements.forEach((el) => { el.classList.add("will-reveal"); observer.observe(el); });
    media.addEventListener("change", revealAll);
    return () => { observer.disconnect(); media.removeEventListener("change", revealAll); };
  }, []);
  return <section className={`connection ${about ? "connection-about" : ""}`} ref={section} aria-labelledby="connection-title">
    <Circuit className="connection-circuit" />
    <div className="connection-caption"><span>26—29.OUT.2026</span><span>Muzambinho, MG</span></div>
    <h2 id="connection-title"><span className="connection-line" data-reveal><span>Conhecimento</span></span><span className="connection-line" data-reveal><span>que se</span></span><span className="connection-line connection-final" data-reveal><span>encontra<em>.</em></span></span></h2>
    <div className="connection-copy"><p>A SEMINFO reúne atividades voltadas à informática, com palestras, oficinas e oportunidades de troca entre participantes.</p><p>Quatro dias para aprender, trocar experiências e conhecer novas possibilidades.</p><a className="text-link" href={about ? "#/atividades" : "#/sobre"}>{about ? "Explorar atividades" : "Conheça a SEMINFO"}<Arrow diagonal /></a></div>
    <span className="connection-tail" aria-hidden="true"><span>26</span><span>27</span><span>28</span><span>29</span></span>
  </section>;
}

export function RouteIntro({ about }: { about: boolean }) {
  return <section className="route-intro"><Circuit /><h1>{about ? <>Uma semana.<br /><em>Muitas conexões.</em></> : <>Encontre sua<br /><em>próxima descoberta.</em></>}</h1><p>{about ? "A Semana da Informática do IFSULDEMINAS, Campus Muzambinho. Um espaço para aprender, trocar experiências e conhecer novas possibilidades." : "Palestras, oficinas, minicursos e encontros. Explore todos os dias, busque um assunto e escolha suas atividades."}</p><a className="text-link" href={about ? "#/programacao" : "#/sobre"}>{about ? "Consultar programação" : "Conheça a SEMINFO"}<Arrow diagonal /></a></section>;
}
