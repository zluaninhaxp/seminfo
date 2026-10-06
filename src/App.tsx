import { useEffect, useMemo, useRef, useState } from "react";
import { activities, days, event, type Activity } from "./data";
import "./App.css";
import "./ActivityDetail.css";
import "./AboutPage.css";
import { Hero, Waves } from "./Hero";
import { Arrow } from "./Experience";
import seminfoLogo from "./assets/LogoSEMINFO.png";
import instituteLogo from "./assets/LogoIF.png";
import academicCenterLogo from "./assets/LogoCA2.png";
import caSeminfoPhoto from "./assets/Organizadores/CAseminfo.jpeg";

const labels = {
  open: "Inscrições abertas",
  closed: "Inscrições encerradas",
  full: "Vagas esgotadas",
  none: "Sem inscrição",
  soon: "Inscrições em breve",
};
const sponsors: { name: string; image: string; href?: string }[] = [];
function registrationDestination(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const reserved = /(^|\.)(example\.(com|org|net)|invalid|test|localhost)$/.test(url.hostname);
    const demoDestination = event.demo && url.hostname === "example.com";
    return ["https:", "http:"].includes(url.protocol) && (!reserved || demoDestination) ? value : undefined;
  } catch {
    return undefined;
  }
}
function isDemoRegistration(value?: string) {
  if (!event.demo || !value) return false;
  try {
    return new URL(value).hostname === "example.com";
  } catch {
    return false;
  }
}
function registrationLabel(activity: Activity) {
  if (activity.registrationStatus === "open" && !registrationDestination(activity.registrationUrl)) {
    return activity.registrationDeadline
      ? `Inscrições abertas até ${activity.registrationDeadline}`
      : "Inscrições em breve";
  }
  return labels[activity.registrationStatus];
}
function renderRequirement(requirement: Activity["requirements"][number]) {
  if (typeof requirement === "string") return requirement;
  const pattern = new RegExp(
    `(${requirement.emphasize.map((text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  );
  return requirement.text.split(pattern).map((part, index) =>
    requirement.emphasize.includes(part)
      ? <mark className="competition-highlight" key={`${part}-${index}`}>{part}</mark>
      : part,
  );
}
function AgendaIcon({ location = false }: { location?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {location ? <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></> : <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
  </svg>;
}
function DetailIcon({ kind }: { kind: "calendar" | "link" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    {kind === "calendar" ? <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 2v6M17 2v6M3 10h18" /></> : <><path d="m10 14 4-4M8 16l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0) scale(.9)" /></>}
  </svg>;
}
const dateLabel = (date: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(`${date}T12:00:00-03:00`));
function clock() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}
const readRoute = () => window.location.hash.slice(1) || "/programacao";
const cspPromoStorageKey = "seminfo-csp-promo-dismissed-v1";
function shouldShowCspPromo() {
  const today = clock().date;
  if (today < "2026-10-06" || today > "2026-10-23") return false;
  if (!activities.some((activity) => activity.id === "desafio-programacao")) return false;
  try {
    return window.sessionStorage.getItem(cspPromoStorageKey) !== "dismissed";
  } catch {
    return true;
  }
}
function rememberCspPromoDismissal() {
  try {
    window.sessionStorage.setItem(cspPromoStorageKey, "dismissed");
  } catch {
    // The modal still closes for the current visit if storage is unavailable.
  }
}
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function App() {
  const [route, setRoute] = useState(readRoute);
  const [day, setDay] = useState(
    event.phase === "live" && days.some((d) => d.date === clock().date)
      ? clock().date
      : days[0].date,
  );
  const [search, setSearch] = useState("");
  const [type, setType] = useState("Todas");
  const [openOnly, setOpenOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState(clock);
  const [shareMessage, setShareMessage] = useState("");
  const [cspPromoOpen, setCspPromoOpen] = useState(shouldShowCspPromo);
  const main = useRef<HTMLElement>(null);
  const cspPromoDialog = useRef<HTMLDivElement>(null);
  const revealedContent = useRef<WeakSet<Element>>(new WeakSet());
  const [origin, setOrigin] = useState("/programacao");
  const lastRoute = useRef(route);
  const originFocus = useRef<string | null>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const position = useRef(0);
  const returning = useRef(false);
  useEffect(() => {
    if (!cspPromoOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    const dialog = cspPromoDialog.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    focusable()[0]?.focus();
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        rememberCspPromoDismissal();
        setCspPromoOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [cspPromoOpen]);
  useEffect(() => {
    const handle = () => {
      setRoute(readRoute());
      setMenuOpen(false);
      setShareMessage("");
    };
    window.addEventListener("hashchange", handle);
    const timer = window.setInterval(() => setNow(clock()), 60000);
    return () => {
      window.removeEventListener("hashchange", handle);
      window.clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    const cameFromDetail =
      lastRoute.current.startsWith("/atividade/") &&
      !route.startsWith("/atividade/");
    lastRoute.current = route;
    document.title = `${route.startsWith("/atividade/") ? "Atividade" : route === "/sobre" ? "Sobre" : route === "/atividades" ? "Atividades" : "Programação"} | XXI SEMINFO`;
    if (returning.current || cameFromDetail) {
      window.scrollTo(0, position.current);
      if (originFocus.current)
        document
          .querySelector<HTMLAnchorElement>(
            `a[href="${CSS.escape(originFocus.current)}"]`,
          )
          ?.focus({ preventScroll: true });
      returning.current = false;
    } else {
      window.scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    }
  }, [route]);
  useEffect(() => {
    const content = main.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!content || reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(content.querySelectorAll<HTMLElement>(
      ".programme > .section-heading, .programme .agenda-sidebar, .programme .agenda-list, .about-intro, .information > section, .detail-layout > *, .missing",
    ));
    document.querySelectorAll<HTMLElement>(".site-footer > div, .site-footer > .text-link").forEach((element) => elements.push(element));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.dataset.scrollReveal = "visible";
        revealedContent.current.add(element);
        observer.unobserve(element);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });
    const revealAll = () => {
      observer.disconnect();
      elements.forEach((element) => {
        element.dataset.scrollReveal = "visible";
        revealedContent.current.add(element);
      });
    };

    elements.forEach((element, index) => {
      if (revealedContent.current.has(element)) {
        element.dataset.scrollReveal = "visible";
        return;
      }
      element.style.setProperty("--scroll-reveal-delay", `${Math.min(index, 3) * 55}ms`);
      element.dataset.scrollReveal = "pending";
      observer.observe(element);
    });
    reducedMotion.addEventListener("change", revealAll);

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", revealAll);
      elements.forEach((element) => {
        element.dataset.scrollReveal = "visible";
        element.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, [route]);
  const isActivities = route === "/atividades",
    isAbout = route === "/sobre",
    isDetail = route.startsWith("/atividade/");
  const detail = isDetail
    ? activities.find((a) => a.id === route.slice(11))
    : undefined;
  const valid =
    ["/programacao", "/atividades", "/sobre"].includes(route) || isDetail;
  const filtered = useMemo(
    () =>
      activities
        .filter(
          (a) =>
            (isActivities || a.date === day) &&
            (type === "Todas" || a.type === type) &&
            (!openOnly || (a.registrationStatus === "open" && !a.cancelled && (Boolean(registrationDestination(a.registrationUrl)) || Boolean(a.registrationDeadline)))) &&
            normalize(`${a.title} ${a.speaker} ${a.location}`).includes(
              normalize(search),
            ),
        )
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) || a.start.localeCompare(b.start),
        ),
    [day, type, openOnly, search, isActivities],
  );
  const isToday = event.phase === "live" && day === now.date && !isActivities;
  const ended = isToday ? filtered.filter((a) => a.end <= now.time) : [];
  const visible =
    isToday && !showEarlier && filtered.some((a) => a.end > now.time)
      ? filtered.filter((a) => a.end > now.time)
      : filtered;
  const showUndisclosedSchedule =
    !isActivities && filtered.length === 0 && !search.trim() && type === "Todas" && !openOnly;
  const groups = [
    ...new Set(visible.map((a) => (isActivities ? a.date : a.start))),
  ];
  const types = [...new Set(activities.map((a) => a.type))];
  const selectedDay = days.find((d) => d.date === day);
  const temporal = (a: Activity) =>
    event.phase === "live" && a.date === now.date && !a.cancelled
      ? a.start <= now.time && a.end > now.time
        ? "Em andamento · conforme a programação"
        : a.end <= now.time
          ? "Encerrada · conforme a programação"
          : ""
      : "";
  const openActivity = () => {
    setOrigin(route);
    position.current = window.scrollY;
    originFocus.current = document.activeElement?.getAttribute("href") ?? null;
  };
  const clear = () => {
    setSearch("");
    setType("Todas");
    setOpenOnly(false);
  };
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Link copiado.");
    } catch {
      setShareMessage("Copie o endereço desta página para compartilhar.");
    }
  }
  function actions(a: Activity) {
    if (a.cancelled)
      return <p className="action-note">Esta atividade foi cancelada.</p>;
    return (
      <div className="detail-actions">
        {a.mode === "Online" &&
          (a.onlineUrl ? (
            <a
              className="button"
              href={a.onlineUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.demo ? "Acessar transmissão demonstrativa" : "Acessar atividade online"}
            </a>
          ) : (
            <p className="action-note">Link de acesso online a divulgar.</p>
          ))}
        {a.registrationStatus === "open" &&
          (registrationDestination(a.registrationUrl) ? (
            <a
              className="button"
              href={a.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Inscreva-se <Arrow diagonal />
            </a>
          ) : (
            <p className="action-note">
              {a.registrationInstructions ?? (event.demo
                ? "Formulário indisponível nesta demonstração."
                : "Formulário de inscrição a divulgar.")}
            </p>
          ))}
        {a.registrationStatus !== "open" && (
          <p className="action-note">{labels[a.registrationStatus]}</p>
        )}
        {a.registrationStatus === "open" && isDemoRegistration(a.registrationUrl) && <p className="detail-demo-note">Formulário demonstrativo</p>}
      </div>
    );
  }
  return (
    <>
      <a
        className="skip-link"
        href="#conteudo"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#/programacao"
            aria-label="SEMINFO, programação"
          >
            <img
              className="header-logo"
              src={seminfoLogo}
              alt="SEMINFO"
              width="1673"
              height="940"
            />
          </a>
          <button
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "Fechar" : "Menu"}
          </button>
          <nav
            id="navigation"
            className={menuOpen ? "is-open" : ""}
            aria-label="Principal"
          >
            <a
              href="#/programacao"
              aria-current={route === "/programacao" ? "page" : undefined}
            >
              Programação
            </a>
            <a
              href="#/atividades"
              aria-current={isActivities ? "page" : undefined}
            >
              Atividades
            </a>
            <a href="#/sobre" aria-current={isAbout ? "page" : undefined}>
              Sobre a SEMINFO
            </a>
          </nav>
          <span className="header-date">26–29 OUT</span>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} ref={main}>
        {!isDetail && valid && (
          <Hero
            key={route}
            isAbout={isAbout}
            isActivities={isActivities}
            onPrimary={(e) => {
              clear();
              if (isActivities && event.phase === "registration") {
                e.preventDefault();
                setOpenOnly(true);
                document.getElementById("list-heading")?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                  block: "start",
                });
              } else if (route === "/programacao") {
                e.preventDefault();
                document.querySelector(".programme")?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                  block: "start",
                });
              }
            }}
          />
        )}
        {!valid || (isDetail && !detail) ? (
          <section className="content missing">
            <h1>
              {isDetail ? "Atividade não encontrada" : "Página não encontrada"}
            </h1>
            <p>Consulte a programação para continuar.</p>
            <a className="button" href="#/programacao">
              Voltar à programação
            </a>
          </section>
        ) : detail ? (
          <section className="content detail-page">
            <div className="detail-decoration" aria-hidden="true"><Waves sparse /></div>
            <a
              className="back-link"
              href={`#${origin}`}
              onClick={() => {
                returning.current = true;
              }}
            >
              <span aria-hidden="true">←</span> Voltar{" "}
              {origin === "/atividades" ? "às atividades" : "à programação"}
            </a>
            <div className="detail-layout">
              <div className="detail-intro">
                <div className="detail-type">
                  <span>{detail.type}</span><span>{detail.mode}</span>
                </div>
                <h1>{detail.title}</h1>
                {detail.cancelled && (
                  <p className="status important">Atividade cancelada</p>
                )}
                {detail.notice && (
                  <p className="change-notice">{detail.notice}</p>
                )}
              </div>
                <div className="detail-summary">
                  <div><DetailIcon kind="calendar" /><p>{dateLabel(detail.date)}<small>{new Intl.DateTimeFormat("pt-BR", { weekday: "long", timeZone: "America/Sao_Paulo" }).format(new Date(`${detail.date}T12:00:00-03:00`))}</small></p></div>
                  <div><AgendaIcon /><p>{detail.start}–{detail.end}<small>Horário de Brasília</small></p></div>
                  <div><AgendaIcon location /><p>{detail.location || "Local a divulgar"}<small>{detail.mode}</small></p></div>
                </div>
              <article className="detail-body">
                <h2>Sobre a atividade</h2>
                <p>{detail.description}</p>
                {detail.competitionSchedule?.length ? (
                  <section className="competition-schedule" aria-labelledby="competition-schedule-title">
                    <h2 id="competition-schedule-title">Cronograma da competição</h2>
                    <ol>
                      {detail.competitionSchedule.map((stage) => (
                        <li key={`${stage.date}-${stage.start ?? "sem-horario"}-${stage.title}`}>
                          <div className="competition-schedule-time">
                            {stage.start ? (
                              <time dateTime={`${stage.date}T${stage.start}:00`}>
                                {stage.start}{stage.end ? `–${stage.end}` : ""}
                              </time>
                            ) : <span>Horário a divulgar</span>}
                            <small>{dateLabel(stage.date)}</small>
                          </div>
                          <h3>{stage.title}</h3>
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}
                <h2>Quem conduz</h2>
                <div className="detail-speakers">
                  {detail.speaker ? detail.speaker.split(/\s+e\s+|\s*;\s*/).map((speaker, index) => {
                    const [name, ...notes] = speaker.split("·");
                    const words = name.trim().split(/\s+/);
                    const initials = [words[0]?.[0], words.length > 1 ? words[words.length - 1]?.[0] : ""].join("").toUpperCase();
                    const isAcademicCenter = name.trim() === "Centro Acadêmico Alan Turing";
                    return <div className="detail-speaker" key={`${speaker}-${index}`}><span className={`speaker-avatar ${isAcademicCenter ? "speaker-avatar-image" : ""}`} aria-hidden="true">{isAcademicCenter ? <img src={caSeminfoPhoto} alt="" /> : initials}</span><p><strong>{name.trim()}</strong>{notes.length > 0 && <small>{notes.join("·").trim()}</small>}</p></div>;
                  }) : <p>Responsável a divulgar.</p>}
                </div>
                <section className={detail.type === "Competição" ? "competition-rules" : "activity-requirements"} aria-labelledby="requirements-title">
                  <h2 id="requirements-title">Antes de participar</h2>
                  {detail.requirements.length ? (
                    <ul>
                      {detail.requirements.map((r) => (
                        <li key={typeof r === "string" ? r : r.text}>{renderRequirement(r)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Não há requisitos informados.</p>
                  )}
                </section>
              </article>
              <aside className="participation">
                <span className={`detail-registration-status ${detail.cancelled || detail.registrationStatus === "full" ? "detail-status-full" : detail.registrationStatus === "open" && (registrationDestination(detail.registrationUrl) || detail.registrationDeadline) ? "detail-status-open" : detail.registrationStatus === "soon" || detail.registrationStatus === "open" ? "detail-status-soon" : ""}`}>
                  <span aria-hidden="true" />{detail.cancelled ? "Cancelada" : registrationLabel(detail)}
                </span>
                <h2>Participe</h2>
                <p className="capacity">
                  {detail.capacity === null
                    ? "Vagas ilimitadas"
                    : detail.capacity === "limited"
                      ? "Vagas limitadas"
                    : typeof detail.capacity === "number"
                      ? `${detail.capacity} vagas`
                      : "Vagas a confirmar"}
                </p>
                {typeof detail.capacity === "number" && (
                  <p>Preenchimento por ordem de inscrição.</p>
                )}
                {actions(detail)}
                {detail.registrationStatus === "none" ? (
                  <p className="registration-help">Esta atividade não exige inscrição.</p>
                ) : !detail.registrationInstructions ? (
                  <p className="registration-help">A inscrição é feita por atividade, em formulário externo. Consulte as orientações de confirmação no formulário.</p>
                ) : null}
                <button className="text-button" onClick={share}>
                  <DetailIcon kind="link" />
                  Compartilhar atividade
                </button>
                <p role="status">{shareMessage}</p>
              </aside>
            </div>
          </section>
        ) : isAbout ? (
          <section className="content about-page about-sections">
            <section className="about-section about-event" aria-labelledby="about-event-title">
              <span className="about-section-mark" aria-hidden="true" />
              <h2 id="about-event-title">Sobre a SEMINFO</h2>
              <p>A Semana da Informática, conhecida como SEMINFO, é um evento tradicional da área de Computação do IFSULDEMINAS, Campus Muzambinho. Reúne estudantes, professores, egressos e profissionais para compartilhar experiências e acompanhar diferentes caminhos da tecnologia.</p>
              <p>Com palestras, oficinas, competições e outras atividades, a SEMINFO complementa a formação acadêmica e aproxima os participantes de novas tecnologias, experiências profissionais e do mercado.</p>
              <div className="about-history" aria-labelledby="about-history-title">
                <h3 id="about-history-title">Uma história construída no Campus Muzambinho</h3>
                <p>A SEMINFO faz parte da trajetória da Informática no Campus Muzambinho e chega, em 2026, à sua <strong className="about-edition-highlight">21ª edição</strong>.</p>
              </div>
            </section>
            <section className="about-section about-program" aria-labelledby="about-program-title">
              <span className="about-section-mark" aria-hidden="true" />
              <h2 id="about-program-title">O que acontece na SEMINFO</h2>
              <ul className="about-program-list">
                <li><div><h3>Palestras e conversas</h3><p>Tecnologia, carreira, pesquisa e mercado.</p></div></li>
                <li><div><h3>Oficinas</h3><p>Experiências práticas com ferramentas e novas áreas.</p></div></li>
                <li><div><h3>Competições e integração</h3><p>Desafios e atividades entre os participantes.</p></div></li>
                <li><div><h3>Conexões</h3><p>Contato com estudantes, professores, profissionais e egressos.</p></div></li>
              </ul>
            </section>
            <section className="about-section about-sponsors" aria-labelledby="about-sponsors-title">
              <div className="about-wave-decoration" aria-hidden="true"><Waves sparse /></div>
              <span className="about-section-mark" aria-hidden="true" />
              <h2 id="about-sponsors-title">Patrocinadores</h2>
              <p>Empresas e parceiros que apoiam a SEMINFO e ajudam a tornar esta experiência possível.</p>
              <div className="sponsor-logos" aria-label="Marcas patrocinadoras">
                {sponsors.map((sponsor) => {
                  const logo = <img src={sponsor.image} alt={sponsor.name} />;
                  return sponsor.href
                    ? <a key={sponsor.name} href={sponsor.href} target="_blank" rel="noopener noreferrer" aria-label={sponsor.name}>{logo}</a>
                    : <div key={sponsor.name}>{logo}</div>;
                })}
              </div>
            </section>
            <section className="about-section about-realization" aria-labelledby="about-realization-title">
              <span className="about-section-mark" aria-hidden="true" />
              <h2 id="about-realization-title">Realização e organização</h2>
              <p>A XXI SEMINFO é realizada pelo IFSULDEMINAS – Campus Muzambinho em conjunto com o Centro Acadêmico Alan Turing.</p>
              <div className="realization-logos">
                <img src={instituteLogo} alt="IFSULDEMINAS – Campus Muzambinho" width="2172" height="724" />
                <span aria-hidden="true" />
                <img src={academicCenterLogo} alt="Centro Acadêmico Alan Turing" width="1859" height="325" />
              </div>
            </section>
          </section>
        ) : (
          <section className="content programme" aria-labelledby="list-heading">
            <div className="section-heading">
              <h2 id="list-heading">
                {isActivities ? "Atividades" : "Sua semana, por dia."}
              </h2>
              {isActivities && (
                <p>Busque um assunto. Encontre seu encontro.</p>
              )}
            </div>
            <div className="agenda-layout">
              <aside className="agenda-sidebar">
                {!isActivities && (
                  <div
                    className="day-picker"
                    role="group"
                    aria-label="Dia da programação"
                  >
                    {days.map((d) => (
                      <button
                        key={d.date}
                        aria-pressed={day === d.date}
                        aria-label={`${d.label}, ${d.number} de outubro`}
                        onClick={() => {
                          setDay(d.date);
                          setShowEarlier(false);
                        }}
                      >
                        <span>{d.short}</span>
                        <strong>{d.number}</strong>
                        <small>OUT</small>
                      </button>
                    ))}
                  </div>
                )}
                <div className="filters">
                  <label>
                    Buscar atividade
                    <input
                      type="search"
                      placeholder="Título, responsável ou local"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                  <label>
                    Tipo de atividade
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option>Todas</option>
                      {types.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={openOnly}
                      onChange={(e) => setOpenOnly(e.target.checked)}
                    />
                    Somente inscrições abertas
                  </label>
                  {(search || type !== "Todas" || openOnly) && (
                    <button className="text-button" onClick={clear}>
                      Limpar filtros
                    </button>
                  )}
                </div>
                <div className="sidebar-note">
                  <strong>Um encontro por vez.</strong>
                  <p>
                    Algumas atividades acontecem ao mesmo tempo. Confira os
                    horários antes de se inscrever.
                  </p>
                </div>
              </aside>
              <div className="agenda-list programme-activity-list">
                <div className="list-summary">
                  <h3>
                    {isActivities
                      ? "Todos os dias"
                      : `${selectedDay?.label}, ${selectedDay?.number} de outubro`}
                  </h3>
                  <span role="status">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "atividade" : "atividades"}
                  </span>
                </div>
                {isToday && (
                  <div className="live-explanation">
                    <p>
                      {filtered.length > 0 && ended.length === filtered.length
                        ? "A programação de hoje terminou."
                        : visible.some(
                              (a) => a.start <= now.time && a.end > now.time,
                            )
                          ? "Em andamento e próximos horários"
                          : "Próximos horários"}{" "}
                    · conforme a programação.
                    </p>
                    {ended.length > 0 && ended.length < filtered.length && (
                      <button
                        className="text-button"
                        onClick={() => setShowEarlier(!showEarlier)}
                      >
                        {showEarlier
                          ? "Ocultar horários anteriores"
                          : `Ver ${ended.length} atividades anteriores`}
                      </button>
                    )}
                    {filtered.length > 0 &&
                      ended.length === filtered.length &&
                      days.find((d) => d.date > day) && (
                        <button
                          className="text-button"
                          onClick={() => {
                            setDay(days.find((d) => d.date > day)!.date);
                            setShowEarlier(false);
                          }}
                        >
                          Consultar o próximo dia
                        </button>
                      )}
                  </div>
                )}
                {filtered.length === 0 ? (
                  <div className={`empty ${showUndisclosedSchedule ? "empty-undisclosed" : ""}`}>
                    {showUndisclosedSchedule && <span className="empty-undisclosed-mark" aria-hidden="true" />}
                    <h3>{showUndisclosedSchedule ? "Programação ainda não divulgada" : "Nenhuma atividade encontrada."}</h3>
                    <p>
                      {showUndisclosedSchedule
                        ? "Em breve teremos novidades para este dia."
                        : search || type !== "Todas" || openOnly
                        ? "Experimente limpar os filtros ou buscar outro termo."
                        : "Ainda não há atividades publicadas para este dia."}
                    </p>
                    {(search || type !== "Todas" || openOnly) && (
                      <button className="button" onClick={clear}>
                        Limpar filtros
                      </button>
                    )}
                  </div>
                ) : (
                  groups.map((group) => (
                    <div className="time-group" key={group}>
                      <div className="group-label">
                        {isActivities ? dateLabel(group) : group}
                      </div>
                      <div className="group-activities">
                        {visible
                          .filter(
                            (a) => (isActivities ? a.date : a.start) === group,
                          )
                          .map((a) => (
                            <article
                              key={a.id}
                              className={`activity-row ${a.cancelled ? "cancelled" : ""}`}
                            >
                              <>
                                <div className="activity-heading"><span className={`activity-type ${a.type === "Oficina" ? "category-cyan" : ""}`}>{a.type}</span></div>
                                <h3><a href={`#/atividade/${a.id}`} onClick={openActivity}>{a.title}</a></h3>
                                {a.subtitle && <p className="activity-subtitle">{a.subtitle}</p>}
                                <div className="activity-meta">
                                  <span><AgendaIcon />{a.start}–{a.end}</span>
                                  <span><AgendaIcon location />{a.location}</span>
                                </div>
                                <p className="activity-speaker">{a.speaker}</p>
                                {a.notice && <p className="row-notice">{a.notice}</p>}
                                {temporal(a) && <p className="temporal">{temporal(a)}</p>}
                                <div className="activity-bottom">
                                  <span className={`agenda-status ${a.cancelled ? "agenda-status-cancelled" : a.registrationStatus === "full" ? "agenda-status-full" : a.registrationStatus === "open" && (registrationDestination(a.registrationUrl) || a.registrationDeadline) ? "agenda-status-open" : a.registrationStatus === "open" || a.registrationStatus === "soon" ? "agenda-status-soon" : ""}`}>
                                    <span className="agenda-status-dot" aria-hidden="true" />
                                    {a.cancelled ? "Cancelada" : registrationLabel(a)}
                                  </span>
                                  <div className="agenda-actions">
                                    <a className="agenda-button agenda-details" href={`#/atividade/${a.id}`} onClick={openActivity} aria-label={`Ver detalhes de ${a.title}`}>Ver detalhes<Arrow diagonal /></a>
                                    {!a.cancelled && a.registrationStatus === "open" && (registrationDestination(a.registrationUrl) || a.registrationInstructions)
                                      ? <a className="agenda-button agenda-register" href={`#/atividade/${a.id}`} onClick={openActivity} aria-label={`Inscreva-se em ${a.title}`}>Inscreva-se<Arrow /></a>
                                      : <button className="agenda-button agenda-register" disabled>Inscreva-se<Arrow /></button>}
                                  </div>
                                </div>
                              </>
                            </article>
                          ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <div>
          <a className="footer-brand" href="#/programacao">
            <img
              className="footer-logo"
              src={seminfoLogo}
              alt="SEMINFO"
              width="1673"
              height="940"
              loading="lazy"
            />
          </a>
          <p>
            XXI Semana da Informática
            <br />
            26 a 29 de outubro de 2026
          </p>
        </div>
        <div>
          <strong>Realização e organização</strong>
          <div className="institutional-logos">
            <img
              src={instituteLogo}
              alt="Instituto Federal do Sul de Minas Gerais, Campus Muzambinho"
              width="2172"
              height="724"
              loading="lazy"
            />
            <img
              src={academicCenterLogo}
              alt="Centro Acadêmico Alan Turing"
              width="1859"
              height="325"
              loading="lazy"
            />
          </div>
          <p>
            IFSULDEMINAS · Campus Muzambinho
            <br />
            Centro Acadêmico Alan Turing
          </p>
        </div>
        <a className="text-link" href="#/sobre">
          Sobre o evento
        </a>
      </footer>
      {cspPromoOpen && (
        <div
          className="csp-promo-backdrop"
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;
            rememberCspPromoDismissal();
            setCspPromoOpen(false);
          }}
        >
          <div
            className="csp-promo-dialog"
            ref={cspPromoDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="csp-promo-title"
            aria-describedby="csp-promo-description"
            tabIndex={-1}
          >
            <button
              className="csp-promo-close"
              type="button"
              aria-label="Fechar destaque da CSP"
              onClick={() => {
                rememberCspPromoDismissal();
                setCspPromoOpen(false);
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
            <p className="csp-promo-eyebrow">XXI SEMINFO · COMPETIÇÃO</p>
            <h2 id="csp-promo-title">Inscrições abertas para a CSP</h2>
            <p id="csp-promo-description">
              A 1ª Competição SEMINFO de Programação já está com inscrições abertas.
            </p>
            <a
              className="csp-promo-cta"
              href="#/atividade/desafio-programacao"
              onClick={() => {
                rememberCspPromoDismissal();
                setCspPromoOpen(false);
                openActivity();
              }}
            >
              Conhecer a CSP <Arrow />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
export default App;
