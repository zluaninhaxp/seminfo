import { activityTime, type ActivityMoment } from "./data";
import "./ActivityMoments.css";

function title(moment: ActivityMoment, index: number, moments: ActivityMoment[]) {
  return moment.title || (moment.kind === "talk" ? `Palestra ${moments.slice(0, index + 1).filter(m => m.kind === "talk").length} · título a divulgar` : "Título a divulgar");
}
export function MomentPreview({ moments }: { moments: ActivityMoment[] }) {
  return <ol className={`moment-preview${moments.some(moment => moment.end) ? " moment-preview-ranges" : ""}`} aria-label="Momentos da atividade">
    {moments.map((moment, index) => <li key={moment.id} className={`moment-preview-${moment.kind}`}>
      <span className={`moment-time${!moment.start ? " moment-time-long" : ""}`}>{activityTime(moment)}</span>
      <div><p className="moment-title">{title(moment, index, moments)}</p>
        {moment.kind === "talk" && <p className="moment-names">{moment.speakers?.length ? moment.speakers.map(s => s.name).join(" · ") : "Palestrante a divulgar"}</p>}
      </div>
    </li>)}
  </ol>;
}
export function MomentDetails({ moments }: { moments: ActivityMoment[] }) {
  const talks = moments.filter(m => m.kind === "talk");
  return <>
    <section className="moment-schedule" aria-labelledby="moment-schedule-title">
      <h2 id="moment-schedule-title">Cronograma</h2>
      <ol>{moments.map((moment, index) => <li key={moment.id}>
        <span className="moment-time">{activityTime(moment)}</span>
        <div>{moment.kind === "talk" ? <button className="moment-jump" onClick={() => {
          const section = document.getElementById(`momento-${moment.id}`);
          section?.scrollIntoView({ block: "start" });
          section?.focus({ preventScroll: true });
        }}>Palestra {talks.indexOf(moment) + 1} <span aria-hidden="true">↓</span></button> : <><h3>{title(moment, index, moments)}</h3>{moment.description && <p>{moment.description}</p>}{moment.location && <p>{moment.location}</p>}</>}
        </div>
      </li>)}</ol>
    </section>
    {talks.map(moment => <section className="moment-talk" id={`momento-${moment.id}`} tabIndex={-1} aria-labelledby={`titulo-${moment.id}`} key={moment.id}>
      <p className="moment-time">{activityTime(moment)}</p>
      <h2 id={`titulo-${moment.id}`}>{title(moment, moments.indexOf(moment), moments)}</h2>
      <div className="moment-description">{moment.description ? moment.description.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>) : <p>Descrição da palestra a divulgar.</p>}</div>
      <h3>Quem conduz</h3>
      {moment.speakers?.length ? <ul className="moment-speakers">{moment.speakers.map((speaker, i) => <li key={`${speaker.name}-${i}`}><strong>{speaker.name}</strong>{speaker.affiliation && <p>{speaker.affiliation}</p>}{speaker.bio && <p className="moment-bio">{speaker.bio}</p>}</li>)}</ul> : <p>Palestrante a divulgar.</p>}
      {moment.location && <p>Local: {moment.location}</p>}
      {moment.requirements?.length ? <><h3>Antes de participar</h3><ul>{moment.requirements.map(r => <li key={r}>{r}</li>)}</ul></> : null}
      {moment.links?.map((link, i) => /^https?:\/\//i.test(link.url) ? <p key={i}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></p> : null)}
    </section>)}
  </>;
}
