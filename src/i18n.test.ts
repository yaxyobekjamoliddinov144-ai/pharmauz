import { it, expect } from 'vitest';
const store: Record<string, string> = {};
(globalThis as any).localStorage = { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } };
it('defaults to Uzbek, switches and persists', async () => {
  const { default: i18n } = await import('./i18n');
  expect(i18n.language).toBe('uz');
  await i18n.changeLanguage('ru');
  expect(i18n.t('library')).toBe('Каталог');
  expect(store.lang).toBe('ru');
});
