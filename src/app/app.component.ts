import { Component, OnInit } from '@angular/core';
import { CharacterConfig, CharacterOption, SpriteService } from './sprite.service';
import { GAME_CHAPTERS, RunReport } from './story.models';

type Screen = 'splash' | 'creator' | 'game' | 'end';
type CreatorCategory = 'outfit' | 'hair' | 'skin';

interface CreatorCategoryItem {
  id: CreatorCategory;
  label: string;
  short: string;
  eyebrow: string;
  description: string;
}

interface LandingFeature {
  eyebrow: string;
  title: string;
  copy: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  hairOptions: CharacterOption[] = [];
  outfitOptions: CharacterOption[] = [];
  skinOptions: CharacterOption[] = [];
  screen: Screen = 'splash';
  activeCategory: CreatorCategory = 'outfit';
  heroPreview = '';
  guidePreview = '';
  heroStatus = 'Predeterminado';
  lastRunReport: RunReport | null = null;
  readonly routePreview = GAME_CHAPTERS;
  readonly landingFeatures: LandingFeature[] = [
    {
      eyebrow: 'SISTEMA',
      title: 'Archivo desbloqueable',
      copy: 'Cada zona deja una reliquia, una idea fuerte y una pista para seguir leyendo el medio.'
    },
    {
      eyebrow: 'RITMO',
      title: 'Mapa con progresion',
      copy: 'La ruta avanza como una expedicion: entras, registras, vuelves y conectas lo que viste.'
    },
    {
      eyebrow: 'IDENTIDAD',
      title: 'Build + museo',
      copy: 'Personaje, terminal y cierre trabajan juntos para que la pagina tenga mundo propio.'
    }
  ];
  readonly creatorCategories: CreatorCategoryItem[] = [
    {
      id: 'outfit',
      label: 'Ropa',
      short: 'R',
      eyebrow: 'Armadura y estilo',
      description: 'Define la silueta principal de Ghost. Aqu\u00ed cambias chaqueta, hoodie, t\u00fanica o variantes de combate.'
    },
    {
      id: 'hair',
      label: 'Pelo',
      short: 'P',
      eyebrow: 'Cabello y presencia',
      description: 'Elige el peinado que marca la personalidad visual del personaje: limpio, raro, agresivo o luminoso.'
    },
    {
      id: 'skin',
      label: 'Piel',
      short: 'S',
      eyebrow: 'Tono de piel',
      description: 'Ajusta el tono base del personaje para dejar la versi\u00f3n final lista antes de entrar al recorrido.'
    }
  ];
  draft: CharacterConfig = {
    hair: 'mural-fringe',
    outfit: 'ruins-jacket',
    skin: 'miel',
    customized: false
  };

  constructor(private sprite: SpriteService) {}

  ngOnInit(): void {
    this.hairOptions = this.sprite.hairOptions;
    this.outfitOptions = this.sprite.outfitOptions;
    this.skinOptions = this.sprite.skinOptions;
    this.guidePreview = this.sprite.guideSprite();
    this.syncCreator();
  }

  start(): void {
    this.screen = 'game';
  }

  openCreator(): void {
    this.screen = 'creator';
  }

  closeCreator(): void {
    this.screen = 'splash';
  }

  finish(report: RunReport): void {
    this.lastRunReport = report;
    this.screen = 'end';
  }

  restart(): void {
    this.screen = 'splash';
  }

  get heroBuildSummary(): string {
    return `${this.currentOutfitLabel} / ${this.currentHairLabel} / ${this.currentSkinLabel}`;
  }

  get clearedZonesLabel(): string {
    const count = this.lastRunReport?.visitedZones.length ?? 0;
    return `${count}/${this.routePreview.length}`;
  }

  get relicCountLabel(): string {
    return `${this.lastRunReport?.relicsUnlocked.length ?? 0}`;
  }

  get secretCountLabel(): string {
    return `${this.lastRunReport?.secretFinds.length ?? 0}`;
  }

  get eventCountLabel(): string {
    return `${this.lastRunReport?.eventsCompleted.length ?? 0}`;
  }

  get finalRunTitle(): string {
    return this.lastRunReport?.playerTitle ?? 'EXPLORADOR DEL ARCHIVO';
  }

  get finalRunMessage(): string {
    return this.lastRunReport?.finalMessage ??
      'El recorrido quedó completo, pero aún guarda capas para otra vuelta.';
  }

  get finalRunCardLine(): string {
    return [
      this.finalRunTitle,
      `${this.clearedZonesLabel} ZONAS`,
      `${this.relicCountLabel} RELIQUIAS`,
      `${this.secretCountLabel} SECRETOS`
    ].join(' // ');
  }

  get finalZoneLabel(): string {
    const id = this.lastRunReport?.finalChapterId;
    return this.routePreview.find((chapter) => chapter.id === id)?.zone ?? 'ARCHIVO FINAL';
  }

  get hasPerfectArchive(): boolean {
    return (this.lastRunReport?.secretFinds.length ?? 0) === this.routePreview.length &&
      (this.lastRunReport?.eventsCompleted.length ?? 0) === this.routePreview.length;
  }

  selectHair(id: string): void {
    this.updateDraft({ hair: id });
  }

  selectOutfit(id: string): void {
    this.updateDraft({ outfit: id });
  }

  selectSkin(id: string): void {
    this.updateDraft({ skin: id });
  }

  useDefaultHero(): void {
    this.sprite.useDefaultHero();
    this.syncCreator();
  }

  setCreatorCategory(category: CreatorCategory): void {
    this.activeCategory = category;
  }

  selectCreatorOption(id: string): void {
    switch (this.activeCategory) {
      case 'hair':
        this.selectHair(id);
        break;
      case 'skin':
        this.selectSkin(id);
        break;
      default:
        this.selectOutfit(id);
        break;
    }
  }

  get currentCreatorCategory(): CreatorCategoryItem {
    return this.creatorCategories.find((item) => item.id === this.activeCategory) ?? this.creatorCategories[0];
  }

  get currentCreatorOptions(): CharacterOption[] {
    switch (this.activeCategory) {
      case 'hair':
        return this.hairOptions;
      case 'skin':
        return this.skinOptions;
      default:
        return this.outfitOptions;
    }
  }

  get currentHairLabel(): string {
    return this.hairOptions.find((option) => option.id === this.draft.hair)?.label ?? 'Sin cambio';
  }

  get currentOutfitLabel(): string {
    return this.outfitOptions.find((option) => option.id === this.draft.outfit)?.label ?? 'Sin cambio';
  }

  get currentSkinLabel(): string {
    return this.skinOptions.find((option) => option.id === this.draft.skin)?.label ?? 'Sin cambio';
  }

  isCreatorOptionActive(id: string): boolean {
    switch (this.activeCategory) {
      case 'hair':
        return this.draft.hair === id;
      case 'skin':
        return this.draft.skin === id;
      default:
        return this.draft.outfit === id;
    }
  }

  private updateDraft(partial: Partial<CharacterConfig>): void {
    this.draft = {
      ...this.draft,
      ...partial,
      customized: true
    };
    this.sprite.setHeroCharacter(this.draft);
    this.syncCreator();
  }

  private syncCreator(): void {
    this.draft = this.sprite.getHeroDraft();
    this.heroPreview = this.sprite.heroSprite(10);
    this.heroStatus = this.sprite.isCustomHero() ? 'Personalizado' : 'Predeterminado';
  }
}
