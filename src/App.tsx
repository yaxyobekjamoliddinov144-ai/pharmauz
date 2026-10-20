import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DRUGS, MCQS, SOURCES } from './data';
import { filterDrugs, selectQuestions, scoreQuiz, uniq, emptyFilters, type Filters } from './lib';
import type { Mcq } from './types';

const GROUPS = [
  ['system', DRUGS.map(d => d.system)], ['indication', DRUGS.map(d => d.indications)],
  ['cls', DRUGS.map(d => [d.cls])], ['route', DRUGS.map(d => d.routes)],
] as const;

function Nav() {
  const { t, i18n } = useTranslation();
  return (<header className="nav glass">
    <Link to="/" className="logo">PHARMA PLASMA <b>UZ</b></Link>
    <nav>{([['/', 'home'], ['/drugs', 'library'], ['/tests', 'tests']] as const).map(([to, k]) => <NavLink key={to} to={to} end={to === '/'}>{t(k)}</NavLink>)}</nav>
    <div className="lang" role="group" aria-label="Language">{['uz', 'en', 'ru'].map(l => <button key={l} aria-pressed={i18n.language === l} onClick={() => i18n.changeLanguage(l)}>{l.toUpperCase()}</button>)}</div>
  </header>);
}

function Home() {
  const { t } = useTranslation(); const nav = useNavigate(); const [q, setQ] = useState('');
  const recent: string[] = JSON.parse(localStorage.getItem('recent') || '[]');
  return (<main>
    <section className="hero glass"><div className="plasma" aria-hidden />
      <h1>{t('heroTitle')}</h1>
      <form onSubmit={e => { e.preventDefault(); nav('/drugs?q=' + encodeURIComponent(q)); }}>
        <input aria-label={t('search')} placeholder={t('search')} value={q} onChange={e => setQ(e.target.value)} />
        <button className="primary">{t('library')}</button>
      </form>
    </section>
    <h2>{t('browse')}</h2>
    <div className="chips">{uniq(DRUGS.map(d => d.system)).map(s => <Link className="chip" key={s} to={'/drugs?system=' + s}>{t('v.' + s)}</Link>)}</div>
    <Link className="cta glass" to="/tests">{t('tests')} →</Link>
    <h2>{t('recent')}</h2>
    <div className="chips">{recent.length ? recent.map(s => <Link className="chip" key={s} to={'/drugs/' + s}>{DRUGS.find(d => d.slug === s)?.generic}</Link>) : <span className="muted">{t('noRecent')}</span>}</div>
    <p className="muted">{t('disclaimer')}</p>
  </main>);
}

function Library() {
  const { t } = useTranslation(); const [sp] = useSearchParams();
  const [f, setF] = useState<Filters>({ ...emptyFilters, q: sp.get('q') || '', system: sp.getAll('system') });
  const [sort, setSort] = useState('az');
  const res = useMemo(() => { const r = filterDrugs(DRUGS, f).sort((a, b) => a.generic.localeCompare(b.generic)); return sort === 'az' ? r : r.reverse(); }, [f, sort]);
  const toggle = (g: 'system' | 'indication' | 'cls' | 'route', v: string) => setF(p => ({ ...p, [g]: p[g].includes(v) ? p[g].filter(x => x !== v) : [...p[g], v] }));
  return (<main>
    <div className="bar">
      <input aria-label={t('search')} placeholder={t('search')} value={f.q} onChange={e => setF({ ...f, q: e.target.value })} />
      <select aria-label={t('sort')} value={sort} onChange={e => setSort(e.target.value)}><option value="az">{t('az')}</option><option value="za">{t('za')}</option></select>
      <button onClick={() => setF(emptyFilters)}>{t('clear')}</button>
    </div>
    {GROUPS.map(([g, vals]) => <fieldset key={g}><legend>{t(g)}</legend><div className="chips">{uniq(vals as unknown as string[][]).map(v => <button key={v} className="chip" aria-pressed={f[g].includes(v)} onClick={() => toggle(g, v)}>{t('v.' + v)}</button>)}</div></fieldset>)}
    <p aria-live="polite">{t('results', { n: res.length })}</p>
    {res.length === 0 && <p className="muted">{t('empty')}</p>}
    <div className="grid">{res.map(d => <Link key={d.slug} to={'/drugs/' + d.slug} className="card glass"><h3>{d.generic}</h3><span className="muted">{t('v.' + d.cls)}</span><span className="badge">{t('demo')}</span></Link>)}</div>
  </main>);
}

