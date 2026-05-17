import { Injectable } from '@angular/core';

export interface CharacterOption {
  id: string;
  label: string;
  preview: string;
  secondary?: string;
}

export interface CharacterConfig {
  hair: string;
  outfit: string;
  skin: string;
  customized: boolean;
}

type Rect = [number, number, number, number];

interface HairStyle extends CharacterOption {
  main: string;
  shadow: string;
  shape: 'mural' | 'bob' | 'pony' | 'curls' | 'spikes';
}

interface OutfitStyle extends CharacterOption {
  main: string;
  shadow: string;
  accent: string;
  trim: string;
  pants: string;
  pantsShadow: string;
  boots: string;
  bootsHighlight: string;
  silhouette: 'coat' | 'hoodie' | 'armor' | 'bomber' | 'robe';
}

interface SkinTone extends CharacterOption {
  base: string;
  shadow: string;
}

interface ResolvedHero {
  hair: HairStyle;
  outfit: OutfitStyle;
  skin: SkinTone;
  customized: boolean;
}

@Injectable({ providedIn: 'root' })
export class SpriteService {
  private readonly sansSpritePath = 'assets/sans-sprite.png';
  private readonly sansPortraitPath = 'assets/sans-portrait.png';
  private readonly outline = '#121018';
  private readonly face = '#17141d';
  private readonly eye = '#f8f5ed';
  private readonly blush = '#e59b87';

  private readonly hairStyles: HairStyle[] = [
    { id: 'mural-fringe', label: 'Fleco Del Mural', preview: '#17131d', secondary: '#2b2433', main: '#17131d', shadow: '#2b2433', shape: 'mural' },
    { id: 'moon-bob', label: 'Bob Lunar', preview: '#d6d5df', secondary: '#9fa0b2', main: '#d6d5df', shadow: '#9fa0b2', shape: 'bob' },
    { id: 'comet-pony', label: 'Cola Cometa', preview: '#a25b36', secondary: '#6c341e', main: '#a25b36', shadow: '#6c341e', shape: 'pony' },
    { id: 'solar-curls', label: 'Rizos Solar', preview: '#d9a34b', secondary: '#8d5b21', main: '#d9a34b', shadow: '#8d5b21', shape: 'curls' },
    { id: 'neon-spikes', label: 'Puntas Neon', preview: '#2fddcf', secondary: '#107f78', main: '#2fddcf', shadow: '#107f78', shape: 'spikes' }
  ];

  private readonly outfitStyles: OutfitStyle[] = [
    {
      id: 'ruins-jacket',
      label: 'Chaqueta Ruins',
      preview: '#24386f',
      secondary: '#bb1d56',
      main: '#24386f',
      shadow: '#111a37',
      accent: '#bb1d56',
      trim: '#f1cc6c',
      pants: '#232742',
      pantsShadow: '#121527',
      boots: '#8d6448',
      bootsHighlight: '#c59b76',
      silhouette: 'coat'
    },
    {
      id: 'echo-hoodie',
      label: 'Hoodie Echo',
      preview: '#28737d',
      secondary: '#9df6e4',
      main: '#28737d',
      shadow: '#123744',
      accent: '#9df6e4',
      trim: '#eff9f4',
      pants: '#26304d',
      pantsShadow: '#13192a',
      boots: '#6d6c8f',
      bootsHighlight: '#b5b3d2',
      silhouette: 'hoodie'
    },
    {
      id: 'neon-guard',
      label: 'Guardia Neon',
      preview: '#8d2b42',
      secondary: '#ff7ca5',
      main: '#8d2b42',
      shadow: '#4d1220',
      accent: '#ff7ca5',
      trim: '#f7dfe5',
      pants: '#2a1f34',
      pantsShadow: '#140e1a',
      boots: '#8b3b4c',
      bootsHighlight: '#c76577',
      silhouette: 'armor'
    },
    {
      id: 'moss-runner',
      label: 'Runner Moss',
      preview: '#2f6548',
      secondary: '#a7d974',
      main: '#2f6548',
      shadow: '#163424',
      accent: '#a7d974',
      trim: '#edf8d2',
      pants: '#242d25',
      pantsShadow: '#121610',
      boots: '#71593c',
      bootsHighlight: '#c59a69',
      silhouette: 'bomber'
    },
    {
      id: 'starlight-robe',
      label: 'Robe Starlight',
      preview: '#594ab0',
      secondary: '#68ddff',
      main: '#594ab0',
      shadow: '#291f63',
      accent: '#68ddff',
      trim: '#f4c95f',
      pants: '#1d1640',
      pantsShadow: '#0b071b',
      boots: '#5e4b88',
      bootsHighlight: '#9b88c8',
      silhouette: 'robe'
    }
  ];

