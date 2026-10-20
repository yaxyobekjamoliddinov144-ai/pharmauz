export type SourceStatus = 'demo' | 'verified';
export interface Drug {
  slug: string; generic: string; brands: string[]; ingredient: string;
  strength?: string; form?: string; manufacturer?: string;
  system: string[]; indications: string[]; cls: string; routes: string[];
  mechanism?: string; // educational note (English), NOT an official instruction
  source: { status: SourceStatus; jurisdiction?: string; language?: string; url?: string };
}
export interface Mcq { id: string; drug: string; system: string; cls: string; options: string[]; answer: string; difficulty: 'easy' | 'medium' | 'hard'; demo: true }
export interface SourceInfo { name: string; url: string; note: string }
// Import format for future real data: JSON array of Drug with source.status = 'verified'.
