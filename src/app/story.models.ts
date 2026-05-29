export type Speaker = 'guide' | 'hero';
export type Tone = 'gold' | 'cyan' | 'rose' | 'lime' | 'violet';

export interface Spotlight {
  label: string;
  value: string;
  tone: Tone;
}

export interface ChapterArchive {
  relic: string;
  relicType: string;
  pulse: string;
  secret: string;
  modernEcho: string;
  recommendation: string;
}

export interface ChapterEncounterStep {
  label: string;
  response: string;
}

export interface ChapterEncounter {
  title: string;
  briefing: string;
  reward: string;
  steps: ChapterEncounterStep[];
  completion: string;
}

export interface Chapter {
  id: string;
  zone: string;
  title: string;
  subtitle: string;
  objective: string;
  speaker: Speaker;
  speakerName: string;
  dialogue: string;
  summary: string;
  learnings: string[];
  spotlight: Spotlight[];
  vibe: Tone;
  archive: ChapterArchive;
  encounter: ChapterEncounter;
}

export interface RunSecretLog {
  id: string;
  zone: string;
  title: string;
}

export interface RunReport {
  visitedZones: string[];
  relicsUnlocked: string[];
  completionPercent: number;
  finalChapterId: string;
  eventsCompleted: string[];
  secretFinds: RunSecretLog[];
  playerTitle: string;
  finalMessage: string;
}

