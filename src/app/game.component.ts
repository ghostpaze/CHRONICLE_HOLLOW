import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { RetroAudioService } from './retro-audio.service';
import { SpriteService } from './sprite.service';
import { Chapter, GAME_CHAPTERS, RunReport, RunSecretLog } from './story.models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit, OnDestroy {
  @Output() onFinish = new EventEmitter<RunReport>();

  step = 0;
  chapters: Chapter[] = GAME_CHAPTERS;
  heroSprite = '';
  guideSprite = '';
  heroPortrait = '';
  guidePortrait = '';
  starSprite = '';
  arcadeSprite = '';
  cyanOrb = '';
  roseOrb = '';
  goldOrb = '';
  limeOrb = '';
  backpackSprite = '';
  relicSprites: Record<string, string> = {};
  backpackOpen = false;
  zoneIntroOpen = false;
  introChapter: Chapter | null = null;
  relicRewardOpen = false;
  rewardChapter: Chapter | null = null;
  secretToastOpen = false;
  activeSecret: RunSecretLog | null = null;

  private readonly visitedIds = new Set<string>();
  private readonly eventStageById: Record<string, number> = {};
  private readonly completedEvents = new Set<string>();
  private readonly unlockedSecrets = new Map<string, RunSecretLog>();
  archiveFocusId = this.chapters[0].id;
  private introTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private rewardDelayTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private rewardTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private secretTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private sprite: SpriteService,
    private audio: RetroAudioService
  ) {}

  ngOnInit(): void {
    this.heroSprite = this.sprite.heroSprite();
    this.guideSprite = this.sprite.guideSprite();
    this.heroPortrait = this.sprite.heroPortrait();
    this.guidePortrait = this.sprite.guidePortrait();
    this.starSprite = this.sprite.saveStar();
    this.arcadeSprite = this.sprite.arcadeCabinet();
    this.cyanOrb = this.sprite.orb('cyan');
    this.roseOrb = this.sprite.orb('rose');
    this.goldOrb = this.sprite.orb('gold');
    this.limeOrb = this.sprite.orb('lime');
    this.backpackSprite = this.sprite.backpack();
    this.relicSprites = this.chapters.reduce<Record<string, string>>((acc, chapter) => {
      acc[chapter.id] = this.sprite.relicSprite(chapter.id, chapter.vibe);
      return acc;
    }, {});
    this.handleRoomEntry(this.current);
  }

  ngOnDestroy(): void {
    if (this.introTimeoutId) {
      clearTimeout(this.introTimeoutId);
    }

    if (this.rewardDelayTimeoutId) {
      clearTimeout(this.rewardDelayTimeoutId);
    }

    if (this.rewardTimeoutId) {
      clearTimeout(this.rewardTimeoutId);
    }

    if (this.secretTimeoutId) {
      clearTimeout(this.secretTimeoutId);
    }
  }

  get current(): Chapter {
    return this.chapters[this.step];
  }

  get progressPercent(): number {
    return ((this.step + 1) / this.chapters.length) * 100;
  }

  get visitedCount(): number {
    return this.chapters.filter((chapter) => this.visitedIds.has(chapter.id)).length;
  }

  get nextLabel(): string {
    return this.step === this.chapters.length - 1 ? 'CERRAR RUN' : 'SIGUIENTE SALA';
  }

  get speakerPortrait(): string {
    return this.current.speaker === 'guide' ? this.guidePortrait : this.heroPortrait;
  }

  get unlockedChapters(): Chapter[] {
    return this.chapters.filter((chapter) => this.visitedIds.has(chapter.id));
  }

  get archiveFocusChapter(): Chapter {
    return this.unlockedChapters.find((chapter) => chapter.id === this.archiveFocusId) ?? this.current;
  }

  get nextUnlock(): Chapter | null {
    return this.chapters.find((chapter) => !this.visitedIds.has(chapter.id)) ?? null;
  }

  get currentEncounterStage(): number {
    return this.eventStageById[this.current.id] ?? 0;
  }

  get currentEncounterComplete(): boolean {
    return this.completedEvents.has(this.current.id);
  }

  get currentEncounterCopy(): string {
    if (this.currentEncounterComplete) {
      return this.current.encounter.completion;
    }

    if (this.currentEncounterStage === 0) {
      return this.current.encounter.briefing;
    }

    return this.current.encounter.steps[this.currentEncounterStage - 1]?.response ?? this.current.encounter.briefing;
  }

  get currentEncounterActionLabel(): string {
    return this.current.encounter.steps[this.currentEncounterStage]?.label ?? 'EVENTO COMPLETO';
  }

  get currentEncounterActionsDone(): number {
    return Math.min(this.currentEncounterStage, this.current.encounter.steps.length);
  }

  get totalSecretsFound(): number {
    return this.unlockedSecrets.size;
  }

  get totalEventsCompleted(): number {
    return this.completedEvents.size;
  }

  previous(): void {
    this.goToStep(this.step - 1);
  }

  next(): void {
    if (this.step < this.chapters.length - 1) {
      this.goToStep(this.step + 1);
      return;
    }

    this.onFinish.emit({
      visitedZones: this.unlockedChapters.map((chapter) => chapter.zone),
      relicsUnlocked: this.unlockedChapters.map((chapter) => chapter.archive.relic),
      completionPercent: 100,
      finalChapterId: this.current.id,
      eventsCompleted: Array.from(this.completedEvents),
      secretFinds: Array.from(this.unlockedSecrets.values()),
      playerTitle: this.buildPlayerTitle(),
      finalMessage: this.buildFinalMessage()
    });
  }

  jumpTo(index: number): void {
    if (!this.canJumpTo(index)) {
      return;
    }

    this.goToStep(index);
  }

  toggleBackpack(): void {
    this.backpackOpen = !this.backpackOpen;
  }

  closeBackpack(): void {
    this.backpackOpen = false;
  }

  advanceEncounter(): void {
    if (this.currentEncounterComplete) {
      return;
    }

    const nextStage = this.currentEncounterStage + 1;
    this.eventStageById[this.current.id] = nextStage;

    if (nextStage >= this.current.encounter.steps.length) {
      this.completedEvents.add(this.current.id);
      this.audio.playRewardBurst(this.current.vibe);
      return;
    }

    this.audio.playUiMove();
  }

  focusArchive(id: string): void {
    if (!this.visitedIds.has(id)) {
      return;
    }

    this.archiveFocusId = id;
  }

  isVisited(chapterId: string): boolean {
    return this.visitedIds.has(chapterId);
  }

  isCurrent(chapterId: string): boolean {
    return this.current.id === chapterId;
  }

  canJumpTo(index: number): boolean {
    return index <= this.furthestUnlockedIndex;
  }

  registerSecret(secret: RunSecretLog): void {
    if (this.unlockedSecrets.has(secret.id)) {
      return;
    }

    this.unlockedSecrets.set(secret.id, secret);
    this.activeSecret = secret;
    this.secretToastOpen = true;
    this.audio.playRewardBurst(this.current.vibe);

    if (this.secretTimeoutId) {
      clearTimeout(this.secretTimeoutId);
    }

    this.secretTimeoutId = setTimeout(() => {
      this.secretToastOpen = false;
    }, 3000);
  }

  private goToStep(index: number): void {
    if (index < 0 || index >= this.chapters.length) {
      return;
    }

    this.step = index;
    this.backpackOpen = false;
    this.handleRoomEntry(this.current);
  }

  private handleRoomEntry(chapter: Chapter): void {
    const firstVisit = this.markVisited(chapter);
    this.openZoneIntro(chapter);
    this.audio.playZoneCue(chapter.vibe);

    if (firstVisit) {
      this.scheduleRelicReward(chapter);
    }
  }

  private markVisited(chapter: Chapter): boolean {
    const firstVisit = !this.visitedIds.has(chapter.id);
    this.visitedIds.add(chapter.id);
    this.archiveFocusId = chapter.id;
    return firstVisit;
  }

  private openZoneIntro(chapter: Chapter): void {
    this.introChapter = chapter;
    this.zoneIntroOpen = true;

    if (this.introTimeoutId) {
      clearTimeout(this.introTimeoutId);
    }

    this.introTimeoutId = setTimeout(() => {
      this.zoneIntroOpen = false;
    }, 1750);
  }

  private scheduleRelicReward(chapter: Chapter): void {
    if (this.rewardDelayTimeoutId) {
      clearTimeout(this.rewardDelayTimeoutId);
    }

    this.rewardDelayTimeoutId = setTimeout(() => {
      this.openRelicReward(chapter);
    }, 760);
  }

  private openRelicReward(chapter: Chapter): void {
    this.rewardChapter = chapter;
    this.relicRewardOpen = true;

    if (this.rewardTimeoutId) {
      clearTimeout(this.rewardTimeoutId);
    }

    this.rewardTimeoutId = setTimeout(() => {
      this.relicRewardOpen = false;
    }, 2800);
  }

  private buildPlayerTitle(): string {
    if (this.totalEventsCompleted === this.chapters.length && this.totalSecretsFound === this.chapters.length) {
      return 'CURADOR LEGENDARIO';
    }

    if (this.totalEventsCompleted === this.chapters.length) {
      return 'ARQUITECTO DEL RECORRIDO';
    }

    if (this.totalSecretsFound >= Math.ceil(this.chapters.length / 2)) {
      return 'DECODIFICADOR DEL HOLLOW';
    }

    return 'EXPLORADOR DEL ARCHIVO';
  }

  private buildFinalMessage(): string {
    if (this.totalEventsCompleted === this.chapters.length && this.totalSecretsFound === this.chapters.length) {
      return 'No solo recorriste el museo: activaste cada sala, descifraste sus rutas ocultas y convertiste la página en una run completa de verdad.';
    }

    if (this.totalEventsCompleted === this.chapters.length) {
      return 'Dejaste cada sala encendida. El recorrido ya no se siente como lectura guiada, sino como una secuencia de momentos que sí ocurrieron en tus manos.';
    }

    if (this.totalSecretsFound >= Math.ceil(this.chapters.length / 2)) {
      return 'Viste más de la capa visible. Entre reliquias, rutas escondidas y ecos modernos, la run ya tiene huella propia.';
    }

    return 'Cerraste la ruta principal con el archivo intacto y suficiente memoria para volver distinto en la siguiente vuelta.';
  }

  private get furthestUnlockedIndex(): number {
    return this.chapters.reduce((furthest, chapter, index) => (
      this.visitedIds.has(chapter.id) ? index : furthest
    ), 0);
  }
}
