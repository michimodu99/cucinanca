// Server statico minimo per lo sviluppo: node scripts/serve.mjs [porta]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const root = process.cwd();
const port = Number(process.argv[2] || 8080);
const tipi = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm' };
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = normalize(join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    const testa = { 'content-type': tipi[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store', 'accept-ranges': 'bytes' };
    // il video: Chrome chiede intervalli di byte e senza 206 resta in caricamento
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range) {
      const inizio = range[1] ? Number(range[1]) : 0;
      const fine = range[2] ? Math.min(Number(range[2]), data.length - 1) : data.length - 1;
      res.writeHead(206, { ...testa, 'content-range': `bytes ${inizio}-${fine}/${data.length}`, 'content-length': fine - inizio + 1 });
      return res.end(data.subarray(inizio, fine + 1));
    }
    res.writeHead(200, testa);
    res.end(data);
  } catch {
    res.writeHead(404); res.end('404');
  }
}).listen(port, () => console.log(`http://localhost:${port}`));