const CHAPTER_ENCOUNTERS: Record<string, ChapterEncounter> = {
  'proto-room': {
    title: 'PROTOCOLO DE ARRANQUE',
    briefing: 'Calibra el osciloscopio y provoca el primer rebote. Esta sala gana fuerza cuando la historia se siente como experimento vivo.',
    reward: 'Registro de prototipo estable',
    steps: [
      {
        label: 'CALIBRAR SEÑAL',
        response: 'El trazo se estabiliza. La pantalla ya no es un mueble raro: empieza a responder como si estuviera esperando al jugador.'
      },
      {
        label: 'LANZAR REBOTE',
        response: 'El prototipo entra en juego. La acción mínima ya produce tensión, ensayo y deseo de repetir.'
      }
    ],
    completion: 'PROTOCOLO COMPLETO. El origen del medio deja de verse remoto: ahora se siente como una chispa todavía encendida.'
  },
  'arcade-core': {
    title: 'DESAFÍO DE CABINA',
    briefing: 'Inserta la ficha y comprime la sala en una sola partida. Aquí la historia se entiende mejor cuando se vuelve espectáculo.',
    reward: 'Marcador de alta tensión',
    steps: [
      {
        label: 'INSERTAR FICHA',
        response: 'La cabina despierta. Todo queda listo para una partida corta, ruidosa y pública.'
      },
      {
        label: 'ROMPER HIGH SCORE',
        response: 'El nombre sube a la tabla. La partida deja de ser privada y se convierte en reputación.'
      }
    ],
    completion: 'CABINA DOMINADA. El arcade queda registrado como ritual de presión, reflejos y prestigio visible.'
  },
  'home-port': {
    title: 'RITUAL DE SALA',
    briefing: 'Lleva la experiencia al hogar. La misión de esta sala es mostrar cuando jugar deja de ser visita y se vuelve costumbre.',
    reward: 'Memoria doméstica sincronizada',
    steps: [
      {
        label: 'INSERTAR CARTUCHO',
        response: 'La consola entra en calor. El juego deja de ser instante suelto y empieza a prometer permanencia.'
      },
      {
        label: 'GUARDAR PARTIDA',
        response: 'El progreso queda a salvo. Ahora la aventura puede regresar mañana y seguir creciendo contigo.'
      }
    ],
    completion: 'SALÓN CONFIGURADO. El hogar queda marcado como el lugar donde los videojuegos aprenden a acompañar semanas enteras.'
  },
  'genre-vault': {
    title: 'MIXER DE GÉNEROS',
    briefing: 'Cruza reglas sin perder la emoción central. Esta bóveda funciona cuando los sistemas se comparan como sensaciones, no como etiquetas.',
    reward: 'Mapa emocional clasificado',
    steps: [
      {
        label: 'CRUZAR SISTEMAS',
        response: 'Las fronteras empiezan a doblarse. Acción, puzzle y RPG ya no se ven como cajas separadas, sino como vectores de experiencia.'
      },
      {
        label: 'VALIDAR HÍBRIDO',
        response: 'La mezcla encaja. Las reglas distintas empiezan a empujar la misma emoción en lugar de chocar.'
      }
    ],
    completion: 'HÍBRIDO CONSOLIDADO. La sala queda sellada como un mapa para leer por qué cada género cambia el tipo de placer.'
  },
  'metroid-depths': {
    title: 'RUTA DE RETORNO',
    briefing: 'Marca un atajo y vuelve con una nueva capacidad. Aquí la gracia no es solo avanzar, sino releer un espacio conocido.',
    reward: 'Atajo maestro abierto',
    steps: [
      {
        label: 'MARCAR ATAJO',
        response: 'El mapa registra una promesa. Esa puerta imposible ya no es obstáculo: es deuda con el futuro.'
      },
      {
        label: 'ABRIR COMPUERTA',
        response: 'La ruta vieja cambia de valor. El pasado del mapa se vuelve recompensa presente.'
      }
    ],
    completion: 'LABERINTO REESCRITO. La memoria espacial queda activada como una mecánica emocional, no solo utilitaria.'
  },
  'indie-forge': {
    title: 'HORNO DE AUTOR',
    briefing: 'Enciende la forja y deja que la idea principal respire. Esta sala vale por su voz, no por su tamaño.',
    reward: 'Firma creativa estabilizada',
    steps: [
      {
        label: 'ENCENDER FORJA',
        response: 'La pieza base empieza a tomar forma. Todo sobra menos la intención clara.'
      },
      {
        label: 'SELLAR BUILD',
        response: 'La obra queda firmada. Identidad, tono y riesgo ya no compiten entre sí: trabajan juntos.'
      }
    ],
    completion: 'FORJA CERRADA. La sala registra que una escala pequeña también puede dejar una huella enorme.'
  },
  'next-bit': {
    title: 'SEÑAL ABIERTA',
    briefing: 'Activa accesibilidad y lanza la transmisión futura. El cierre del recorrido funciona mejor cuando abre puertas, no cuando presume potencia.',
    reward: 'Canal futuro en emisión',
    steps: [
      {
        label: 'ACTIVAR ACCESO',
        response: 'La interfaz se vuelve más amplia. El futuro empieza a sentirse mejor cuando más personas pueden entrar.'
      },
      {
        label: 'LANZAR SEÑAL',
        response: 'La transmisión queda abierta. Preservación, nuevas interfaces y juego inclusivo ya comparten la misma frecuencia.'
      }
    ],
    completion: 'SEÑAL ESTABLE. El recorrido termina mirando hacia delante sin perder la memoria de lo que lo hizo posible.'
  }
};

