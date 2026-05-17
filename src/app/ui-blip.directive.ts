import { Directive, HostListener } from '@angular/core';
import { RetroAudioService } from './retro-audio.service';

@Directive({
  selector: '[appUiBlip]'
})
export class UiBlipDirective {
  private lastPlayAt = 0;

  constructor(private audio: RetroAudioService) {}

  @HostListener('pointerdown')
  onPointerDown(): void {
    this.audio.unlock();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.playMoveBlip();
  }

  @HostListener('focus')
  onFocus(): void {
    this.playMoveBlip();
  }

  private playMoveBlip(): void {
    const now = performance.now();
    if (now - this.lastPlayAt < 90) {
      return;
    }

    this.lastPlayAt = now;
    this.audio.playUiMove();
  }
}