  private readonly skinTones: SkinTone[] = [
    { id: 'porcelain', label: 'Porcelana', preview: '#f1d9c7', secondary: '#cea892', base: '#f1d9c7', shadow: '#cea892' },
    { id: 'miel', label: 'Miel', preview: '#ddb387', secondary: '#b68258', base: '#ddb387', shadow: '#b68258' },
    { id: 'canela', label: 'Canela', preview: '#bc875f', secondary: '#915f3d', base: '#bc875f', shadow: '#915f3d' },
    { id: 'cobre', label: 'Cobre', preview: '#955f45', secondary: '#6b3d2b', base: '#955f45', shadow: '#6b3d2b' },
    { id: 'ebano', label: 'Ebano', preview: '#704435', secondary: '#4f291f', base: '#704435', shadow: '#4f291f' }
  ];

  readonly hairOptions: CharacterOption[] = this.hairStyles.map(({ id, label, preview, secondary }) => ({
    id,
    label,
    preview,
    secondary
  }));

  readonly outfitOptions: CharacterOption[] = this.outfitStyles.map(({ id, label, preview, secondary }) => ({
    id,
    label,
    preview,
    secondary
  }));

  readonly skinOptions: CharacterOption[] = this.skinTones.map(({ id, label, preview, secondary }) => ({
    id,
    label,
    preview,
    secondary
  }));

  private readonly defaultHeroConfig: CharacterConfig = {
    hair: 'mural-fringe',
    outfit: 'ruins-jacket',
    skin: 'miel',
    customized: false
  };

  private selectedHero: CharacterConfig | null = null;
  private cache = new Map<string, string>();

  private drawPattern(key: string, pattern: string[], palette: Record<string, string>, scale = 8): string {
    const cacheKey = `${key}-${scale}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const height = pattern.length;
    const width = Math.max(...pattern.map((row) => row.length));
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }

    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < height; y++) {
      const row = pattern[y].padEnd(width, '.');
      for (let x = 0; x < width; x++) {
        const pixel = row[x];
        const color = palette[pixel];
        if (!color) {
          continue;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    }

    const sprite = canvas.toDataURL('image/png');
    this.cache.set(cacheKey, sprite);
    return sprite;
  }

  getHeroDraft(): CharacterConfig {
    return { ...(this.selectedHero ?? this.defaultHeroConfig) };
  }

  setHeroCharacter(config: CharacterConfig): void {
    this.selectedHero = {
      hair: config.hair,
      outfit: config.outfit,
      skin: config.skin,
      customized: true
    };
  }

  useDefaultHero(): void {
    this.selectedHero = null;
  }

  isCustomHero(): boolean {
    return !!this.selectedHero;
  }

  heroSprite(scale = 8): string {
    const hero = this.resolveHero();
    const key = `hero-${hero.hair.id}-${hero.outfit.id}-${hero.skin.id}-${hero.customized ? 'custom' : 'default'}-${scale}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const sprite = this.drawHeroCanvas(hero, scale);
    this.cache.set(key, sprite);
    return sprite;
  }

  guideSprite(_scale = 8): string {
    return this.sansSpritePath;
  }

  heroPortrait(scale = 10): string {
    const hero = this.resolveHero();
    const key = `hero-portrait-${hero.hair.id}-${hero.outfit.id}-${hero.skin.id}-${hero.customized ? 'custom' : 'default'}-${scale}`;
    const cached = this.cache.get(key);
    if (cached) {
      return cached;
    }

    const portrait = this.drawHeroPortraitCanvas(hero, scale);
    this.cache.set(key, portrait);
    return portrait;
  }

  guidePortrait(): string {
    return this.sansPortraitPath;
  }

  saveStar(scale = 8): string {
    const palette = {
      g: '#f6c85d',
      y: '#fff2b5'
    };
    const pattern = [
      '......g......',
      '.....ggy.....',
      '....ggyyy....',
      'g..ggyyyyg..g',
      '.ggyyyyyyygg.',
      '..ggyyyyygg..',
      '...ggyyygg...',
      '..ggyyyyygg..',
      '.ggyyyyyyygg.',
      'g..ggyyyyg..g',
      '....ggyyy....',
      '.....ggy.....',
      '......g......'
    ];
    return this.drawPattern('save-star', pattern, palette, scale);
  }

