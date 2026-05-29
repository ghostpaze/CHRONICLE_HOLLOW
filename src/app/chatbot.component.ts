import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RetroAudioService } from './retro-audio.service';
import { SpriteService } from './sprite.service';
import { Chapter, RunSecretLog } from './story.models';

interface OptionNode {
  id: string;
  label: string;
  response?: string;
  children?: OptionNode[];
}

interface SecretRouteConfig {
  id: string;
  title: string;
  sequence: string[];
  response: string;
  reveal: string;
  echo: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit, OnChanges {
  @Input() zone = '';
  @Input() chapter: Chapter | null = null;
  @Output() secretUnlocked = new EventEmitter<RunSecretLog>();

  readonly name = 'SANS';
  readonly zonePrompts: Record<string, string> = {
    'PROTO ROOM': 'Abre men\u00fas sobre origen, prototipos y el salto del experimento a la industria.',
    'ARCADE CORE': 'Esta terminal carga historia de arcade, high scores y dise\u00f1o de partidas cortas.',
    'HOME PORT': 'Aqu\u00ed el foco cambia a consolas, vida en casa y mundos que acompa\u00f1aban durante semanas.',
    'GENRE VAULT': 'Esta sala sirve para comparar emociones: qu\u00e9 cambia cuando cambian las reglas.',
    'METROID DEPTHS': 'En esta zona todo gira alrededor de mapa, memoria, bloqueos y rutas que vuelven a abrirse.',
    'INDIE FORGE': 'Esta terminal se centra en voz autoral, riesgo creativo e identidad propia.',
    'NEXT BIT': 'Aqu\u00ed miramos el futuro del medio: accesibilidad, interfaces nuevas y preservaci\u00f3n.'
  };
  readonly secretRoutes: Record<string, SecretRouteConfig> = {
    'PROTO ROOM': {
      id: 'secret-proto-room',
      title: 'Bitácora Delta 72',
      sequence: ['room-spotlight', 'proto-experiments-games-proof', 'proto-legacy-reading'],
      response: 'La bitácora oculta revela que el origen del videojuego no es solo técnico: es el momento en que una máquina aprende a provocar insistencia.',
      reveal: 'La secuencia conecta datos, prototipo y legado para demostrar que la claridad del input fue la verdadera primera magia.',
      echo: 'Cada juego contemporáneo que responde limpio y rápido sigue trabajando con la misma promesa del Delta 72.'
    },
    'ARCADE CORE': {
      id: 'secret-arcade-core',
      title: 'Tabla Fantasma',
      sequence: ['arcade-culture-score-status', 'arcade-economy-loop', 'arcade-icons-afterlife'],
      response: 'La tabla fantasma registra algo clave: el arcade no vendía duración, vendía el derecho a ser recordado por una sala entera.',
      reveal: 'Prestigio, ritmo y legado forman un mismo circuito. La economía del arcade siempre estuvo amarrada a la memoria social.',
      echo: 'Leaderboards, clips y speedruns siguen actuando como esa tabla invisible que convierte jugar en presencia pública.'
    },
    'HOME PORT': {
      id: 'secret-home-port',
      title: 'Memory Core',
      sequence: ['home-rhythm-change-save', 'home-franchises-icons', 'home-hardware-control'],
      response: 'La memoria secreta de esta sala muestra que el hogar no solo expandió contenido: hizo que el videojuego conviviera contigo.',
      reveal: 'Guardar, recordar personajes y aprender un mando propio forman la tríada que convierte una consola en compañía cotidiana.',
      echo: 'Todo juego al que regresas por apego, y no solo por reto, sigue respondiendo al pulso de este Memory Core.'
    },
    'GENRE VAULT': {
      id: 'secret-genre-vault',
      title: 'Matriz de Híbridos',
      sequence: ['genre-emotions-compare-focus', 'genre-rules-design', 'genre-hybrids-works'],
      response: 'La matriz secreta confirma que los géneros valen más como motores de emoción que como cajas de catálogo.',
      reveal: 'Comparar acción, reglas y mezcla deja ver cuándo un sistema cambia de verdad la sensación central del jugador.',
      echo: 'Los juegos más memorables de hoy suelen destacar cuando usan géneros como instrumentos, no como límites.'
    },
    'METROID DEPTHS': {
      id: 'secret-metroid-depths',
      title: 'Plano de Retorno',
      sequence: ['metroid-map-memory-marks', 'metroid-return-gating', 'metroid-library-modern'],
      response: 'El plano oculto demuestra que el metroidvania no solo premia avanzar: premia recordar mejor que antes.',
      reveal: 'Mapa, bloqueo y reinterpretación moderna forman una misma lección sobre memoria espacial convertida en recompensa.',
      echo: 'Cada atajo memorable y cada compuerta abierta tarde siguen obedeciendo al mismo plano de retorno.'
    },
    'INDIE FORGE': {
      id: 'secret-indie-forge',
      title: 'Sello de Taller',
      sequence: ['indie-voice-feeling-filters', 'indie-risk-limits', 'indie-recommendations-atmosphere'],
      response: 'El sello oculto de esta sala dice que muchas obras indie brillan porque podan sin miedo hasta dejar la voz al desnudo.',
      reveal: 'Sensibilidad, límite y atmósfera se alinean aquí como prueba de que una identidad fuerte no necesita escala gigante.',
      echo: 'Cuando un juego pequeño te golpea más fuerte que uno enorme, casi siempre hay un Sello de Taller detrás.'
    },
    'NEXT BIT': {
      id: 'secret-next-bit',
      title: 'Canal de Futuro',
      sequence: ['next-accessibility-options-access', 'next-interfaces-tools', 'next-preservation-connection'],
      response: 'El canal secreto deja una idea fija: el futuro gana valor cuando abre acceso y conserva memoria al mismo tiempo.',
      reveal: 'Accesibilidad, herramientas y preservación no son líneas separadas; juntas dibujan el terreno más serio del próximo salto.',
      echo: 'Todo sistema que deja entrar a más personas y no borra su pasado ya está transmitiendo en este canal.'
    }
  };

  rootOptions: OptionNode[] = [];
  guidePortrait = '';
  activeResponse = '';
  responseTick = 0;
  path: OptionNode[] = [];
  private readonly unlockedSecretIds = new Set<string>();
  private recentOptionTrail: string[] = [];

  constructor(
    private sprite: SpriteService,
    private audio: RetroAudioService
  ) {}

  ngOnInit(): void {
    this.guidePortrait = this.sprite.guidePortrait();
    this.syncTerminal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zone'] || changes['chapter']) {
      this.syncTerminal();
    }
  }

