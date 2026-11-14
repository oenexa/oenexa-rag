import { describe, it, expect } from 'vitest';
import { RagService } from '../service/RagService.js';

describe('OENEXA RAG & Vector Semantic Engine', () => {
  it('initializes default ecosystem documents and computes vector embeddings', () => {
    const rag = new RagService();
    expect(rag.getChunkCount()).toBe(3);

    const vec = rag.generateEmbedding('OENEXA sovereign L1 blockchain');
    expect(vec).toHaveLength(256);
    // Norm must be 1.0 (unit vector)
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    expect(norm).toBeCloseTo(1.0, 4);
  });

  it('performs semantic vector search and ranks relevant chunks first', () => {
    const rag = new RagService();

    const results = rag.query({
      query: 'unified portal app.oenexa.com ecosystem entry point',
      topK: 1,
    });

    expect(results).toHaveLength(1);
    expect(results[0].chunk.title).toBe('OENEXA Portal Architecture');
    expect(results[0].score).toBeGreaterThan(0.2);
  });

  it('retrieves identity authority information accurately', () => {
    const rag = new RagService();

    const results = rag.query({
      query: 'Tell me about OAuth2 and OpenID Connect authority',
      topK: 1,
    });

    expect(results).toHaveLength(1);
    expect(results[0].chunk.title).toBe('OENEXA Identity Authority');
    expect(results[0].chunk.content).toContain('id.oenexa.com');
  });
});