  arcadeCabinet(scale = 8): string {
    const palette = {
      o: '#16110f',
      c: '#6e2a38',
      r: '#c34973',
      w: '#74efff',
      b: '#2f7cf6',
      d: '#37242d'
    };
    const pattern = [
      '....oooooooo....',
      '...occcccccco...',
      '..occcccccccco..',
      '..ocrrwwwrrcco..',
      '..ocrrwwwrrcco..',
      '..occcccccccco..',
      '..ocbbccbbccco..',
      '..occcccccccco..',
      '..ocdcccccdcco..',
      '..ocdcccccdcco..',
      '..ocdcccccdcco..',
      '..ocdcccccdcco..',
      '..ocdcccccdcco..',
      '..ocdcccccdcco..',
      '..occcccccccco..',
      '...occcccccco...',
      '....oo....oo....'
    ];
    return this.drawPattern('arcade', pattern, palette, scale);
  }

  orb(tone: 'gold' | 'cyan' | 'rose' | 'lime', scale = 8): string {
    const palettes = {
      gold: { m: '#f6c85d', c: '#fff1aa' },
      cyan: { m: '#65dbff', c: '#d4fbff' },
      rose: { m: '#ff6f97', c: '#ffd6e2' },
      lime: { m: '#98ef6c', c: '#f0ffd1' }
    };
    const pattern = [
      '....mmm....',
      '..mmmmmmm..',
      '.mmmmmmmmm.',
      '.mmmcccmmm.',
      'mmmcccccmmm',
      'mmmcccccmmm',
      '.mmmcccmmm.',
      '.mmmmmmmmm.',
      '..mmmmmmm..',
      '....mmm....'
    ];
    return this.drawPattern(`orb-${tone}`, pattern, palettes[tone], scale);
  }

  private resolveHero(): ResolvedHero {
    const config = this.selectedHero ?? this.defaultHeroConfig;

    return {
      hair: this.hairStyles.find((item) => item.id === config.hair) ?? this.hairStyles[0],
      outfit: this.outfitStyles.find((item) => item.id === config.outfit) ?? this.outfitStyles[0],
      skin: this.skinTones.find((item) => item.id === config.skin) ?? this.skinTones[0],
      customized: !!this.selectedHero
    };
  }

  private drawHeroCanvas(hero: ResolvedHero, scale: number): string {
    const canvas = this.createHeroCanvas(hero, scale);
    return canvas?.toDataURL('image/png') ?? '';
  }

  private drawHeroPortraitCanvas(hero: ResolvedHero, scale: number): string {
    const source = this.createHeroCanvas(hero, scale);
    if (!source) {
      return '';
    }

    const cropX = 2 * scale;
    const cropY = 0;
    const cropSize = 24 * scale;
    const canvas = document.createElement('canvas');
    canvas.width = cropSize;
    canvas.height = cropSize;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, cropX, cropY, cropSize, cropSize, 0, 0, cropSize, cropSize);

