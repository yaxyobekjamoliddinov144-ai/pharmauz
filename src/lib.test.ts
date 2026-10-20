import { describe, it, expect } from 'vitest';
import { DRUGS, MCQS } from './data';
import { filterDrugs, selectQuestions, scoreQuiz, emptyFilters } from './lib';
describe('filter/search', () => {
  it('searches by generic name', () => expect(filterDrugs(DRUGS, { ...emptyFilters, q: 'metop' }).map(d => d.slug)).toEqual(['metoprolol']));
  it('ORs within a group, ANDs across groups', () => {
    expect(filterDrugs(DRUGS, { ...emptyFilters, system: ['cardio', 'digestive'] })).toHaveLength(3);
    expect(filterDrugs(DRUGS, { ...emptyFilters, system: ['cardio'], cls: ['ccb'] })).toHaveLength(1);
  });
  it('returns empty for no match', () => expect(filterDrugs(DRUGS, { ...emptyFilters, q: 'zzz' })).toHaveLength(0));
});
describe('mcq', () => {
  it('selects by system and caps count', () => {
    expect(selectQuestions(MCQS, { system: ['cardio'], count: 5 })).toHaveLength(2);
    expect(selectQuestions(MCQS, { count: 3 })).toHaveLength(3);
  });
  it('scores answers', () => {
    const r = scoreQuiz(MCQS, [MCQS[0].answer, 'x', undefined, MCQS[3].answer]);
    expect(r.correct).toBe(2); expect(r.wrong).toHaveLength(2);
  });
});
