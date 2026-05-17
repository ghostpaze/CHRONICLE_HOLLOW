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
        '* Al principio no habia sagas ni trailers. solo laboratorios, osciloscopios y gente descubriendo que una pantalla tambien podia jugar contigo.',
      summary:
        'La historia de los videojuegos arranca como experimento tecnico y termina convirtiendose en un nuevo lenguaje creativo.',
      learnings: [
        'Tennis for Two y Spacewar! demostraron que la interaccion podia ser espectaculo.',
        'Pong popularizo el videojuego como producto comercial y ritual de arcade.',
        'Las bases tempranas fueron reglas claras, respuesta inmediata y repeticion adictiva.'
      ],
      spotlight: [
        { label: 'Ano clave', value: '1972', tone: 'gold' },
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
      objective: 'Sentir por que jugar se volvio social y competitivo.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* Una moneda, tres vidas y medio salon mirandote. los arcades no vendian solo tiempo: vendian tension, ruido y reputacion.',
      summary:
        'En los arcades el videojuego se volvio espectaculo compartido, comunidad y reto publico.',
      learnings: [
        'Cabinas como Pac-Man, Donkey Kong y Space Invaders convirtieron el puntaje en estatus.',
        'Las partidas eran cortas e intensas para invitar a volver una y otra vez.',
        'Muchos generos modernos heredan el ritmo, la claridad y la lectura visual del arcade.'
      ],
      spotlight: [
        { label: 'Clave', value: 'High score', tone: 'rose' },
        { label: 'Diseno', value: 'Sesiones cortas', tone: 'gold' },
        { label: 'Sensacion', value: 'Presion social', tone: 'cyan' }
      ],
      vibe: 'rose'
    },
    {
      id: 'home-port',
      zone: 'HOME PORT',
      title: 'La consola entra a casa',
      subtitle: 'Nintendo, Sega, PlayStation y compania',
      objective: 'Entender como cambio el videojuego al llegar al hogar.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Cuando las consolas entraron a la sala, jugar dejo de ser una visita ocasional. se volvio rutina, coleccion y memoria familiar.',
      summary:
        'El salto al hogar amplio duracion, narrativa y apego emocional: ya no era solo sobrevivir, tambien explorar mundos.',
      learnings: [
        'Las consolas hicieron posible progresar durante semanas y no solo minutos.',
        'Las franquicias crecieron porque ahora habia tiempo para personajes, mapas y secuelas.',
        'La consola tambien cambio la forma de compartir: sofa, mandos y partidas en casa.'
      ],
      spotlight: [
        { label: 'Cambio', value: 'Juego domestico', tone: 'gold' },
        { label: 'Resultado', value: 'Franquicias iconicas', tone: 'cyan' },
        { label: 'Memoria', value: 'Cultura de sala', tone: 'violet' }
      ],
      vibe: 'gold'
    },
    {
      id: 'genre-vault',
      zone: 'GENRE VAULT',
      title: 'La boveda de generos',
      subtitle: 'Como cambian las emociones segun las reglas',
      objective: 'Detectar que hace unico a cada tipo de juego.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Plataformas, rpg, shooters, puzzles, survival horror. cada genero es una promesa distinta sobre lo que vas a sentir.',
      summary:
        'Los generos no son cajas rigidas: son formas de organizar ritmo, desafio, exploracion y narrativa.',
      learnings: [
        'Los plataformas hablan de movimiento y precision.',
        'Los RPG priorizan crecimiento, decisiones y mundos persistentes.',
        'Los puzzles y survival horror manipulan informacion, tension y anticipacion.'
      ],
      spotlight: [
        { label: 'Idea central', value: 'Reglas = emocion', tone: 'lime' },
        { label: 'Ejemplo', value: 'RPG, FPS, puzzle', tone: 'cyan' },
        { label: 'Lectura', value: 'Hibridos por todos lados', tone: 'rose' }
      ],
      vibe: 'lime'
    },
    {
      id: 'metroid-depths',
      zone: 'METROID DEPTHS',
      title: 'El laberinto metroidvania',
      subtitle: 'Mapa interconectado, memoria y regreso',
      objective: 'Aprender por que este genero se siente tan absorbente.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* Ahora si, el plato fuerte. un metroidvania te deja perderte a proposito y luego te recompensa por recordar una puerta que antes no podias abrir.',
      summary:
        'El metroidvania mezcla exploracion, bloqueo elegante y sensacion constante de descubrimiento.',
      learnings: [
        'El mapa interconectado convierte el espacio en un rompecabezas de memoria.',
        'Cada habilidad nueva reescribe lugares viejos y abre rutas escondidas.',
        'La satisfaccion viene de notar conexiones, no solo de derrotar enemigos.'
      ],
      spotlight: [
        { label: 'Corazon', value: 'Backtracking con sentido', tone: 'cyan' },
        { label: 'Diseno', value: 'Gating por habilidades', tone: 'gold' },
        { label: 'Resultado', value: 'Exploracion obsesiva', tone: 'violet' }
      ],
      vibe: 'cyan'
    },
    {
      id: 'indie-forge',
      zone: 'INDIE FORGE',
      title: 'La fragua indie',
      subtitle: 'Equipos pequenos, ideas gigantes',
      objective: 'Ver como los indies empujan diseno, estetica y riesgo.',
      speaker: 'hero',
      speakerName: 'GHOST',
      dialogue:
        '* Los indies prueban cosas raras, intimas o arriesgadas porque no siempre necesitan pedir permiso a una maquinaria enorme.',
      summary:
        'La escena indie ha renovado generos enteros con sensibilidad autoral, presupuestos pequenos y mucha identidad.',
      learnings: [
        'Estudios pequenos pueden lanzar ideas que luego inspiran a toda la industria.',
        'El arte, la musica y la narrativa pueden ser tan memorables como la mecanica.',
        'Muchos jugadores descubren sus obras favoritas fuera del circuito AAA.'
      ],
      spotlight: [
        { label: 'Fuerza', value: 'Identidad propia', tone: 'rose' },
        { label: 'Escala', value: 'Equipos pequenos', tone: 'lime' },
        { label: 'Legado', value: 'Innovacion constante', tone: 'gold' }
      ],
      vibe: 'rose'
    },
    {
      id: 'next-bit',
      zone: 'NEXT BIT',
      title: 'Lo que viene',
      subtitle: 'Accesibilidad, nuevas interfaces y futuros hibridos',
      objective: 'Salir del recorrido con una mirada mas amplia.',
      speaker: 'guide',
      speakerName: 'SANS',
      dialogue:
        '* El futuro no va solo de graficos. va de accesibilidad, comunidades, nuevas interfaces y formas de jugar que todavia ni nombramos bien.',
      summary:
        'El videojuego sigue mutando: mas personas crean, mas personas juegan y mas formatos conviven al mismo tiempo.',
      learnings: [
        'La accesibilidad expande quien puede jugar y como se disena la experiencia.',
        'VR, cloud, juego cruzado y herramientas creativas siguen cambiando el medio.',
        'El futuro tambien depende de preservar la historia y aprender de ella.'
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
