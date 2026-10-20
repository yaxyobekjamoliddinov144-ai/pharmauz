import type { Drug, Mcq } from './types';
export interface Filters { q: string; system: string[]; indication: string[]; cls: string[]; route: string[] }
export const emptyFilters: Filters = { q: '', system: [], indication: [], cls: [], route: [] };
const hit = (sel: string[], vals: string[]) => sel.length === 0 || sel.some(s => vals.includes(s));
export function filterDrugs(drugs: Drug[], f: Filters): Drug[] {
  const q = f.q.trim().toLowerCase();
  return drugs.filter(d =>
    (!q || [d.generic, d.ingredient, d.manufacturer ?? '', ...d.brands].some(s => s.toLowerCase().includes(q))) &&
    hit(f.system, d.system) && hit(f.indication, d.indications) && hit(f.cls, [d.cls]) && hit(f.route, d.routes));
}
export function selectQuestions(qs: Mcq[], opt: { system?: string[]; cls?: string[]; count: number }, rnd = Math.random): Mcq[] {
  const pool = qs.filter(q => (!opt.system?.length || opt.system.includes(q.system)) && (!opt.cls?.length || opt.cls.includes(q.cls)));
  const a = [...pool];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, opt.count);
}
export function scoreQuiz(qs: Mcq[], answers: (string | undefined)[]) {
  const wrong = qs.filter((q, i) => answers[i] !== q.answer);
  return { correct: qs.length - wrong.length, total: qs.length, wrong };
}
export const uniq = (xs: string[][]) => [...new Set(xs.flat())];