  get currentOptions(): OptionNode[] {
    return this.path.length ? this.path[this.path.length - 1].children ?? [] : this.rootOptions;
  }

  get breadcrumb(): string {
    const rootLabel = (this.chapter?.title ?? this.zone) || 'MAPA';
    return [rootLabel, ...this.path.map((item) => item.label)].join(' / ');
  }

  select(option: OptionNode): void {
    if (this.tryUnlockSecret(option.id)) {
      return;
    }

    if (option.children?.length) {
      this.path.push(option);
      this.setResponse(option.response ?? this.defaultResponse());
      return;
    }

    this.setResponse(option.response ?? '* ...');
  }

  back(): void {
    if (!this.path.length) {
      return;
    }

    this.path.pop();
    this.setResponse(this.path.length ? this.path[this.path.length - 1].response ?? this.defaultResponse() : this.defaultResponse());
  }

  home(): void {
    this.path = [];
    this.setResponse(this.defaultResponse());
  }

  private syncTerminal(): void {
    this.rootOptions = this.buildRootOptions();
    this.path = [];
    this.recentOptionTrail = [];
    this.setResponse(this.defaultResponse());
  }

  private defaultResponse(): string {
    const prompt = this.zonePrompts[this.zone] ?? 'Elige una rama y te abro el tema por capas, sin repetir el mismo men\u00fa en cada sala.';

    if (!this.chapter) {
      return `* Terminal sincronizada con ${this.zone || 'el mapa'}. ${prompt}`;
    }

    return [
      `* Sala activa: ${this.chapter.title} / ${this.chapter.zone}.`,
      this.chapter.summary,
      `Objetivo actual: ${this.chapter.objective}`,
      prompt
    ].join('\n');
  }

  private buildRootOptions(): OptionNode[] {
    const options = [this.buildRoomScanOption(), ...this.buildZoneSpecificOptions()];
    const secretOption = this.buildUnlockedSecretOption();

    if (secretOption) {
      options.push(secretOption);
    }

    return options;
  }

  private buildRoomScanOption(): OptionNode {
    if (!this.chapter) {
      return {
        id: 'room-scan',
        label: 'Escanear sala',
        response: '* La terminal espera datos de una sala activa para abrir men\u00fas contextuales.'
      };
    }

    return {
      id: 'room-scan',
      label: `Escanear ${this.chapter.zone}`,
      response: `* ${this.chapter.summary}`,
      children: [
        {
          id: 'room-objective',
          label: 'Objetivo de la sala',
          response: `* Objetivo actual en ${this.chapter.zone}: ${this.chapter.objective}`
        },
        {
          id: 'room-learnings',
          label: 'Lo que aprendes aqu\u00ed',
          response: this.buildLearningsResponse()
        },
        {
          id: 'room-spotlight',
          label: 'Radar r\u00e1pido',
          response: this.buildSpotlightResponse()
        },
        {
          id: 'room-relic',
          label: 'Reliquia detectada',
          response: this.buildRelicScanResponse(),
          children: [
            {
              id: 'room-relic-profile',
              label: 'Ficha de reliquia',
              response: this.buildRelicProfileResponse()
            },
            {
              id: 'room-relic-echo',
              label: 'Eco en el presente',
              response: this.buildRelicEchoResponse()
            }
          ]
        }
      ]
    };
  }

