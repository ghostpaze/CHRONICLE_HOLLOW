const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || 'dist/ghost-games');
const port = Number(process.argv[3] || 4300);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http
  .createServer((req, res) => {
    const requestPath = (req.url || '/').split('?')[0];
    const relativePath = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.join(root, relativePath);

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }

      res.setHeader('Content-Type', mime[path.extname(filePath)] || 'application/octet-stream');
      res.end(data);
    });
  })
  .listen(port, '127.0.0.1', () => {
    console.log(`Serving ${root} on http://127.0.0.1:${port}`);
  });
