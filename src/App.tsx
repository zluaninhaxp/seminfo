import { useEffect, useMemo, useRef, useState } from "react";
import { activities, days, event, type Activity } from "./data";
import "./App.css";
import seminfoLogo from "./assets/LogoSEMINFO.png";
import instituteLogo from "./assets/LogoIF.png";
import academicCenterLogo from "./assets/LogoCA2.png";

const labels = {
  open: "Inscrições abertas",
  closed: "Inscrições encerradas",
  full: "Vagas esgotadas",
  none: "Sem inscrição",
  soon: "Inscrições em breve",
};
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
  const main = useRef<HTMLElement>(null);
  const [origin, setOrigin] = useState("/programacao");
  const lastRoute = useRef(route);
  const originFocus = useRef<string | null>(null);
  const [showEarlier, setShowEarlier] = useState(false);
  const position = useRef(0);
  const returning = useRef(false);
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
            (!openOnly || (a.registrationStatus === "open" && !a.cancelled)) &&
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
              Acessar atividade online
            </a>
          ) : (
            <p className="action-note">Link de acesso online a divulgar.</p>
          ))}
        {a.registrationStatus === "open" &&
          (a.registrationUrl ? (
            <a
              className="button"
              href={a.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Inscrever-se no formulário
            </a>
          ) : (
            <p className="action-note">
              {event.demo
                ? "Formulário indisponível nesta demonstração."
                : "Formulário de inscrição a divulgar."}
            </p>
          ))}
        {a.registrationStatus !== "open" && (
          <p className="action-note">{labels[a.registrationStatus]}</p>
        )}
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
            <small>XXI · 2026</small>
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
          <section
            className={`hero ${event.phase === "live" && !isAbout ? "hero-live" : ""}`}
          >
            <div className="hero-copy">
              <h1>
                {isAbout ? (
                  <>
                    Uma semana.
                    <br />
                    Muitas conexões.
                  </>
                ) : isActivities ? (
                  <>
                    Encontre a sua
                    <br />
                    <em>próxima descoberta.</em>
                  </>
                ) : event.phase === "live" ? (
                  <>
                    A SEMINFO
                    <br />
                    <em>acontece agora.</em>
                  </>
                ) : event.phase === "finished" ? (
                  <>
                    Encontros que
                    <br />
                    <em>ficam com você.</em>
                  </>
                ) : (
                  <>
                    Informática.
                    <br />
                    <em>Encontros reais.</em>
                  </>
                )}
              </h1>
              <p>
                {isAbout
                  ? "A Semana da Informática do IFSULDEMINAS, Campus Muzambinho. Um espaço para aprender, trocar experiências e conhecer novas possibilidades."
                  : "Quatro dias de palestras, oficinas e experiências. Escolha suas atividades e faça parte da XXI SEMINFO."}
              </p>
              <div className="hero-links">
                <a
                  className="button"
                  href={
                    isAbout || event.phase !== "registration"
                      ? "#/programacao"
                      : "#/atividades"
                  }
                  onClick={(e) => {
                    clear();
                    if (!isAbout && event.phase === "registration")
                      setOpenOnly(true);
                    else if (route === "/programacao") {
                      e.preventDefault();
                      document
                        .getElementById("list-heading")
                        ?.scrollIntoView({
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "auto"
                            : "smooth",
                        });
                    }
                  }}
                >
                  {isAbout || event.phase !== "registration"
                    ? "Consultar programação"
                    : "Explorar inscrições"}
                </a>
                <a
                  className="text-link"
                  href={isAbout ? "#/atividades" : "#/sobre"}
                >
                  {isAbout ? "Conhecer atividades" : "Conheça a SEMINFO"}
                </a>
              </div>
            </div>
            <div className="event-stamp">
              <img
                className="hero-logo"
                src={seminfoLogo}
                alt="XXI SEMINFO"
                width="1673"
                height="940"
                fetchPriority="high"
              />
              <div className="stamp-bottom">
                <strong>
                  26 a 29
                  <br />
                  outubro 2026
                </strong>
                <span>
                  Campus Muzambinho
                  <br />
                  Evento gratuito
                </span>
              </div>
            </div>
          </section>
        )}
        {event.demo && (
          <div className="demo-notice">
            <strong>Programação demonstrativa.</strong> As atividades são
            fictícias e os formulários ainda não estão disponíveis. Datas e
            identidade correspondem à edição de 2026.
          </div>
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
            <a
              className="back-link"
              href={`#${origin}`}
              onClick={() => {
                returning.current = true;
              }}
            >
              Voltar{" "}
              {origin === "/atividades" ? "às atividades" : "à programação"}
            </a>
            <div className="detail-layout">
              <article>
                <div className="detail-type">
                  {detail.type} · {detail.mode}
                </div>
                <h1>{detail.title}</h1>
                {detail.cancelled && (
                  <p className="status important">Atividade cancelada</p>
                )}
                {detail.notice && (
                  <p className="change-notice">{detail.notice}</p>
                )}
                <div className="detail-summary">
                  <p>
                    {dateLabel(detail.date)} · {detail.start}–{detail.end}
                    <small>Horário de Brasília</small>
                  </p>
                  <p>{detail.location}</p>
                </div>
                <h2>Sobre a atividade</h2>
                <p>{detail.description}</p>
                <h2>Quem conduz</h2>
                <p>{detail.speaker}</p>
                <h2>Antes de participar</h2>
                {detail.requirements.length ? (
                  <ul>
                    {detail.requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Não há requisitos informados.</p>
                )}
              </article>
              <aside className="participation">
                <h2>Participe</h2>
                <p className="capacity">
                  {detail.capacity === null
                    ? "Sem limite de vagas"
                    : `${detail.capacity} vagas`}
                </p>
                {detail.capacity !== null && (
                  <p>Preenchimento por ordem de inscrição.</p>
                )}
                {actions(detail)}
                <p className="registration-help">
                  A inscrição é feita por atividade, em formulário externo.
                  Consulte as orientações de confirmação no formulário.
                </p>
                <button className="text-button" onClick={share}>
                  Copiar link da atividade
                </button>
                <p role="status">{shareMessage}</p>
              </aside>
            </div>
          </section>
        ) : isAbout ? (
          <section className="content about-page">
            <div className="about-intro">
              <h2>
                Conhecimento que
                <br />
                se encontra.
              </h2>
              <div>
                <p>
                  A SEMINFO reúne atividades voltadas à informática, com
                  palestras, oficinas e oportunidades de troca entre
                  participantes.
                </p>
                <p>
                  Este site centraliza a programação, os locais e as inscrições
                  para ajudar você a planejar sua semana e acompanhar o evento.
                </p>
              </div>
            </div>
            <div className="information">
              <section>
                <h2>Esta edição</h2>
                <p>XXI Semana da Informática</p>
                <p>
                  26 a 29 de outubro de 2026
                  <br />
                  IFSULDEMINAS · Campus Muzambinho
                </p>
                <p className="info-emphasis">Participação gratuita.</p>
              </section>
              <section>
                <h2>Como participar</h2>
                <p>
                  Escolha as atividades e consulte os detalhes. As inscrições
                  são feitas individualmente por formulário.
                </p>
                <p>
                  Oficinas com capacidade limitada preenchem as vagas por ordem
                  de inscrição. Confira a disponibilidade antes de participar.
                </p>
                <a className="text-link" href="#/atividades">
                  Explorar atividades
                </a>
              </section>
              <section>
                <h2>Presencial e online</h2>
                <p>
                  A programação informa o local de cada atividade. Quando houver
                  atividade online, o link público estará disponível no detalhe.
                </p>
                <p>
                  Orientações de acesso ao campus serão publicadas pela
                  organização.
                </p>
              </section>
              <section>
                <h2>Organização</h2>
                <p className="organizer">
                  Centro Acadêmico
                  <br />
                  Alan Turing
                </p>
                <p>
                  A comissão organizadora mantém os horários, locais, inscrições
                  e avisos atualizados.
                </p>
                <p>Os canais oficiais de contato serão adicionados aqui.</p>
              </section>
            </div>
          </section>
        ) : (
          <section className="content programme" aria-labelledby="list-heading">
            <div className="section-heading">
              <h2 id="list-heading">
                {isActivities ? "Atividades" : "Sua semana, por dia."}
              </h2>
              <p>
                {isActivities
                  ? "Busque um assunto. Encontre seu encontro."
                  : "Horários de Brasília · Presencial e online"}
              </p>
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
              <div className="agenda-list">
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
                  <div className="empty">
                    <h3>Nenhuma atividade encontrada.</h3>
                    <p>
                      {search || type !== "Todas" || openOnly
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
                              <div className="activity-heading">
                                <span className="activity-type">{a.type}</span>
                                <span
                                  className={`status ${a.cancelled ? "important" : a.registrationStatus === "open" ? "available" : ""}`}
                                >
                                  {a.cancelled
                                    ? "Cancelada"
                                    : labels[a.registrationStatus]}
                                </span>
                              </div>
                              <h3>
                                <a
                                  href={`#/atividade/${a.id}`}
                                  onClick={openActivity}
                                >
                                  {a.title}
                                </a>
                              </h3>
                              <div className="activity-meta">
                                <span>
                                  {a.start}–{a.end}
                                </span>
                                <span>{a.location}</span>
                              </div>
                              {a.notice && (
                                <p className="row-notice">{a.notice}</p>
                              )}
                              {temporal(a) && (
                                <p className="temporal">{temporal(a)}</p>
                              )}
                              <div className="activity-bottom">
                                <span>{a.speaker}</span>
                                <a
                                  href={`#/atividade/${a.id}`}
                                  onClick={openActivity}
                                  aria-label={`Ver detalhes de ${a.title}`}
                                >
                                  Ver detalhes
                                </a>
                              </div>
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
    </>
  );
}
export default App;