  private buildZoneSpecificOptions(): OptionNode[] {
    switch (this.zone) {
      case 'PROTO ROOM':
        return this.buildProtoRoomOptions();
      case 'ARCADE CORE':
        return this.buildArcadeCoreOptions();
      case 'HOME PORT':
        return this.buildHomePortOptions();
      case 'GENRE VAULT':
        return this.buildGenreVaultOptions();
      case 'METROID DEPTHS':
        return this.buildMetroidDepthsOptions();
      case 'INDIE FORGE':
        return this.buildIndieForgeOptions();
      case 'NEXT BIT':
        return this.buildNextBitOptions();
      default:
        return this.buildFallbackOptions();
    }
  }

  private buildProtoRoomOptions(): OptionNode[] {
    return [
      {
        id: 'proto-experiments',
        label: 'Primeros experimentos',
        response:
          '* Aqu\u00ed el videojuego todav\u00eda es laboratorio, pero ya se siente la magia: reglas simples, respuesta inmediata y curiosidad t\u00e9cnica.',
        children: [
          {
            id: 'proto-experiments-games',
            label: 'Tennis for Two y Spacewar!',
            response:
              '* Esos prototipos demostraron que una pantalla pod\u00eda responder al jugador en tiempo real. Antes de las grandes sagas, ya exist\u00eda la sensaci\u00f3n de jugar con una m\u00e1quina.',
            children: [
              {
                id: 'proto-experiments-games-proof',
                label: 'Qu\u00e9 demostraban',
                response:
                  '* Demostraban que la interacci\u00f3n ya pod\u00eda producir tensi\u00f3n, competencia y sorpresa sin necesidad de una narrativa enorme alrededor.'
              },
              {
                id: 'proto-experiments-games-legacy',
                label: 'Por qu\u00e9 siguen vivos',
                response:
                  '* Siguen vivos porque fijan una verdad muy temprana: si una acci\u00f3n se entiende al instante y la respuesta es limpia, ya hay juego.'
              }
            ]
          },
          {
            id: 'proto-experiments-bases',
            label: 'Qu\u00e9 nace aqu\u00ed',
            response:
              '* En esta sala nacen tres bases que siguen vivas: objetivo claro, feedback instant\u00e1neo y ganas de repetir para mejorar.'
          }
        ]
      },
      {
        id: 'proto-commercial',
        label: 'Salto comercial',
        response:
          '* El paso importante no fue solo inventar algo jugable, sino hacerlo entendible para mucha gente. Ah\u00ed Pong cambia la escala de todo.',
        children: [
          {
            id: 'proto-commercial-pong',
            label: 'Por qu\u00e9 Pong cambia todo',
            response:
              '* Pong simplifica la idea hasta volverla obvia, adictiva y f\u00e1cil de compartir. Esa claridad convierte el experimento en producto comercial.'
          },
          {
            id: 'proto-commercial-market',
            label: 'Del laboratorio al p\u00fablico',
            response:
              '* Cuando el juego sale del laboratorio aparece la industria: m\u00e1quinas, jugadores, negocio y un lenguaje com\u00fan para hablar de jugar.'
          }
        ]
      },
      {
        id: 'proto-legacy',
        label: 'Legado de esta sala',
        response:
          '* Aunque hoy los juegos sean enormes, esta sala recuerda que el coraz\u00f3n sigue siendo sencillo: una acci\u00f3n clara y una respuesta que engancha.',
        children: [
          {
            id: 'proto-legacy-modern',
            label: 'Herencia en juegos modernos',
            response:
              '* Cada buen juego moderno todav\u00eda cuida lo que aqu\u00ed se aprende: controles fiables, reglas entendibles y una curva que invita a insistir.'
          },
          {
            id: 'proto-legacy-reading',
            label: 'C\u00f3mo leer esta etapa',
            response:
              '* No la mires como una fase torpe. M\u00edrala como el momento en que se defini\u00f3 el verbo jugar en formato digital.'
          }
        ]
      }
    ];
  }

