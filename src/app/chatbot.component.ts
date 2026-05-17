import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SpriteService } from './sprite.service';
import { Chapter } from './story.models';

interface OptionNode {
  id: string;
  label: string;
  response?: string;
  children?: OptionNode[];
  action?: 'reset';
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnInit, OnChanges {
  @Input() zone = '';
  @Input() chapter: Chapter | null = null;

  readonly name = 'SANS';
  readonly zonePrompts: Record<string, string> = {
    'PROTO ROOM': 'Abre menus sobre origen, prototipos y el salto del experimento a la industria.',
    'ARCADE CORE': 'Esta terminal carga historia de arcade, high scores y diseno de partidas cortas.',
    'HOME PORT': 'Aqui el foco cambia a consolas, vida en casa y mundos que acompanaban durante semanas.',
    'GENRE VAULT': 'Esta sala sirve para comparar emociones: que cambia cuando cambian las reglas.',
    'METROID DEPTHS': 'En esta zona todo gira alrededor de mapa, memoria, bloqueos y rutas que vuelven a abrirse.',
    'INDIE FORGE': 'Esta terminal se centra en voz autoral, riesgo creativo e identidad propia.',
    'NEXT BIT': 'Aqui miramos el futuro del medio: accesibilidad, interfaces nuevas y preservacion.'
  };

  rootOptions: OptionNode[] = [];
  guidePortrait = '';
  activeResponse = '';
  responseTick = 0;
  path: OptionNode[] = [];

  constructor(private sprite: SpriteService) {}

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
    if (option.action === 'reset') {
      this.home();
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
    this.setResponse(this.defaultResponse());
  }

  private defaultResponse(): string {
    const prompt = this.zonePrompts[this.zone] ?? 'Elige una rama y te abro el tema por capas, sin repetir el mismo menu en cada sala.';

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
    const options: OptionNode[] = [this.buildRoomScanOption(), ...this.buildZoneSpecificOptions()];
    options.push({
      id: 'reset',
      label: 'Cerrar terminal',
      action: 'reset'
    });
    return options;
  }

  private buildRoomScanOption(): OptionNode {
    if (!this.chapter) {
      return {
        id: 'room-scan',
        label: 'Escanear sala',
        response: '* La terminal espera datos de una sala activa para abrir menus contextuales.'
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
          label: 'Lo que aprendes aqui',
          response: this.buildLearningsResponse()
        },
        {
          id: 'room-spotlight',
          label: 'Radar rapido',
          response: this.buildSpotlightResponse()
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
          '* Aqui el videojuego todavia es laboratorio, pero ya se siente la magia: reglas simples, respuesta inmediata y curiosidad tecnica.',
        children: [
          {
            id: 'proto-experiments-games',
            label: 'Tennis for Two y Spacewar!',
            response:
              '* Esos prototipos demostraron que una pantalla podia responder al jugador en tiempo real. Antes de las grandes sagas, ya existia la sensacion de jugar con una maquina.'
          },
          {
            id: 'proto-experiments-bases',
            label: 'Que nace aqui',
            response:
              '* En esta sala nacen tres bases que siguen vivas: objetivo claro, feedback instantaneo y ganas de repetir para mejorar.'
          }
        ]
      },
      {
        id: 'proto-commercial',
        label: 'Salto comercial',
        response:
          '* El paso importante no fue solo inventar algo jugable, sino hacerlo entendible para mucha gente. Ahi Pong cambia la escala de todo.',
        children: [
          {
            id: 'proto-commercial-pong',
            label: 'Por que Pong cambia todo',
            response:
              '* Pong simplifica la idea hasta volverla obvia, adictiva y facil de compartir. Esa claridad convierte el experimento en producto comercial.'
          },
          {
            id: 'proto-commercial-market',
            label: 'Del laboratorio al publico',
            response:
              '* Cuando el juego sale del laboratorio aparece la industria: maquinas, jugadores, negocio y un lenguaje comun para hablar de jugar.'
          }
        ]
      },
      {
        id: 'proto-legacy',
        label: 'Legado de esta sala',
        response:
          '* Aunque hoy los juegos sean enormes, esta sala recuerda que el corazon sigue siendo sencillo: una accion clara y una respuesta que engancha.',
        children: [
          {
            id: 'proto-legacy-modern',
            label: 'Herencia en juegos modernos',
            response:
              '* Cada buen juego moderno todavia cuida lo que aqui se aprende: controles fiables, reglas entendibles y una curva que invita a insistir.'
          },
          {
            id: 'proto-legacy-reading',
            label: 'Como leer esta etapa',
            response:
              '* No la mires como una fase torpe. Mirala como el momento en que se definio el verbo jugar en formato digital.'
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
          '* En ARCADE CORE todo esta pensado para que jugar tambien se vea y se escuche. La sala no era privada: era escenario.',
        children: [
          {
            id: 'arcade-culture-score',
            label: 'High score y prestigio',
            response:
              '* El puntaje no era solo numero. Era reputacion, comparacion y motivo para volver. Por eso esta etapa vuelve social algo que parecia individual.'
          },
          {
            id: 'arcade-culture-spectacle',
            label: 'Mirar tambien era jugar',
            response:
              '* En una sala arcade mucha gente aprendia observando. La audiencia entendia rutas, riesgos y habilidad antes incluso de tocar la cabina.'
          }
        ]
      },
      {
        id: 'arcade-economy',
        label: 'Diseno por monedas',
        response:
          '* La moneda imponia disciplina. Los juegos debian explicar rapido, exigir pronto y dejarte con ganas de otra partida.',
        children: [
          {
            id: 'arcade-economy-loop',
            label: 'Partidas cortas, tension alta',
            response:
              '* El arcade comprimia el placer en segundos: aprender deprisa, fallar deprisa y querer volver enseguida. Ese ritmo definio muchisimo diseno posterior.'
          },
          {
            id: 'arcade-economy-difficulty',
            label: 'Dificultad como negocio',
            response:
              '* La dificultad no era casual. Debia desafiar lo suficiente para cobrar otra moneda sin sentirse injusta desde el primer minuto.'
          }
        ]
      },
      {
        id: 'arcade-icons',
        label: 'Cabinas clave',
        response:
          '* Pac-Man, Space Invaders o Donkey Kong no solo fueron exitos: fijaron gestos, ritmos y formas de leer una pantalla.',
        children: [
          {
            id: 'arcade-icons-legacy',
            label: 'Que heredan hoy',
            response:
              '* Muchos juegos de accion actuales heredan del arcade su claridad visual, la lectura del peligro y el valor de una respuesta inmediata.'
          },
          {
            id: 'arcade-icons-afterlife',
            label: 'Arcade fuera del arcade',
            response:
              '* Aunque las cabinas ya no dominen el mercado, su ADN sigue en juegos moviles, sesiones rapidas, leaderboards y retos de habilidad.'
          }
        ]
      }
    ];
  }

  private buildHomePortOptions(): OptionNode[] {
    return [
      {
        id: 'home-rhythm',
        label: 'Del arcade al sofa',
        response:
          '* Cuando la consola entra a casa, cambia el ritmo. Ya no todo depende de una partida corta: aparece el habito, el progreso y el tiempo largo.',
        children: [
          {
            id: 'home-rhythm-change',
            label: 'Por que cambia la experiencia',
            response:
              '* En casa puedes explorar con calma, guardar progreso y volver manana. Eso abre espacio para campanas largas, secretos y mundos persistentes.'
          },
          {
            id: 'home-rhythm-sharing',
            label: 'Jugar en familia o con amigos',
            response:
              '* El hogar convierte el videojuego en rutina compartida: turnos, cooperativo, tardes de sofa y recuerdos ligados a una misma pantalla.'
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
              '* Cuando un jugador convive mas tiempo con un juego, los personajes dejan de ser una cara en pantalla y se vuelven compania, mito y marca.'
          },
          {
            id: 'home-franchises-memory',
            label: 'Memoria de sala',
            response:
              '* Esta etapa importa porque mezcla tecnologia y vida cotidiana. Las consolas no solo cambiaron que se jugaba, tambien donde y con quien.'
          }
        ]
      },
      {
        id: 'home-hardware',
        label: 'Saltos de hardware',
        response:
          '* Cada generacion domestica abre una puerta nueva: mejores mandos, mas almacenamiento, sonido mas rico y mundos mas ambiciosos.',
        children: [
          {
            id: 'home-hardware-3d',
            label: 'De 8 bits a 3D',
            response:
              '* El crecimiento tecnico no fue puro brillo visual. Cada salto amplio la forma de moverse, narrar, guardar y poblar un mundo de juego.'
          },
          {
            id: 'home-hardware-control',
            label: 'Por que importa el mando',
            response:
              '* El mando domestico define intimidad y costumbre. Botones, sticks y ergonomia cambian mucho la forma en que el cuerpo aprende un juego.'
          }
        ]
      }
    ];
  }

  private buildGenreVaultOptions(): OptionNode[] {
    return [
      {
        id: 'genre-emotions',
        label: 'Generos y emociones',
        response:
          '* Esta sala no clasifica por capricho. Usa los generos para mostrar como las reglas cambian lo que el jugador siente.',
        children: [
          {
            id: 'genre-emotions-compare',
            label: 'Accion, puzzle y RPG',
            response:
              '* Accion pide reflejos, puzzle pide comprension y RPG pide crecimiento dentro de un mundo. Cada genero reorganiza el tipo de placer que ofrece.'
          },
          {
            id: 'genre-emotions-tension',
            label: 'Tension y exploracion',
            response:
              '* Survival horror y aventura manipulan informacion, ritmo y seguridad. Cambiar esos factores cambia por completo la emocion dominante.'
          }
        ]
      },
      {
        id: 'genre-rules',
        label: 'Comparar reglas',
        response:
          '* Si cambias recursos, velocidad o informacion, cambia la emocion central. Esa es la lectura clave de esta boveda.',
        children: [
          {
            id: 'genre-rules-design',
            label: 'Que mira un diseno',
            response:
              '* Un diseñador observa que acciones se repiten, que castigos existen, que se recompensa y que nivel de informacion recibe el jugador.'
          },
          {
            id: 'genre-rules-labels',
            label: 'Por que sirven las etiquetas',
            response:
              '* Las etiquetas sirven para orientarse y comparar. No son jaulas perfectas, pero ayudan a leer intenciones, ritmos y expectativas.'
          }
        ]
      },
      {
        id: 'genre-hybrids',
        label: 'Hibridos',
        response:
          '* Muchos juegos actuales mezclan generos porque buscan sensaciones mas ricas que una sola formula cerrada.',
        children: [
          {
            id: 'genre-hybrids-examples',
            label: 'Ejemplos de mezcla',
            response:
              '* Un metroidvania puede tomar combate de accion, progresion de RPG y atmosfera de horror. La mezcla funciona cuando todas las capas empujan la misma idea.'
          },
          {
            id: 'genre-hybrids-works',
            label: 'Cuando un hibrido funciona',
            response:
              '* Funciona cuando la mezcla suma claridad en vez de ruido. Si cada sistema refuerza la emocion principal, el hibrido se siente natural.'
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
          '* En un metroidvania el espacio no es decorado. El mapa guarda promesas, rutas bloqueadas y recuerdos que vuelven mas tarde.',
        children: [
          {
            id: 'metroid-map-memory',
            label: 'Memoria espacial',
            response:
              '* Este genero recompensa recordar un pasillo raro, una cornisa imposible o una puerta que parecia inutil. El mapa se queda contigo.'
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
          '* Volver atras no aburre cuando el regreso cambia tu lectura del mundo. La gracia esta en regresar con otra capacidad y otra mirada.',
        children: [
          {
            id: 'metroid-return-gating',
            label: 'Gating por habilidades',
            response:
              '* El bloqueo elegante te muestra una limitacion hoy para convertirla en recompensa manana. No solo ganas poder: ganas lectura del espacio.'
          },
          {
            id: 'metroid-return-reward',
            label: 'Recompensa del regreso',
            response:
              '* La satisfaccion aparece cuando conectas recuerdos con progreso. El juego te dice que si estabas prestando atencion, el mundo te responde.'
          }
        ]
      },
      {
        id: 'metroid-library',
        label: 'Referencias del genero',
        response:
          '* Esta sala existe porque algunos juegos definieron muy bien la formula y otros la expandieron con personalidad propia.',
        children: [
          {
            id: 'metroid-library-classics',
            label: 'Clasicos',
            response:
              '* Super Metroid y Symphony of the Night suelen aparecer como referencias porque fijan de forma muy clara el valor del mapa, el regreso y el descubrimiento.'
          },
          {
            id: 'metroid-library-modern',
            label: 'Versiones modernas',
            response:
              '* Hollow Knight, Ori o Blasphemous muestran como la formula sigue viva: misma base estructural, pero con tonos, ritmos y sensibilidades muy distintas.'
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
          '* En INDIE FORGE la identidad pesa mas que la escala. Muchos proyectos destacan porque se sienten hechos por una voz concreta.',
        children: [
          {
            id: 'indie-voice-feeling',
            label: 'Por que se sienten personales',
            response:
              '* Muchos indies transmiten una intencion muy clara porque tienen menos filtros. A veces no buscan impresionar por tamano, sino por sensibilidad.'
          },
          {
            id: 'indie-voice-style',
            label: 'Arte y musica como firma',
            response:
              '* En esta escena la direccion artistica y la musica no son adorno. Suelen ser parte central de la identidad y del recuerdo que deja el juego.'
          }
        ]
      },
      {
        id: 'indie-risk',
        label: 'Riesgo y escala',
        response:
          '* Un equipo pequeno puede probar ideas raras, intimas o filosas porque no necesita mover una maquinaria inmensa para existir.',
        children: [
          {
            id: 'indie-risk-advantages',
            label: 'Ventajas de ser pequeno',
            response:
              '* Menos capas pueden significar decisiones mas rapidas, tono mas coherente y libertad para apostar por una idea muy especifica.'
          },
          {
            id: 'indie-risk-limits',
            label: 'Limites que empujan creatividad',
            response:
              '* La falta de presupuesto no siempre resta. Muchas veces obliga a recortar bien, afilar el concepto y encontrar una identidad mas fuerte.'
          }
        ]
      },
      {
        id: 'indie-recommendations',
        label: 'Joyas para seguir',
        response:
          '* La escena indie es tan amplia que conviene entrar por sensacion: precision, misterio, calma, combate o exploracion pura.',
        children: [
          {
            id: 'indie-recommendations-precision',
            label: 'Indies de precision',
            response:
              '* Celeste o Dead Cells son buenas puertas si quieres control fino, ritmo alto y una relacion muy directa entre manos y pantalla.'
          },
          {
            id: 'indie-recommendations-atmosphere',
            label: 'Indies de atmosfera',
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
          '* El futuro del medio no solo va de potencia. Va de abrir puertas para que mas personas puedan jugar, entender y disfrutar.',
        children: [
          {
            id: 'next-accessibility-options',
            label: 'Opciones que cambian todo',
            response:
              '* Subtitulos, remapeo, ayudas visuales, dificultad adaptable o lectores de interfaz pueden convertir una barrera en una experiencia posible.'
          },
          {
            id: 'next-accessibility-design',
            label: 'Disenar para mas gente',
            response:
              '* Pensar en accesibilidad desde el inicio no recorta el juego. Suele volverlo mas claro, mas flexible y mejor resuelto para casi todo el mundo.'
          }
        ]
      },
      {
        id: 'next-interfaces',
        label: 'Interfaces nuevas',
        response:
          '* VR, control tactil, nube, juego cruzado o herramientas creativas cambian no solo el dispositivo, sino tambien la forma de pensar el juego.',
        children: [
          {
            id: 'next-interfaces-platforms',
            label: 'Que cambia con VR y nube',
            response:
              '* Cambian la presencia, el acceso y hasta el tiempo de entrada. Algunas interfaces acercan el cuerpo; otras reducen friccion para empezar a jugar.'
          },
          {
            id: 'next-interfaces-tools',
            label: 'Herramientas para crear',
            response:
              '* El futuro tambien incluye mejores motores, pipelines mas rapidos y mas personas capaces de crear juegos sin depender de estudios gigantes.'
          }
        ]
      },
      {
        id: 'next-preservation',
        label: 'Preservar para avanzar',
        response:
          '* Mirar al futuro sin conservar el pasado deja huecos. Preservar juegos, hardware e historia tambien es una forma de disenar mejor lo que viene.',
        children: [
          {
            id: 'next-preservation-why',
            label: 'Por que preservar importa',
            response:
              '* Sin preservacion se pierden tecnicas, contextos y obras enteras. Y si se pierde la memoria del medio, tambien se empobrece su futuro.'
          },
          {
            id: 'next-preservation-connection',
            label: 'Como conecta con la ruta',
            response:
              '* Esta ultima sala cierra el recorrido recordando algo simple: para imaginar lo nuevo, tambien necesitamos entender y cuidar lo que ya existio.'
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
        response: '* Esta terminal adapta sus menus a la zona activa para que el recorrido siempre responda al lugar en el que estas.'
      },
      {
        id: 'fallback-history',
        label: 'Recorrido del museo',
        response: '* Avanza de sala en sala para desbloquear conversaciones distintas sobre historia, generos, diseno y futuro del videojuego.'
      }
    ];
  }

  private buildLearningsResponse(): string {
    if (!this.chapter?.learnings.length) {
      return '* Esta sala aun no tiene aprendizajes registrados.';
    }

    return `* Lo que deja esta sala:\n- ${this.chapter.learnings.join('\n- ')}`;
  }

  private buildSpotlightResponse(): string {
    if (!this.chapter?.spotlight.length) {
      return '* No hay puntos destacados registrados para esta sala.';
    }

    const items = this.chapter.spotlight.map((item) => `${item.label}: ${item.value}`);
    return `* Radar rapido de ${this.chapter.zone}:\n- ${items.join('\n- ')}`;
  }

  private setResponse(text: string): void {
    this.activeResponse = text;
    this.responseTick += 1;
  }
}
