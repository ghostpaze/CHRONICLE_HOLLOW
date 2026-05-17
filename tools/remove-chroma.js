const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node tools/remove-chroma.js <input.png> <output.png>');
  process.exit(1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isBackgroundCandidate(r, g, b) {
  return g > 120 && g - Math.max(r, b) > 45;
}

function isStrongBackground(r, g, b) {
  return g > 160 && g - Math.max(r, b) > 65;
}

fs.createReadStream(inputPath)
  .pipe(new PNG())
  .on('parsed', function parsed() {
    const width = this.width;
    const height = this.height;
    const visited = new Uint8Array(width * height);
    const queue = [];

    const enqueue = (x, y) => {
      const index = y * width + x;
      if (visited[index]) {
        return;
      }

      const pixel = index * 4;
      const r = this.data[pixel];
      const g = this.data[pixel + 1];
      const b = this.data[pixel + 2];
      if (!isBackgroundCandidate(r, g, b)) {
        return;
      }

      visited[index] = 1;
      queue.push(index);
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x, 0);
      enqueue(x, height - 1);
    }

    for (let y = 0; y < height; y += 1) {
      enqueue(0, y);
      enqueue(width - 1, y);
    }

    while (queue.length) {
      const index = queue.shift();
      if (index == null) {
        continue;
      }

      const x = index % width;
      const y = Math.floor(index / width);
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
          continue;
        }

        enqueue(nx, ny);
      }
    }

    for (let i = 0; i < this.data.length; i += 4) {
      const pixelIndex = i / 4;
      if (!visited[pixelIndex]) {
        continue;
      }

      const r = this.data[i];
      const g = this.data[i + 1];
      const b = this.data[i + 2];
      this.data[i + 3] = isStrongBackground(r, g, b) ? 0 : clamp(Math.round(this.data[i + 3] * 0.18), 0, 255);
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    this.pack().pipe(fs.createWriteStream(outputPath));
  })
  .on('error', (error) => {
    console.error(error);
    process.exit(1);
  });