  private buildArcadeCoreOptions(): OptionNode[] {
    return [
      {
        id: 'arcade-culture',
        label: 'Cultura arcade',
        response:
          '* En ARCADE CORE todo est\u00e1 pensado para que jugar tambi\u00e9n se vea y se escuche. La sala no era privada: era escenario.',
        children: [
          {
            id: 'arcade-culture-score',
            label: 'High score y prestigio',
            response:
              '* El puntaje no era solo n\u00famero. Era reputaci\u00f3n, comparaci\u00f3n y motivo para volver. Por eso esta etapa vuelve social algo que parec\u00eda individual.',
            children: [
              {
                id: 'arcade-culture-score-status',
                label: 'Prestigio visible',
                response:
                  '* Tu nombre en la tabla convert\u00eda una partida breve en una declaraci\u00f3n p\u00fablica. El score era una forma de estar presente incluso cuando ya no jugabas.'
              },
              {
                id: 'arcade-culture-score-return',
                label: 'Volver por tu nombre',
                response:
                  '* Mucha gente regresaba menos por terminar el juego y m\u00e1s por recuperar un lugar, superar a alguien o defender una marca propia.'
              }
            ]
          },
          {
            id: 'arcade-culture-spectacle',
            label: 'Mirar tambi\u00e9n era jugar',
            response:
              '* En una sala arcade mucha gente aprend\u00eda observando. La audiencia entend\u00eda rutas, riesgos y habilidad antes incluso de tocar la cabina.'
          }
        ]
      },
      {
        id: 'arcade-economy',
        label: 'Dise\u00f1o por monedas',
        response:
          '* La moneda impon\u00eda disciplina. Los juegos deb\u00edan explicar r\u00e1pido, exigir pronto y dejarte con ganas de otra partida.',
        children: [
          {
            id: 'arcade-economy-loop',
            label: 'Partidas cortas, tensi\u00f3n alta',
            response:
              '* El arcade comprim\u00eda el placer en segundos: aprender deprisa, fallar deprisa y querer volver enseguida. Ese ritmo defini\u00f3 much\u00edsimo dise\u00f1o posterior.'
          },
          {
            id: 'arcade-economy-difficulty',
            label: 'Dificultad como negocio',
            response:
              '* La dificultad no era casual. Deb\u00eda desafiar lo suficiente para cobrar otra moneda sin sentirse injusta desde el primer minuto.'
          }
        ]
      },
      {
        id: 'arcade-icons',
        label: 'Cabinas clave',
        response:
          '* Pac-Man, Space Invaders o Donkey Kong no solo fueron \u00e9xitos: fijaron gestos, ritmos y formas de leer una pantalla.',
        children: [
          {
            id: 'arcade-icons-legacy',
            label: 'Qu\u00e9 heredan hoy',
            response:
              '* Muchos juegos de acci\u00f3n actuales heredan del arcade su claridad visual, la lectura del peligro y el valor de una respuesta inmediata.'
          },
          {
            id: 'arcade-icons-afterlife',
            label: 'Arcade fuera del arcade',
            response:
              '* Aunque las cabinas ya no dominen el mercado, su ADN sigue en juegos m\u00f3viles, sesiones r\u00e1pidas, leaderboards y retos de habilidad.'
          }
        ]
      }
    ];
  }

  private buildHomePortOptions(): OptionNode[] {
    return [
      {
        id: 'home-rhythm',
        label: 'Del arcade al sof\u00e1',
        response:
          '* Cuando la consola entra a casa, cambia el ritmo. Ya no todo depende de una partida corta: aparece el h\u00e1bito, el progreso y el tiempo largo.',
        children: [
          {
            id: 'home-rhythm-change',
            label: 'Por qu\u00e9 cambia la experiencia',
            response:
              '* En casa puedes explorar con calma, guardar progreso y volver ma\u00f1ana. Eso abre espacio para campa\u00f1as largas, secretos y mundos persistentes.',
            children: [
              {
                id: 'home-rhythm-change-save',
                label: 'Guardar progreso',
                response:
                  '* Guardar cambia la relaci\u00f3n con el error: ya no todo termina en una sola sesi\u00f3n. El juego puede acompa\u00f1arte durante d\u00edas o semanas.'
              },
              {
                id: 'home-rhythm-change-scale',
                label: 'Tiempo largo',
                response:
                  '* El hogar permite dise\u00f1ar mundos con m\u00e1s calma, secretos acumulados y una sensaci\u00f3n de compa\u00f1\u00eda que el arcade rara vez pod\u00eda sostener.'
              }
            ]
          },
          {
            id: 'home-rhythm-sharing',
            label: 'Jugar en familia o con amigos',
            response:
              '* El hogar convierte el videojuego en rutina compartida: turnos, cooperativo, tardes de sof\u00e1 y recuerdos ligados a una misma pantalla.'
          }
        ]
      },
      {
        id: 'home-franchises',
        label: 'Franquicias y memoria',
        response:
          '* El hogar permite volver al mismo mundo durante semanas, y eso fortalece personajes, secuelas y recuerdos compartidos.',
        children: [
          {
            id: 'home-franchises-icons',
            label: 'Nacen iconos duraderos',
            response:
              '* Cuando un jugador convive m\u00e1s tiempo con un juego, los personajes dejan de ser una cara en pantalla y se vuelven compa\u00f1\u00eda, mito y marca.'
          },
          {
            id: 'home-franchises-memory',
            label: 'Memoria de sala',
            response:
              '* Esta etapa importa porque mezcla tecnolog\u00eda y vida cotidiana. Las consolas no solo cambiaron qu\u00e9 se jugaba, tambi\u00e9n d\u00f3nde y con qui\u00e9n.'
          }
        ]
      },
      {
        id: 'home-hardware',
        label: 'Saltos de hardware',
        response:
          '* Cada generaci\u00f3n dom\u00e9stica abre una puerta nueva: mejores mandos, m\u00e1s almacenamiento, sonido m\u00e1s rico y mundos m\u00e1s ambiciosos.',
        children: [
          {
            id: 'home-hardware-3d',
            label: 'De 8 bits a 3D',
            response:
              '* El crecimiento t\u00e9cnico no fue puro brillo visual. Cada salto ampli\u00f3 la forma de moverse, narrar, guardar y poblar un mundo de juego.'
          },
          {
            id: 'home-hardware-control',
            label: 'Por qu\u00e9 importa el mando',
            response:
              '* El mando dom\u00e9stico define intimidad y costumbre. Botones, sticks y ergonom\u00eda cambian mucho la forma en que el cuerpo aprende un juego.'
          }
        ]
      }
    ];
  }

