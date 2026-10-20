import type { Drug, Mcq, SourceInfo } from './types';
const demo = { status: 'demo' as const };
export const DRUGS: Drug[] = [
  { slug: 'metoprolol', generic: 'Metoprolol', brands: [], ingredient: 'Metoprolol', system: ['cardio'], indications: ['hypertension', 'angina'], cls: 'betablocker', routes: ['oral'], mechanism: 'Selective beta-1 adrenergic receptor blocker.', source: demo },
  { slug: 'amlodipine', generic: 'Amlodipine', brands: [], ingredient: 'Amlodipine', system: ['cardio'], indications: ['hypertension', 'angina'], cls: 'ccb', routes: ['oral'], mechanism: 'Dihydropyridine calcium channel blocker.', source: demo },
  { slug: 'omeprazole', generic: 'Omeprazole', brands: [], ingredient: 'Omeprazole', system: ['digestive'], indications: ['gerd'], cls: 'ppi', routes: ['oral'], mechanism: 'Inhibits the gastric H+/K+ ATPase (proton pump).', source: demo },
  { slug: 'metformin', generic: 'Metformin', brands: [], ingredient: 'Metformin', system: ['endocrine'], indications: ['diabetes2'], cls: 'biguanide', routes: ['oral'], mechanism: 'Biguanide; reduces hepatic glucose production.', source: demo },
];
export const MCQS: Mcq[] = DRUGS.map(d => ({
  id: 'demo-' + d.slug, drug: d.slug, system: d.system[0], cls: d.cls, answer: d.cls, difficulty: 'easy' as const, demo: true as const,
  options: ['betablocker', 'ccb', 'ppi', 'biguanide'],
}));
export const SOURCES: SourceInfo[] = [
  { name: 'Uzpharm-control', url: 'https://www.uzpharm-control.uz/', note: 'Intended future source; API/terms not verified.' },
  { name: 'State register', url: 'https://www.uzpharm-control.uz/en/pages/state-register-of-medicines-and-medical-products', note: 'Intended future source.' },
  { name: 'Medpharm catalog', url: 'https://pharm.gov.uz/en/service/drugs', note: 'Intended future source.' },
  { name: 'DailyMed', url: 'https://dailymed.nlm.nih.gov/', note: 'Intended future source (public web services).' },
  { name: 'EMC', url: 'https://www.medicines.org.uk/emc/', note: 'Intended future source; check licence.' },
  { name: 'Vidal', url: 'https://www.vidal.ru/', note: 'Intended future source; check licence.' },
];
