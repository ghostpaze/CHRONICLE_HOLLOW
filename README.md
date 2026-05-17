# Ghost Games (Angular RPG-style Game)

Proyecto Angular que recrea una experiencia de RPG de texto inspirada en juegos clásicos con estética pixelada. El juego sigue al protagonista `Ghost` en un recorrido educativo sobre videojuegos, con un chatbot inteligente mapeado llamado `Bones` que proporciona información y recomendaciones.

## Características

- **Protagonista Ghost**: Un personaje pixelado que guía la experiencia.
- **Chatbot Bones**: Menú interactivo mapeado (sin IA) con diálogos sobre videojuegos.
- **Pantalla de Inicio**: Animada con typewriter y botón `Play`.
- **Juego de Tutorial**: 9 slides que enseñan sobre historia de videojuegos, géneros y más.
- **Pantalla Final**: Despedida dramática con animación bounce.
- **Sprites Generados**: Personajes pixelados 128x128 generados programáticamente.
- **Animaciones**: Typewriter letter-by-letter, scanlines, pulse, bounce, y efectos visuales.
- **Estilos Originales**: Inspirados en Undertale pero con diseño y assets propios.

## Requisitos

- Node.js (>=16)
- npm

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Generar sprites PNG (opcional, ya se crean en tiempo de ejecución)
npm run generate-sprites

# Ejecutar servidor de desarrollo
npm start
```

Abrirá automáticamente `http://localhost:4200` en tu navegador.

## Publicar En GitHub Pages

El proyecto ya viene preparado para desplegarse en GitHub Pages con GitHub Actions.

### 1. Crea un repositorio en GitHub

Crea un repo nuevo, por ejemplo `ghost-games`.

### 2. Sube este proyecto

```bash
git init
git add .
git commit -m "Primer commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ghost-games.git
git push -u origin main
```

### 3. Activa Pages

En GitHub entra a:

- `Settings`
- `Pages`
- En `Build and deployment`, cambia `Source` a `GitHub Actions`

El workflow ya quedó en `.github/workflows/deploy-pages.yml`, así que cada push a `main` publicará el sitio.

### 4. Tu link público

Si tu repo se llama `ghost-games`, la URL por defecto será:

`https://TU-USUARIO.github.io/ghost-games/`

Usa siempre la URL completa con la `/` final.

### 5. Probar la build exacta de Pages

```bash
npm run build:pages
```

Ese comando genera una build con `base-href` relativa para que funcione bien dentro de GitHub Pages.

## Estructura del Proyecto

```
src/
  app/
    app.component.ts         # Componente raíz (pantallas: splash, game, end)
    app.module.ts            # Módulo de la aplicación
    game.component.ts        # Tutorial/juego principal (9 slides)
    chatbot.component.ts     # Bones - chatbot mapeado
    typewriter.component.ts  # Efecto de escritura letra-por-letra
    sprite.service.ts        # Generación de sprites programática
  styles.css                 # Estilos globales con animaciones
  index.html                 # Punto de entrada HTML
  main.ts                    # Bootstrap de Angular
tools/
  generate-sprites.js        # Script Node para generar PNGs a `src/assets/`
```

## Tecnologías

- **Angular** 16
- **TypeScript**
- **HTML5 Canvas** (para generación de sprites)
- **CSS3** (animaciones y estilos)

## Notas de Diseño

- **Sprites**: Generados programáticamente en `SpriteService` (data-URLs) y opcionalmente exportados a PNG.
- **Chatbot**: Completamente mapeado; no utiliza IA, solo menús anidados predefinidos.
- **Estética**: Monocromo inspirado en RPGs clásicos con acentos de colores neon (#66ffcc, #ff66cc).
- **Tipografía**: Monospace (Courier New) para efecto retro.
- **Animaciones**: CSS keyframes + TypeScript para efectos letter-by-letter.

## Compatibilidad

- Navegadores modernos con soporte para ES2017, Canvas y CSS Grid/Flexbox.
- Probado en Chrome, Firefox y Edge.

## Licencia

Proyecto educativo. Inspirado en estéticas de juegos clásicos pero con assets y personajes originales.
