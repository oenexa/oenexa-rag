import http from 'node:http';
import { RagService } from './service/RagService.js';

export * from './domain/types.js';
export * from './service/RagService.js';

const rag = new RagService();
const PORT = Number(process.env.PORT) || 8087;

export const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: 'UP', service: 'oenexa-rag', chunks: rag.getChunkCount(), timestamp: new Date().toISOString() }));
  }

  if (req.url?.startsWith('/api/rag/search') && req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const q = url.searchParams.get('q') || '';
    const results = rag.query({ query: q, topK: 5 });
    res.writeHead(200);
    return res.end(JSON.stringify({ success: true, data: results }));
  }

  res.writeHead(404);
  return res.end(JSON.stringify({ success: false, error: 'Endpoint Not Found' }));
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[oenexa-rag] Vector Search & RAG Knowledge Microservice listening on port ${PORT}`);
  });
}