  private buildGenreVaultOptions(): OptionNode[] {
    return [
      {
        id: 'genre-emotions',
        label: 'G\u00e9neros y emociones',
        response:
          '* Esta sala no clasifica por capricho. Usa los g\u00e9neros para mostrar c\u00f3mo las reglas cambian lo que el jugador siente.',
        children: [
          {
            id: 'genre-emotions-compare',
            label: 'Acci\u00f3n, puzzle y RPG',
            response:
              '* Acci\u00f3n pide reflejos, puzzle pide comprensi\u00f3n y RPG pide crecimiento dentro de un mundo. Cada g\u00e9nero reorganiza el tipo de placer que ofrece.',
            children: [
              {
                id: 'genre-emotions-compare-focus',
                label: 'Qu\u00e9 pide cada uno',
                response:
                  '* La acci\u00f3n exige ejecuci\u00f3n, el puzzle exige lectura y el RPG exige permanencia. No solo cambian las reglas: cambia el tipo de atenci\u00f3n que te piden.'
              },
              {
                id: 'genre-emotions-compare-feeling',
                label: 'Qu\u00e9 emoci\u00f3n domina',
                response:
                  '* Un buen g\u00e9nero no se reconoce solo por sus sistemas, sino por la emoci\u00f3n que vuelve constante: urgencia, curiosidad, poder o tensi\u00f3n.'
              }
            ]
          },
          {
            id: 'genre-emotions-tension',
            label: 'Tensi\u00f3n y exploraci\u00f3n',
            response:
              '* Survival horror y aventura manipulan informaci\u00f3n, ritmo y seguridad. Cambiar esos factores cambia por completo la emoci\u00f3n dominante.'
          }
        ]
      },
      {
        id: 'genre-rules',
        label: 'Comparar reglas',
        response:
          '* Si cambias recursos, velocidad o informaci\u00f3n, cambia la emoci\u00f3n central. Esa es la lectura clave de esta b\u00f3veda.',
        children: [
          {
            id: 'genre-rules-design',
            label: 'Qu\u00e9 mira un dise\u00f1o',
            response:
              '* Un dise\u00f1ador observa qu\u00e9 acciones se repiten, qu\u00e9 castigos existen, qu\u00e9 se recompensa y qu\u00e9 nivel de informaci\u00f3n recibe el jugador.'
          },
          {
            id: 'genre-rules-labels',
            label: 'Por qu\u00e9 sirven las etiquetas',
            response:
              '* Las etiquetas sirven para orientarse y comparar. No son jaulas perfectas, pero ayudan a leer intenciones, ritmos y expectativas.'
          }
        ]
      },
      {
        id: 'genre-hybrids',
        label: 'H\u00edbridos',
        response:
          '* Muchos juegos actuales mezclan g\u00e9neros porque buscan sensaciones m\u00e1s ricas que una sola f\u00f3rmula cerrada.',
        children: [
          {
            id: 'genre-hybrids-examples',
            label: 'Ejemplos de mezcla',
            response:
              '* Un metroidvania puede tomar combate de acci\u00f3n, progresi\u00f3n de RPG y atm\u00f3sfera de horror. La mezcla funciona cuando todas las capas empujan la misma idea.'
          },
          {
            id: 'genre-hybrids-works',
            label: 'Cuando un h\u00edbrido funciona',
            response:
              '* Funciona cuando la mezcla suma claridad en vez de ruido. Si cada sistema refuerza la emoci\u00f3n principal, el h\u00edbrido se siente natural.'
          }
        ]
      }
    ];
  }

