import { Component, OnInit } from '@angular/core';
import { CharacterConfig, CharacterOption, SpriteService } from './sprite.service';

type Screen = 'splash' | 'game' | 'end';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  hairOptions: CharacterOption[] = [];
  outfitOptions: CharacterOption[] = [];
  skinOptions: CharacterOption[] = [];
  screen: Screen = 'splash';
  heroPreview = '';
  guidePreview = '';
  heroStatus = 'Predeterminado';
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

  finish(): void {
    this.screen = 'end';
  }

  restart(): void {
    this.screen = 'splash';
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
    this.heroPreview = this.sprite.heroSprite(9);
    this.heroStatus = this.sprite.isCustomHero() ? 'Personalizado' : 'Predeterminado';
  }
}