const CHAPTER_LIBRARY: Array<Omit<Chapter, 'encounter'>> = [
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
    vibe: 'violet',
    archive: {
      relic: 'Osciloscopio Fundacional',
      relicType: 'Prototipo vivo',
      pulse: 'Curiosidad t\u00e9cnica',
      secret:
        'Los primeros juegos importan porque convierten una pantalla en una relaci\u00f3n: acci\u00f3n, respuesta y deseo de repetir.',
      modernEcho:
        'Cada tutorial limpio, cada feedback instant\u00e1neo y cada juego minimalista heredan la claridad brutal de esta etapa.',
      recommendation:
        'Piensa esta sala como el momento en que se inventa el verbo jugar en digital, no como una prehistoria torpe.'
    }
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
    vibe: 'rose',
    archive: {
      relic: 'Ficha de Alta Tensi\u00f3n',
      relicType: 'Moneda ritual',
      pulse: 'Competencia p\u00fablica',
      secret:
        'El arcade no solo inventa una econom\u00eda; inventa una audiencia. Jugar tambi\u00e9n era ser observado.',
      modernEcho:
        'Leaderboards, speedruns, clips virales y retos de habilidad siguen operando con la misma energ\u00eda social de las cabinas.',
      recommendation:
        'Cuando quieras entender por qu\u00e9 un juego “engancha r\u00e1pido”, vuelve a pensar en la disciplina que impon\u00eda una sola moneda.'
    }
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
    vibe: 'gold',
    archive: {
      relic: 'Cartucho de Sala',
      relicType: 'Objeto dom\u00e9stico',
      pulse: 'Ritual cotidiano',
      secret:
        'El verdadero salto no fue solo tecnol\u00f3gico: fue emocional. La consola meti\u00f3 los videojuegos dentro de la memoria familiar.',
      modernEcho:
        'Los mundos persistentes, los juegos largos y el apego a personajes viven de este momento en que jugar consigui\u00f3 un lugar fijo en casa.',
      recommendation:
        'Mira esta etapa como el nacimiento del videojuego acompa\u00f1ante: ese que comparte semanas, no solo minutos.'
    }
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
    vibe: 'lime',
    archive: {
      relic: 'Taxonom\u00eda Inestable',
      relicType: 'Mapa mental',
      pulse: 'Lectura de sistemas',
      secret:
        'Los g\u00e9neros importan menos como etiquetas de tienda y m\u00e1s como herramientas para leer qu\u00e9 sensaci\u00f3n promete un sistema.',
      modernEcho:
        'Los juegos actuales se vuelven memorables cuando mezclan g\u00e9neros con intenci\u00f3n, no cuando acumulan mec\u00e1nicas sin una emoci\u00f3n central.',
      recommendation:
        'Si un juego te encanta, intenta describirlo por la emoci\u00f3n que construye y no solo por la categor\u00eda que le asignan.'
    }
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
    vibe: 'cyan',
    archive: {
      relic: 'Llave de Atajo',
      relicType: 'Dispositivo de regreso',
      pulse: 'Memoria espacial',
      secret:
        'Este g\u00e9nero vuelve emocionante el pasado: el lugar que ya viste cambia de valor cuando t\u00fa cambias como jugador.',
      modernEcho:
        'El dise\u00f1o contempor\u00e1neo aprende mucho de esta estructura porque convierte la exploraci\u00f3n en una conversaci\u00f3n con la memoria.',
      recommendation:
        'La mejor forma de leer un metroidvania es mirar c\u00f3mo te ense\u00f1a a recordar, no solo c\u00f3mo te deja avanzar.'
    }
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
    vibe: 'rose',
    archive: {
      relic: 'Forja de Autor',
      relicType: 'Motor independiente',
      pulse: 'Riesgo creativo',
      secret:
        'La escala peque\u00f1a puede producir una voz m\u00e1s fuerte. Menos capas a veces significan una identidad m\u00e1s n\u00edtida.',
      modernEcho:
        'Muchos de los juegos m\u00e1s queridos de la \u00faltima d\u00e9cada redefinen g\u00e9neros enteros desde equipos diminutos pero obsesivamente coherentes.',
      recommendation:
        'Cuando un indie te impacte, preg\u00fantate qu\u00e9 decisi\u00f3n valiente tom\u00f3 que un proyecto gigante quiz\u00e1 no se habr\u00eda permitido.'
    }
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
    vibe: 'violet',
    archive: {
      relic: 'Bit de Futuro',
      relicType: 'Se\u00f1al abierta',
      pulse: 'Dise\u00f1o inclusivo',
      secret:
        'El futuro del medio no se gana solo con fidelidad visual: se gana ampliando qui\u00e9n puede entrar, crear, recordar y jugar.',
      modernEcho:
        'Accesibilidad, preservaci\u00f3n y nuevas interfaces ya no son notas al pie; son terreno central del dise\u00f1o contempor\u00e1neo.',
      recommendation:
        'La mejor pregunta final no es “qu\u00e9 tan realista se ver\u00e1”, sino “para qui\u00e9n se abrir\u00e1 el juego que viene”.'
    }
  }
];

export const GAME_CHAPTERS: Chapter[] = CHAPTER_LIBRARY.map((chapter) => ({
  ...chapter,
  encounter: CHAPTER_ENCOUNTERS[chapter.id]
}));
