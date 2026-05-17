import { Component, HostListener, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { RetroAudioService } from './retro-audio.service';

type VoiceProfile = 'guide' | 'hero' | 'terminal' | 'none';

@Component({
  selector: 'app-typewriter-text',
  template: `
    <div class="typewriter" [class.typewriter-live]="isTyping">
      {{ displayedText }}
    </div>
  `
})
export class TypewriterTextComponent implements OnChanges, OnDestroy {
  @Input() text = '';
  @Input() replayKey: string | number | null = null;
  @Input() charDelay = 18;
  @Input() startDelay = 60;
  @Input() soundProfile: VoiceProfile = 'terminal';

  displayedText = '';
  isTyping = false;

  private timerId: number | null = null;
  private cursor = 0;
  private boostTyping = false;

  constructor(private audio: RetroAudioService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] || changes['replayKey']) {
      this.startTyping();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  @HostListener('pointerdown')
  onPointerDown(): void {
    this.audio.unlock();
  }

  @HostListener('click')
  onClick(): void {
    if (this.isTyping) {
      this.finishTyping();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isTyping) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.finishTyping();
      return;
    }

    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      if (!this.boostTyping) {
        this.boostTyping = true;
        this.flushNextChar();
      }
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === ' ' || event.code === 'Space') {
      this.boostTyping = false;
    }
  }

  private startTyping(): void {
    this.clearTimer();
    this.cursor = 0;
    this.displayedText = '';
    this.boostTyping = false;

    if (!this.text) {
      this.isTyping = false;
      return;
    }

    this.isTyping = true;
    this.timerId = window.setTimeout(() => this.stepTyping(), this.startDelay);
  }

  private stepTyping(): void {
    if (this.cursor >= this.text.length) {
      this.finishTyping();
      return;
    }

    this.cursor += 1;
    this.displayedText = this.text.slice(0, this.cursor);
    this.playBlip(this.text[this.cursor - 1]);

    if (this.cursor >= this.text.length) {
      this.finishTyping();
      return;
    }

    const currentChar = this.text[this.cursor - 1];
    this.timerId = window.setTimeout(() => this.stepTyping(), this.delayFor(currentChar));
  }

  private finishTyping(): void {
    this.displayedText = this.text;
    this.isTyping = false;
    this.boostTyping = false;
    this.clearTimer();
  }

  private delayFor(char: string): number {
    let delay = this.charDelay;

    if (char === '\n') {
      delay = this.charDelay * 5;
    } else if (char === ' ') {
      delay = Math.max(12, Math.round(this.charDelay * 0.65));
    } else if (',;:'.includes(char)) {
      delay = this.charDelay * 3;
    } else if ('.!?'.includes(char)) {
      delay = this.charDelay * 5;
    }

    return this.boostTyping ? Math.max(4, Math.round(delay * 0.22)) : delay;
  }

  private playBlip(char: string): void {
    if (this.soundProfile === 'none') {
      return;
    }

    if (!/[A-Za-z0-9]/.test(char)) {
      return;
    }

    this.audio.playTypeBlip(this.soundProfile);
  }

  private flushNextChar(): void {
    if (this.timerId === null) {
      return;
    }

    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => this.stepTyping(), 0);
  }

  private clearTimer(): void {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}