function Detail() {
  const { t } = useTranslation(); const { slug } = useParams(); const d = DRUGS.find(x => x.slug === slug);
  if (!d) return <main><p>{t('notFound')}</p><Link to="/drugs">{t('back')}</Link></main>;
  const r: string[] = JSON.parse(localStorage.getItem('recent') || '[]');
  localStorage.setItem('recent', JSON.stringify([d.slug, ...r.filter(x => x !== d.slug)].slice(0, 6)));
  const row = (k: string, v: string[]) => <><dt>{t(k)}</dt><dd>{v.map(x => t('v.' + x)).join(', ')}</dd></>;
  return (<main className="glass pad"><Link to="/drugs">← {t('back')}</Link><h1>{d.generic}</h1>
    <dl>{row('system', d.system)}{row('indication', d.indications)}{row('cls', [d.cls])}{row('route', d.routes)}
      <dt>{t('mechanism')}</dt><dd>{d.mechanism}</dd><dt>{t('status')}</dt><dd><span className="badge">{t('demo')}</span></dd></dl>
    <p className="warn">{t('officialNA')}</p></main>);
}

function Quiz() {
  const { t } = useTranslation();
  const [sys, setSys] = useState<string[]>([]); const [count, setCount] = useState(5);
  const [qs, setQs] = useState<Mcq[] | null>(null); const [i, setI] = useState(0); const [ans, setAns] = useState<(string | undefined)[]>([]); const [done, setDone] = useState(false);
  const avail = selectQuestions(MCQS, { system: sys, count: 999 }).length;
  const begin = (list: Mcq[]) => { setQs(list); setI(0); setAns([]); setDone(false); };
  const name = (q: Mcq) => DRUGS.find(d => d.slug === q.drug)!.generic;
  if (!qs) return (<main className="glass pad"><h1>{t('tests')}</h1><p className="warn">{t('demoQ')}</p>
    <div className="chips">{uniq(DRUGS.map(d => d.system)).map(s => <button key={s} className="chip" aria-pressed={sys.includes(s)} onClick={() => setSys(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}>{t('v.' + s)}</button>)}</div>
    <label>{t('count')} <select value={count} onChange={e => setCount(+e.target.value)}>{[5, 10, 20, 30].map(n => <option key={n}>{n}</option>)}</select></label>
    <p>{t('available', { n: avail })}</p>
    <button className="primary" disabled={!avail} onClick={() => begin(selectQuestions(MCQS, { system: sys, count }))}>{t('start')}</button></main>);
  if (done) { const r = scoreQuiz(qs, ans); return (<main className="glass pad"><h1>{t('score', { c: r.correct, n: r.total })}</h1>
    {r.wrong.length > 0 && <button className="primary" onClick={() => begin(r.wrong)}>{t('retry')}</button>}
    <button onClick={() => setQs(null)}>{t('again')}</button></main>); }
  const q = qs[i]; const a = ans[i];
  return (<main className="glass pad"><p className="muted">{i + 1} / {qs.length}</p><h2>{t('qText', { drug: name(q) })}</h2>
    <div className="opts">{q.options.map(o => <button key={o} className={'opt' + (a ? (o === q.answer ? ' ok' : o === a ? ' bad' : '') : '')} disabled={!!a} onClick={() => setAns(p => { const n = [...p]; n[i] = o; return n; })}>{t('v.' + o)}</button>)}</div>
    {a && <p aria-live="polite"><b>{a === q.answer ? t('correct') : t('wrong')}.</b> {t('explain', { drug: name(q), cls: t('v.' + q.answer) })}</p>}
    {a && <button className="primary" onClick={() => {
      if (i + 1 < qs.length) setI(i + 1); else {
        setDone(true); const r = scoreQuiz(qs, ans);
        const h = JSON.parse(localStorage.getItem('history') || '[]'); h.push({ at: Date.now(), c: r.correct, n: r.total });
        localStorage.setItem('history', JSON.stringify(h));
      } }}>{i + 1 < qs.length ? t('next') : t('finish')}</button>}
  </main>);
}

export default function App() {
  const { t } = useTranslation();
  return (<BrowserRouter><Nav />
    <Routes><Route path="/" element={<Home />} /><Route path="/drugs" element={<Library />} /><Route path="/drugs/:slug" element={<Detail />} /><Route path="/tests" element={<Quiz />} /><Route path="*" element={<main><p>{t('notFound')}</p></main>} /></Routes>
    <footer><p className="muted">{t('disclaimer')}</p><p className="muted">{t('sources')}: {SOURCES.map(s => <a key={s.name} href={s.url} target="_blank" rel="noreferrer">{s.name} </a>)}</p></footer>
  </BrowserRouter>);
}
