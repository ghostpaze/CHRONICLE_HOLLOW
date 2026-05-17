export type Speaker = 'guide' | 'hero';
export type Tone = 'gold' | 'cyan' | 'rose' | 'lime' | 'violet';

export interface Spotlight {
  label: string;
  value: string;
  tone: Tone;
}

export interface Chapter {
  id: string;
  zone: string;
  title: string;
  subtitle: string;
  objective: string;
  speaker: Speaker;
  speakerName: string;
  dialogue: string;
  summary: string;
  learnings: string[];
  spotlight: Spotlight[];
  vibe: Tone;
}
