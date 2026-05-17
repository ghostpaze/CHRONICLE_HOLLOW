import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-typewriter',
  template: `<div class="typewriter typewriter-overlay"><span [innerText]="display"></span></div>`,
  styles: [`:host { display:block }`]
})
export class TypewriterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() text = '';
  @Input() speed = 30;
  @Input() restartKey = 0;
  @Output() finished = new EventEmitter<void>();

  display = '';
  private index = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.start();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] || changes['restartKey']) {
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  start(): void {
    this.stop();

    if (!this.text) {
      this.display = '';
      return;
    }

    if (this.speed <= 0 || this.text.length === 1) {
      this.display = this.text;
      this.finished.emit();
      return;
    }

    this.display = this.text.charAt(0);
    this.index = 1;
    this.tick();
  }

  private tick(): void {
    if (this.index >= this.text.length) {
      this.stop();
      this.finished.emit();
      return;
    }

    this.timer = setTimeout(() => {
      this.display += this.text.charAt(this.index);
      this.index += 1;
      this.tick();
    }, this.speed);
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = null;
  }
}