  private buildMetroidDepthsOptions(): OptionNode[] {
    return [
      {
        id: 'metroid-map',
        label: 'Mapa vivo',
        response:
          '* En un metroidvania el espacio no es decorado. El mapa guarda promesas, rutas bloqueadas y recuerdos que vuelven m\u00e1s tarde.',
        children: [
          {
            id: 'metroid-map-memory',
            label: 'Memoria espacial',
            response:
              '* Este g\u00e9nero recompensa recordar un pasillo raro, una cornisa imposible o una puerta que parec\u00eda in\u00fatil. El mapa se queda contigo.',
            children: [
              {
                id: 'metroid-map-memory-marks',
                label: 'Marcas mentales',
                response:
                  '* El jugador empieza a guardar huellas invisibles: esa pared sospechosa, esa altura imposible, ese color raro. El mapa vive tambi\u00e9n fuera de la pantalla.'
              },
              {
                id: 'metroid-map-memory-promises',
                label: 'Puertas pendientes',
                response:
                  '* Cada puerta imposible crea una deuda elegante con el futuro. El juego te ense\u00f1a a recordar porque sabe que luego va a recompensarte por eso.'
              }
            ]
          },
          {
            id: 'metroid-map-shortcuts',
            label: 'Atajos y puertas',
            response:
              '* Los atajos y bloqueos convierten el mapa en una red viva. Cada puerta cerrada es una promesa de futuro, no un simple muro.'
          }
        ]
      },
      {
        id: 'metroid-return',
        label: 'Backtracking con sentido',
        response:
          '* Volver atr\u00e1s no aburre cuando el regreso cambia tu lectura del mundo. La gracia est\u00e1 en regresar con otra capacidad y otra mirada.',
        children: [
          {
            id: 'metroid-return-gating',
            label: 'Gating por habilidades',
            response:
              '* El bloqueo elegante te muestra una limitaci\u00f3n hoy para convertirla en recompensa ma\u00f1ana. No solo ganas poder: ganas lectura del espacio.'
          },
          {
            id: 'metroid-return-reward',
            label: 'Recompensa del regreso',
            response:
              '* La satisfacci\u00f3n aparece cuando conectas recuerdos con progreso. El juego te dice que si estabas prestando atenci\u00f3n, el mundo te responde.'
          }
        ]
      },
      {
        id: 'metroid-library',
        label: 'Referencias del g\u00e9nero',
        response:
          '* Esta sala existe porque algunos juegos definieron muy bien la f\u00f3rmula y otros la expandieron con personalidad propia.',
        children: [
          {
            id: 'metroid-library-classics',
            label: 'Cl\u00e1sicos',
            response:
              '* Super Metroid y Symphony of the Night suelen aparecer como referencias porque fijan de forma muy clara el valor del mapa, el regreso y el descubrimiento.'
          },
          {
            id: 'metroid-library-modern',
            label: 'Versiones modernas',
            response:
              '* Hollow Knight, Ori o Blasphemous muestran c\u00f3mo la f\u00f3rmula sigue viva: misma base estructural, pero con tonos, ritmos y sensibilidades muy distintas.'
          }
        ]
      }
    ];
  }

