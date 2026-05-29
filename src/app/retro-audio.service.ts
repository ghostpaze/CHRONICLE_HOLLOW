import { Injectable } from '@angular/core';
import { Tone } from './story.models';

type VoiceProfile = 'guide' | 'hero' | 'terminal';
type ToneProfile = VoiceProfile | 'ui';

interface ToneConfig {
  duration: number;
  frequency: number;
  glide: number;
  type: OscillatorType;
  variance: number;
  volume: number;
}

@Injectable({ providedIn: 'root' })
export class RetroAudioService {
  private audioContext: AudioContext | null = null;
  private lastTypeBlipAt = 0;
  private lastUiBlipAt = 0;
  private readonly profiles: Record<ToneProfile, ToneConfig> = {
    guide: { type: 'square', frequency: 760, variance: 34, duration: 0.032, volume: 0.015, glide: -20 },
    hero: { type: 'triangle', frequency: 520, variance: 28, duration: 0.04, volume: 0.018, glide: -10 },
    terminal: { type: 'square', frequency: 680, variance: 24, duration: 0.028, volume: 0.012, glide: -16 },
    ui: { type: 'square', frequency: 980, variance: 22, duration: 0.042, volume: 0.017, glide: 18 }
  };

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('pointerdown', () => this.unlock(), { passive: true });
    window.addEventListener('keydown', () => this.unlock(), { passive: true });
  }

  unlock(): void {
    const context = this.ensureContext();
    if (!context || context.state === 'running') {
      return;
    }

    void context.resume().catch(() => undefined);
  }

  playTypeBlip(profile: VoiceProfile): void {
    const now = performance.now();
    if (now - this.lastTypeBlipAt < 26) {
      return;
    }

    this.lastTypeBlipAt = now;
    this.playTone(profile);
  }

  playUiMove(): void {
    const now = performance.now();
    if (now - this.lastUiBlipAt < 70) {
      return;
    }

    this.lastUiBlipAt = now;
    this.playTone('ui');
  }

  playZoneCue(tone: Tone): void {
    const bases: Record<Tone, number[]> = {
      gold: [420, 560, 690],
      cyan: [360, 470, 620],
      rose: [390, 520, 660],
      lime: [340, 430, 590],
      violet: [310, 430, 580]
    };

    this.playSequence(bases[tone], 0.055, 0.012, 'square');
  }

  playRewardBurst(tone: Tone): void {
    const bases: Record<Tone, number[]> = {
      gold: [480, 620, 820],
      cyan: [430, 570, 760],
      rose: [450, 610, 790],
      lime: [400, 540, 710],
      violet: [370, 520, 700]
    };

    this.playSequence(bases[tone], 0.07, 0.016, 'triangle');
  }

  private playTone(profile: ToneProfile): void {
    const context = this.readyContext();
    if (!context) {
      return;
    }

    const config = this.profiles[profile];
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency + this.randomOffset(config.variance), now);
    oscillator.frequency.linearRampToValueAtTime(config.frequency + config.glide, now + config.duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(config.volume, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + config.duration + 0.01);
  }

  private playSequence(
    frequencies: number[],
    duration: number,
    volume: number,
    type: OscillatorType
  ): void {
    const context = this.readyContext();
    if (!context) {
      return;
    }

    const startAt = context.currentTime;
    frequencies.forEach((frequency, index) => {
      this.scheduleTone(context, {
        startAt: startAt + index * (duration * 0.74),
        frequency,
        duration,
        type,
        volume
      });
    });
  }

  private scheduleTone(
    context: AudioContext,
    params: {
      startAt: number;
      frequency: number;
      duration: number;
      type: OscillatorType;
      volume: number;
    }
  ): void {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = params.type;
    oscillator.frequency.setValueAtTime(params.frequency, params.startAt);
    oscillator.frequency.linearRampToValueAtTime(params.frequency + 28, params.startAt + params.duration);

    gain.gain.setValueAtTime(0.0001, params.startAt);
    gain.gain.linearRampToValueAtTime(params.volume, params.startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, params.startAt + params.duration);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(params.startAt);
    oscillator.stop(params.startAt + params.duration + 0.01);
  }

  private readyContext(): AudioContext | null {
    const context = this.ensureContext();
    if (!context) {
      return null;
    }

    if (context.state !== 'running') {
      void context.resume().catch(() => undefined);
      return null;
    }

    return context;
  }

  private ensureContext(): AudioContext | null {
    if (this.audioContext) {
      return this.audioContext;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    this.audioContext = new AudioContextCtor();
    return this.audioContext;
  }

  private randomOffset(variance: number): number {
    return (Math.random() - 0.5) * variance;
  }
}