    return canvas.toDataURL('image/png');
  }

  private createHeroCanvas(hero: ResolvedHero, scale: number): HTMLCanvasElement | null {
    const canvas = document.createElement('canvas');
    canvas.width = 28 * scale;
    canvas.height = 40 * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }

    ctx.imageSmoothingEnabled = false;

    const paint = (color: string, rects: Rect[]): void => {
      ctx.fillStyle = color;
      for (const [x, y, width, height] of rects) {
        ctx.fillRect(x * scale, y * scale, width * scale, height * scale);
      }
    };

    const dots = (color: string, points: Array<[number, number]>): void => {
      ctx.fillStyle = color;
      for (const [x, y] of points) {
        ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    };

    this.drawLegs(hero, paint);
    this.drawTorso(hero, paint);
    this.drawHead(hero, paint, dots);
    this.drawHair(hero, paint);
    this.drawFace(hero, paint, dots);

    return canvas;
  }

  private drawLegs(hero: ResolvedHero, paint: (color: string, rects: Rect[]) => void): void {
    paint(this.outline, [
      [10, 27, 4, 10],
      [14, 27, 4, 10],
      [8, 35, 7, 4],
      [13, 35, 7, 4]
    ]);

    paint(hero.outfit.pantsShadow, [
      [10, 28, 3, 7],
      [15, 28, 3, 7]
    ]);

    paint(hero.outfit.pants, [
      [11, 28, 2, 7],
      [16, 28, 2, 7],
      [10, 35, 3, 1],
      [15, 35, 3, 1]
    ]);

    paint(hero.outfit.boots, [
      [9, 36, 5, 2],
      [14, 36, 5, 2],
      [10, 38, 4, 1],
      [15, 38, 4, 1]
    ]);

    paint(hero.outfit.bootsHighlight, [
      [10, 36, 3, 1],
      [15, 36, 3, 1]
    ]);
  }

  private drawTorso(hero: ResolvedHero, paint: (color: string, rects: Rect[]) => void): void {
    paint(this.outline, [
      [3, 15, 4, 12],
      [21, 15, 4, 12],
      [6, 15, 16, 13],
      [4, 24, 4, 4],
      [20, 24, 4, 4],
      [12, 13, 4, 2]
    ]);

    paint(hero.skin.shadow, [
      [5, 25, 2, 2],
      [21, 25, 2, 2]
    ]);

    paint(hero.skin.base, [
      [5, 24, 2, 2],
      [21, 24, 2, 2],
      [13, 13, 2, 2]
    ]);

    paint(hero.outfit.shadow, [
      [4, 16, 3, 9],
      [21, 16, 3, 9],
      [7, 16, 14, 11]
    ]);

    paint(hero.outfit.main, [
      [5, 16, 2, 8],
      [21, 16, 2, 8],
      [8, 16, 12, 10]
    ]);

    switch (hero.outfit.silhouette) {
      case 'coat':
        paint(hero.outfit.accent, [
          [5, 18, 2, 6],
          [21, 18, 2, 6],
          [10, 19, 8, 2]
        ]);
        paint(hero.outfit.trim, [
          [10, 17, 8, 1],
          [11, 21, 6, 1]
        ]);
        paint(hero.outfit.shadow, [
          [7, 24, 2, 4],
          [19, 24, 2, 4]
        ]);
        break;
      case 'hoodie':
        paint(hero.outfit.shadow, [
          [7, 14, 3, 4],
          [18, 14, 3, 4],
          [10, 24, 8, 2]
        ]);
        paint(hero.outfit.accent, [
          [11, 18, 6, 1],
          [11, 22, 6, 1]
        ]);
        paint(hero.outfit.trim, [
          [12, 19, 1, 4],
          [15, 19, 1, 4]
        ]);
        break;
      case 'armor':
        paint(hero.outfit.shadow, [
          [6, 16, 3, 3],
          [19, 16, 3, 3],
          [9, 21, 10, 2]
        ]);
        paint(hero.outfit.accent, [
          [10, 17, 8, 3],
          [11, 23, 6, 1]
        ]);
        paint(hero.outfit.trim, [
          [11, 18, 6, 1],
          [10, 24, 8, 1]
        ]);
        break;
      case 'bomber':
        paint(hero.outfit.accent, [
          [9, 18, 10, 1],
          [10, 24, 8, 1]
        ]);
        paint(hero.outfit.trim, [
          [11, 16, 6, 1],
          [8, 21, 12, 1]
        ]);
        paint(hero.outfit.shadow, [
          [5, 23, 2, 2],
          [21, 23, 2, 2]
        ]);
        break;
      case 'robe':
        paint(hero.outfit.shadow, [
          [7, 24, 3, 7],
          [18, 24, 3, 7]
        ]);
        paint(hero.outfit.main, [
          [9, 24, 3, 6],
          [16, 24, 3, 6]
        ]);
        paint(hero.outfit.accent, [
          [10, 19, 8, 1],
          [11, 23, 6, 1]
        ]);
        paint(hero.outfit.trim, [
          [10, 17, 8, 1]
        ]);
        break;
    }
  }

  private drawHead(
    hero: ResolvedHero,
    paint: (color: string, rects: Rect[]) => void,
    dots: (color: string, points: Array<[number, number]>) => void
  ): void {
    paint(this.outline, [
      [10, 1, 8, 1],
      [9, 2, 10, 1],
      [8, 3, 12, 9],
      [9, 12, 10, 1],
      [10, 13, 8, 1],
      [8, 6, 1, 3],
      [19, 6, 1, 3]
    ]);

    paint(hero.skin.shadow, [
      [10, 2, 8, 1],
      [9, 3, 10, 8],
      [10, 11, 8, 1],
      [8, 7, 1, 1],
      [19, 7, 1, 1]
    ]);

    paint(hero.skin.base, [
      [11, 2, 6, 1],
      [10, 3, 8, 6],
      [11, 9, 6, 2],
      [12, 11, 4, 1]
    ]);

    dots(this.blush, [
      [10, 9],
      [17, 9]
    ]);
  }

  private drawHair(hero: ResolvedHero, paint: (color: string, rects: Rect[]) => void): void {
    switch (hero.hair.shape) {
      case 'mural':
        paint(this.outline, [
          [10, 0, 8, 2],
          [9, 2, 10, 2],
          [8, 4, 4, 3],
          [12, 3, 8, 4],
          [9, 7, 3, 2],
          [16, 6, 4, 3]
        ]);
        paint(hero.hair.shadow, [
          [10, 1, 8, 1],
          [9, 3, 4, 2],
          [13, 3, 6, 3],
          [9, 7, 2, 1],
          [17, 6, 2, 2]
        ]);
        paint(hero.hair.main, [
          [11, 1, 6, 1],
          [10, 3, 3, 1],
          [13, 3, 5, 2],
          [10, 6, 2, 1],
          [16, 5, 2, 2]
        ]);
        break;
      case 'bob':
        paint(this.outline, [
          [9, 0, 10, 2],
          [8, 2, 12, 2],
          [7, 4, 14, 5],
          [8, 9, 12, 2]
        ]);
        paint(hero.hair.shadow, [
          [9, 1, 10, 1],
          [8, 3, 12, 1],
          [8, 4, 4, 4],
          [12, 4, 8, 5],
          [9, 9, 10, 1]
        ]);
        paint(hero.hair.main, [
          [10, 1, 8, 1],
          [9, 3, 10, 1],
          [9, 4, 3, 3],
          [12, 4, 6, 4],
          [10, 8, 8, 1]
        ]);
        break;
      case 'pony':
        paint(this.outline, [
          [10, 0, 8, 2],
          [9, 2, 10, 2],
          [9, 4, 8, 3],
          [18, 4, 4, 7],
          [20, 10, 2, 2]
        ]);
        paint(hero.hair.shadow, [
          [10, 1, 8, 1],
          [9, 3, 10, 1],
          [10, 4, 7, 2],
          [19, 5, 2, 5]
        ]);
        paint(hero.hair.main, [
          [11, 1, 6, 1],
          [10, 3, 8, 1],
          [11, 4, 5, 2],
          [20, 6, 1, 4]
        ]);
        break;
      case 'curls':
        paint(this.outline, [
          [10, 0, 3, 2],
          [14, 0, 3, 2],
          [8, 2, 12, 3],
          [7, 5, 5, 4],
          [16, 5, 5, 4]
        ]);
        paint(hero.hair.shadow, [
          [10, 1, 3, 1],
          [14, 1, 3, 1],
          [9, 2, 10, 2],
          [8, 5, 3, 3],
          [17, 5, 3, 3]
        ]);
        paint(hero.hair.main, [
          [10, 2, 8, 1],
          [9, 3, 10, 1],
          [9, 5, 2, 2],
          [17, 5, 2, 2]
        ]);
        break;
      case 'spikes':
        paint(this.outline, [
          [11, 0, 2, 2],
          [14, 0, 2, 2],
          [9, 2, 10, 2],
          [8, 4, 4, 4],
          [12, 3, 8, 4]
        ]);
        paint(hero.hair.shadow, [
          [11, 1, 2, 1],
          [14, 1, 2, 1],
          [9, 3, 3, 1],
          [12, 3, 7, 2],
          [9, 5, 2, 2]
        ]);
        paint(hero.hair.main, [
          [10, 2, 2, 1],
          [13, 2, 2, 1],
          [11, 3, 2, 1],
          [15, 3, 2, 1],
          [10, 5, 8, 1]
        ]);
        break;
    }
  }

  private drawFace(
    hero: ResolvedHero,
    paint: (color: string, rects: Rect[]) => void,
    dots: (color: string, points: Array<[number, number]>) => void
  ): void {
    if (hero.hair.shape === 'mural') {
      paint(hero.outfit.trim, [[10, 7, 8, 2]]);
      dots(this.face, [
        [11, 8],
        [12, 8],
        [15, 8],
        [16, 8],
        [13, 10],
        [14, 10]
      ]);
      return;
    }

    dots(this.face, [
      [11, 7],
      [16, 7],
      [13, 8],
      [12, 10],
      [13, 10],
      [14, 10],
      [15, 10]
    ]);

    dots(this.eye, [
      [12, 7],
      [15, 7]
    ]);
  }
}