  private buildIndieForgeOptions(): OptionNode[] {
    return [
      {
        id: 'indie-voice',
        label: 'Voz autoral',
        response:
          '* En INDIE FORGE la identidad pesa m\u00e1s que la escala. Muchos proyectos destacan porque se sienten hechos por una voz concreta.',
        children: [
          {
            id: 'indie-voice-feeling',
            label: 'Por qu\u00e9 se sienten personales',
            response:
              '* Muchos indies transmiten una intenci\u00f3n muy clara porque tienen menos filtros. A veces no buscan impresionar por tama\u00f1o, sino por sensibilidad.',
            children: [
              {
                id: 'indie-voice-feeling-filters',
                label: 'Menos filtros',
                response:
                  '* Cuando hay menos capas de aprobaci\u00f3n, una idea puede conservar mejor su tono original. Eso hace que muchos indies se sientan m\u00e1s directos y honestos.'
              },
              {
                id: 'indie-voice-feeling-sensitivity',
                label: 'Sensibilidad antes que escala',
                response:
                  '* Un indie puede dejar huella sin ser enorme porque concentra su energ\u00eda en una sensaci\u00f3n muy clara, no en abarcarlo todo.'
              }
            ]
          },
          {
            id: 'indie-voice-style',
            label: 'Arte y m\u00fasica como firma',
            response:
              '* En esta escena la direcci\u00f3n art\u00edstica y la m\u00fasica no son adorno. Suelen ser parte central de la identidad y del recuerdo que deja el juego.'
          }
        ]
      },
      {
        id: 'indie-risk',
        label: 'Riesgo y escala',
        response:
          '* Un equipo peque\u00f1o puede probar ideas raras, \u00edntimas o filosas porque no necesita mover una maquinaria inmensa para existir.',
        children: [
          {
            id: 'indie-risk-advantages',
            label: 'Ventajas de ser peque\u00f1o',
            response:
              '* Menos capas pueden significar decisiones m\u00e1s r\u00e1pidas, tono m\u00e1s coherente y libertad para apostar por una idea muy espec\u00edfica.'
          },
          {
            id: 'indie-risk-limits',
            label: 'L\u00edmites que empujan creatividad',
            response:
              '* La falta de presupuesto no siempre resta. Muchas veces obliga a recortar bien, afilar el concepto y encontrar una identidad m\u00e1s fuerte.'
          }
        ]
      },
      {
        id: 'indie-recommendations',
        label: 'Joyas para seguir',
        response:
          '* La escena indie es tan amplia que conviene entrar por sensaci\u00f3n: precisi\u00f3n, misterio, calma, combate o exploraci\u00f3n pura.',
        children: [
          {
            id: 'indie-recommendations-precision',
            label: 'Indies de precisi\u00f3n',
            response:
              '* Celeste o Dead Cells son buenas puertas si quieres control fino, ritmo alto y una relaci\u00f3n muy directa entre manos y pantalla.'
          },
          {
            id: 'indie-recommendations-atmosphere',
            label: 'Indies de atm\u00f3sfera',
            response:
              '* Si prefieres descubrimiento y tono, juegos como Tunic, Hyper Light Drifter o A Short Hike muestran otra cara igual de valiosa del indie.'
          }
        ]
      }
    ];
  }

  private buildNextBitOptions(): OptionNode[] {
    return [
      {
        id: 'next-accessibility',
        label: 'Accesibilidad primero',
        response:
          '* El futuro del medio no solo va de potencia. Va de abrir puertas para que m\u00e1s personas puedan jugar, entender y disfrutar.',
        children: [
          {
            id: 'next-accessibility-options',
            label: 'Opciones que cambian todo',
            response:
              '* Subt\u00edtulos, remapeo, ayudas visuales, dificultad adaptable o lectores de interfaz pueden convertir una barrera en una experiencia posible.',
            children: [
              {
                id: 'next-accessibility-options-access',
                label: 'Acceso real',
                response:
                  '* Una opci\u00f3n de accesibilidad no es adorno. Es la diferencia entre poder entrar al juego o quedarse completamente fuera de la experiencia.'
              },
              {
                id: 'next-accessibility-options-clarity',
                label: 'Claridad para todos',
                response:
                  '* Muchas mejoras pensadas para accesibilidad tambi\u00e9n vuelven el juego m\u00e1s legible y amable para casi cualquier persona.'
              }
            ]
          },
          {
            id: 'next-accessibility-design',
            label: 'Dise\u00f1ar para m\u00e1s gente',
            response:
              '* Pensar en accesibilidad desde el inicio no recorta el juego. Suele volverlo m\u00e1s claro, m\u00e1s flexible y mejor resuelto para casi todo el mundo.'
          }
        ]
      },
      {
        id: 'next-interfaces',
        label: 'Interfaces nuevas',
        response:
          '* VR, control t\u00e1ctil, nube, juego cruzado o herramientas creativas cambian no solo el dispositivo, sino tambi\u00e9n la forma de pensar el juego.',
        children: [
          {
            id: 'next-interfaces-platforms',
            label: 'Qu\u00e9 cambia con VR y nube',
            response:
              '* Cambian la presencia, el acceso y hasta el tiempo de entrada. Algunas interfaces acercan el cuerpo; otras reducen fricci\u00f3n para empezar a jugar.'
          },
          {
            id: 'next-interfaces-tools',
            label: 'Herramientas para crear',
            response:
              '* El futuro tambi\u00e9n incluye mejores motores, pipelines m\u00e1s r\u00e1pidos y m\u00e1s personas capaces de crear juegos sin depender de estudios gigantes.'
          }
        ]
      },
      {
        id: 'next-preservation',
        label: 'Preservar para avanzar',
        response:
          '* Mirar al futuro sin conservar el pasado deja huecos. Preservar juegos, hardware e historia tambi\u00e9n es una forma de dise\u00f1ar mejor lo que viene.',
        children: [
          {
            id: 'next-preservation-why',
            label: 'Por qu\u00e9 preservar importa',
            response:
              '* Sin preservaci\u00f3n se pierden t\u00e9cnicas, contextos y obras enteras. Y si se pierde la memoria del medio, tambi\u00e9n se empobrece su futuro.'
          },
          {
            id: 'next-preservation-connection',
            label: 'C\u00f3mo conecta con la ruta',
            response:
              '* Esta \u00faltima sala cierra el recorrido recordando algo simple: para imaginar lo nuevo, tambi\u00e9n necesitamos entender y cuidar lo que ya existi\u00f3.'
          }
        ]
      }
    ];
  }

