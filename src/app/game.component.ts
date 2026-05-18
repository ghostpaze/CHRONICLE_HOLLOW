import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpriteService } from './sprite.service';
import { Chapter } from './story.models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit {
  @Output() onFinish = new EventEmitter<void>();

  step = 0;
  chapters: Chapter[] = [
    {
      id: 'proto-room',
      zone: 'PROTO ROOM',
      title: 'El chispazo inicial',
      subtitle: 'Los primeros experimentos digitales',
      objective: 'Encontrar el origen del juego interactivo.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* Al principio no hab\u00eda sagas ni trailers. Solo laboratorios, osciloscopios y gente descubriendo que una pantalla tambi\u00e9n pod\u00eda jugar contigo.',
      summary:
        'La historia de los videojuegos arranca como experimento t\u00e9cnico y termina convirti\u00e9ndose en un nuevo lenguaje creativo.',
      learnings: [
        'Tennis for Two y Spacewar! demostraron que la interacci\u00f3n pod\u00eda ser espect\u00e1culo.',
        'Pong populariz\u00f3 el videojuego como producto comercial y ritual de arcade.',
        'Las bases tempranas fueron reglas claras, respuesta inmediata y repetici\u00f3n adictiva.'
      ],
      spotlight: [
        { label: 'A\u00f1o clave', value: '1972', tone: 'gold' },
        { label: 'Motor', value: 'Curiosidad', tone: 'cyan' },
        { label: 'Impacto', value: 'Nacimiento comercial', tone: 'violet' }
      ],
      vibe: 'violet'
    },
    {
      id: 'arcade-core',
      zone: 'ARCADE CORE',
      title: 'La sala de los reflejos',
      subtitle: 'Arcades, cultura y high scores',
      objective: 'Sentir por qu\u00e9 jugar se volvi\u00f3 social y competitivo.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* Una moneda, tres vidas y medio sal\u00f3n mir\u00e1ndote. Los arcades no vend\u00edan solo tiempo: vend\u00edan tensi\u00f3n, ruido y reputaci\u00f3n.',
      summary:
        'En los arcades el videojuego se volvi\u00f3 espect\u00e1culo compartido, comunidad y reto p\u00fablico.',
      learnings: [
        'Cabinas como Pac-Man, Donkey Kong y Space Invaders convirtieron el puntaje en estatus.',
        'Las partidas eran cortas e intensas para invitar a volver una y otra vez.',
        'Muchos g\u00e9neros modernos heredan el ritmo, la claridad y la lectura visual del arcade.'
      ],
      spotlight: [
        { label: 'Clave', value: 'High score', tone: 'rose' },
        { label: 'Dise\u00f1o', value: 'Sesiones cortas', tone: 'gold' },
        { label: 'Sensaci\u00f3n', value: 'Presi\u00f3n social', tone: 'cyan' }
      ],
      vibe: 'rose'
    },
    {
      id: 'home-port',
      zone: 'HOME PORT',
      title: 'La consola entra a casa',
      subtitle: 'Nintendo, Sega, PlayStation y compa\u00f1\u00eda',
      objective: 'Entender c\u00f3mo cambi\u00f3 el videojuego al llegar al hogar.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Cuando las consolas entraron a la sala, jugar dej\u00f3 de ser una visita ocasional. Se volvi\u00f3 rutina, colecci\u00f3n y memoria familiar.',
      summary:
        'El salto al hogar ampli\u00f3 duraci\u00f3n, narrativa y apego emocional: ya no era solo sobrevivir, tambi\u00e9n explorar mundos.',
      learnings: [
        'Las consolas hicieron posible progresar durante semanas y no solo minutos.',
        'Las franquicias crecieron porque ahora hab\u00eda tiempo para personajes, mapas y secuelas.',
        'La consola tambi\u00e9n cambi\u00f3 la forma de compartir: sof\u00e1, mandos y partidas en casa.'
      ],
      spotlight: [
        { label: 'Cambio', value: 'Juego dom\u00e9stico', tone: 'gold' },
        { label: 'Resultado', value: 'Franquicias ic\u00f3nicas', tone: 'cyan' },
        { label: 'Memoria', value: 'Cultura de sala', tone: 'violet' }
      ],
      vibe: 'gold'
    },
    {
      id: 'genre-vault',
      zone: 'GENRE VAULT',
      title: 'La b\u00f3veda de g\u00e9neros',
      subtitle: 'C\u00f3mo cambian las emociones seg\u00fan las reglas',
      objective: 'Detectar qu\u00e9 hace \u00fanico a cada tipo de juego.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Plataformas, RPG, shooters, puzzles, survival horror. Cada g\u00e9nero es una promesa distinta sobre lo que vas a sentir.',
      summary:
        'Los g\u00e9neros no son cajas r\u00edgidas: son formas de organizar ritmo, desaf\u00edo, exploraci\u00f3n y narrativa.',
      learnings: [
        'Los plataformas hablan de movimiento y precisi\u00f3n.',
        'Los RPG priorizan crecimiento, decisiones y mundos persistentes.',
        'Los puzzles y survival horror manipulan informaci\u00f3n, tensi\u00f3n y anticipaci\u00f3n.'
      ],
      spotlight: [
        { label: 'Idea central', value: 'Reglas = emoci\u00f3n', tone: 'lime' },
        { label: 'Ejemplo', value: 'RPG, FPS, puzzle', tone: 'cyan' },
        { label: 'Lectura', value: 'H\u00edbridos por todos lados', tone: 'rose' }
      ],
      vibe: 'lime'
    },
    {
      id: 'metroid-depths',
      zone: 'METROID DEPTHS',
      title: 'El laberinto metroidvania',
      subtitle: 'Mapa interconectado, memoria y regreso',
      objective: 'Aprender por qu\u00e9 este g\u00e9nero se siente tan absorbente.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* Ahora s\u00ed, el plato fuerte. Un metroidvania te deja perderte a prop\u00f3sito y luego te recompensa por recordar una puerta que antes no pod\u00edas abrir.',
      summary:
        'El metroidvania mezcla exploraci\u00f3n, bloqueo elegante y sensaci\u00f3n constante de descubrimiento.',
      learnings: [
        'El mapa interconectado convierte el espacio en un rompecabezas de memoria.',
        'Cada habilidad nueva reescribe lugares viejos y abre rutas escondidas.',
        'La satisfacci\u00f3n viene de notar conexiones, no solo de derrotar enemigos.'
      ],
      spotlight: [
        { label: 'Coraz\u00f3n', value: 'Backtracking con sentido', tone: 'cyan' },
        { label: 'Dise\u00f1o', value: 'Gating por habilidades', tone: 'gold' },
        { label: 'Resultado', value: 'Exploraci\u00f3n obsesiva', tone: 'violet' }
      ],
      vibe: 'cyan'
    },
    {
      id: 'indie-forge',
      zone: 'INDIE FORGE',
      title: 'La fragua indie',
      subtitle: 'Equipos peque\u00f1os, ideas gigantes',
      objective: 'Ver c\u00f3mo los indies empujan dise\u00f1o, est\u00e9tica y riesgo.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Los indies prueban cosas raras, \u00edntimas o arriesgadas porque no siempre necesitan pedir permiso a una maquinaria enorme.',
      summary:
        'La escena indie ha renovado g\u00e9neros enteros con sensibilidad autoral, presupuestos peque\u00f1os y mucha identidad.',
      learnings: [
        'Estudios peque\u00f1os pueden lanzar ideas que luego inspiran a toda la industria.',
        'El arte, la m\u00fasica y la narrativa pueden ser tan memorables como la mec\u00e1nica.',
        'Muchos jugadores descubren sus obras favoritas fuera del circuito AAA.'
      ],
      spotlight: [
        { label: 'Fuerza', value: 'Identidad propia', tone: 'rose' },
        { label: 'Escala', value: 'Equipos peque\u00f1os', tone: 'lime' },
        { label: 'Legado', value: 'Innovaci\u00f3n constante', tone: 'gold' }
      ],
      vibe: 'rose'
    },
    {
      id: 'next-bit',
      zone: 'NEXT BIT',
      title: 'Lo que viene',
      subtitle: 'Accesibilidad, nuevas interfaces y futuros h\u00edbridos',
      objective: 'Salir del recorrido con una mirada m\u00e1s amplia.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* El futuro no va solo de gr\u00e1ficos. Va de accesibilidad, comunidades, nuevas interfaces y formas de jugar que todav\u00eda ni nombramos bien.',
      summary:
        'El videojuego sigue mutando: m\u00e1s personas crean, m\u00e1s personas juegan y m\u00e1s formatos conviven al mismo tiempo.',
      learnings: [
        'La accesibilidad expande qui\u00e9n puede jugar y c\u00f3mo se dise\u00f1a la experiencia.',
        'VR, cloud, juego cruzado y herramientas creativas siguen cambiando el medio.',
        'El futuro tambi\u00e9n depende de preservar la historia y aprender de ella.'
      ],
      spotlight: [
        { label: 'Foco', value: 'Accesibilidad', tone: 'lime' },
        { label: 'Cambio', value: 'Interfaces nuevas', tone: 'cyan' },
        { label: 'Mensaje', value: 'El medio sigue vivo', tone: 'gold' }
      ],
      vibe: 'violet'
    }
  ];
  heroSprite = '';
  guideSprite = '';
  heroPortrait = '';
  guidePortrait = '';
  starSprite = '';
  arcadeSprite = '';
  cyanOrb = '';
  roseOrb = '';

  constructor(private sprite: SpriteService) {}

  ngOnInit(): void {
    this.heroSprite = this.sprite.heroSprite();
    this.guideSprite = this.sprite.guideSprite();
    this.heroPortrait = this.sprite.heroPortrait();
    this.guidePortrait = this.sprite.guidePortrait();
    this.starSprite = this.sprite.saveStar();
    this.arcadeSprite = this.sprite.arcadeCabinet();
    this.cyanOrb = this.sprite.orb('cyan');
    this.roseOrb = this.sprite.orb('rose');
  }

  get current(): Chapter {
    return this.chapters[this.step];
  }

  get progressPercent(): number {
    return ((this.step + 1) / this.chapters.length) * 100;
  }

  get nextLabel(): string {
    return this.step === this.chapters.length - 1 ? 'FIN DEL JUEGO' : 'SIGUIENTE SALA';
  }

  get speakerPortrait(): string {
    return this.current.speaker === 'guide' ? this.guidePortrait : this.heroPortrait;
  }

  previous(): void {
    if (this.step > 0) {
      this.step -= 1;
    }
  }

  next(): void {
    if (this.step < this.chapters.length - 1) {
      this.step += 1;
      return;
    }

    this.onFinish.emit();
  }

  jumpTo(index: number): void {
    this.step = index;
  }
}