  private buildFallbackOptions(): OptionNode[] {
    return [
      {
        id: 'fallback-context',
        label: 'Leer la sala',
        response: '* Esta terminal adapta sus men\u00fas a la zona activa para que el recorrido siempre responda al lugar en el que est\u00e1s.'
      },
      {
        id: 'fallback-history',
        label: 'Recorrido del museo',
        response: '* Avanza de sala en sala para desbloquear conversaciones distintas sobre historia, g\u00e9neros, dise\u00f1o y futuro del videojuego.'
      }
    ];
  }

  private buildUnlockedSecretOption(): OptionNode | null {
    const config = this.secretRoutes[this.zone];
    if (!config || !this.unlockedSecretIds.has(config.id)) {
      return null;
    }

    return {
      id: `${config.id}-node`,
      label: 'Ruta secreta',
      response: `* ${config.title} desbloqueada. ${config.response}`,
      children: [
        {
          id: `${config.id}-reveal`,
          label: 'Clave descifrada',
          response: `* ${config.reveal}`
        },
        {
          id: `${config.id}-echo`,
          label: 'Eco oculto',
          response: `* ${config.echo}`
        }
      ]
    };
  }

  private tryUnlockSecret(optionId: string): boolean {
    const config = this.secretRoutes[this.zone];
    if (!config || this.unlockedSecretIds.has(config.id)) {
      return false;
    }

    const selectedOption = this.findOptionById(optionId, this.rootOptions);
    if (selectedOption?.children?.length) {
      return false;
    }

    this.recentOptionTrail = [...this.recentOptionTrail, optionId].slice(-config.sequence.length);
    const matches = config.sequence.every((id, index) => this.recentOptionTrail[index] === id);

    if (!matches) {
      return false;
    }

    this.unlockedSecretIds.add(config.id);
    this.rootOptions = this.buildRootOptions();
    this.path = [];
    this.recentOptionTrail = [];
    this.audio.playRewardBurst(this.chapter?.vibe ?? 'gold');
    this.secretUnlocked.emit({
      id: config.id,
      zone: this.chapter?.zone ?? this.zone,
      title: config.title
    });
    this.setResponse(`* Senal oculta descifrada: ${config.title}.\n${config.response}`);
    return true;
  }

  private findOptionById(optionId: string, options: OptionNode[]): OptionNode | null {
    for (const option of options) {
      if (option.id === optionId) {
        return option;
      }

      if (option.children?.length) {
        const nested = this.findOptionById(optionId, option.children);
        if (nested) {
          return nested;
        }
      }
    }

    return null;
  }

  private buildLearningsResponse(): string {
    if (!this.chapter?.learnings.length) {
      return '* Esta sala a\u00fan no tiene aprendizajes registrados.';
    }

    return `* Lo que deja esta sala:\n- ${this.chapter.learnings.join('\n- ')}`;
  }

  private buildSpotlightResponse(): string {
    if (!this.chapter?.spotlight.length) {
      return '* No hay puntos destacados registrados para esta sala.';
    }

    const items = this.chapter.spotlight.map((item) => `${item.label}: ${item.value}`);
    return `* Radar r\u00e1pido de ${this.chapter.zone}:\n- ${items.join('\n- ')}`;
  }

  private buildRelicScanResponse(): string {
    if (!this.chapter) {
      return '* No hay reliquia registrada porque la terminal todav\u00eda no est\u00e1 vinculada a una sala.';
    }

    return [
      `* Reliquia registrada: ${this.chapter.archive.relic}.`,
      `Tipo detectado: ${this.chapter.archive.relicType}.`,
      `Pulso asociado: ${this.chapter.archive.pulse}.`
    ].join('\n');
  }

  private buildRelicProfileResponse(): string {
    if (!this.chapter) {
      return '* No hay ficha de reliquia disponible.';
    }

    return [
      `* ${this.chapter.archive.relic} pertenece a ${this.chapter.zone}.`,
      `Archivo base: ${this.chapter.archive.relicType}.`,
      this.chapter.archive.secret
    ].join('\n');
  }

  private buildRelicEchoResponse(): string {
    if (!this.chapter) {
      return '* No hay eco moderno registrado para esta reliquia.';
    }

    return [
      `* Eco moderno de ${this.chapter.archive.relic}:`,
      this.chapter.archive.modernEcho,
      `Lectura sugerida: ${this.chapter.archive.recommendation}`
    ].join('\n');
  }

  private setResponse(text: string): void {
    this.activeResponse = text;
    this.responseTick += 1;
  }
}
