import crypto from 'node:crypto';
import type { DocumentChunk, SearchResult, RagQuery } from '../domain/types.js';

export class RagService {
  private chunks: DocumentChunk[] = [];

  constructor() {
    // Seed initial ecosystem knowledge base chunks
    this.ingestDocument({
      documentId: 'doc_portal_architecture',
      title: 'OENEXA Portal Architecture',
      content: 'app.oenexa.com is the single ecosystem entry point hosting dashboard, exchange, wallet, pay, blockchain, ai, and oengo.',
    });

    this.ingestDocument({
      documentId: 'doc_identity_authority',
      title: 'OENEXA Identity Authority',
      content: 'id.oenexa.com is the central OAuth2 and OpenID Connect authority using PKCE S256 and zero-localStorage in-memory tokens.',
    });

    this.ingestDocument({
      documentId: 'doc_blockchain_l1',
      title: 'ONXC Sovereign Layer 1 Consensus',
      content: 'ONXC is the sovereign Layer 1 blockchain operating Proof-of-Stake consensus with 1 Billion fixed supply and sub-second finality.',
    });
  }

  /**
   * Deterministic toy embedding generator (bag-of-words / character hash vector)
   * Produces a normalized 64-dimensional float vector for semantic testing
   */
  public generateEmbedding(text: string): number[] {
    const dim = 256;
    const vec = new Array(dim).fill(0);
    const stopWords = new Set(['the', 'is', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for', 'with', 'where', 'does', 'user']);
    const tokens = text.toLowerCase().split(/\W+/).filter((t) => t.length > 1 && !stopWords.has(t));

    for (const token of tokens) {
      let hash = 2166136261;
      for (let i = 0; i < token.length; i++) {
        hash ^= token.charCodeAt(i);
        hash = (hash * 16777619) >>> 0;
      }
      const idx = hash % dim;
      vec[idx] += 1;
    }

    // Normalize vector (L2 norm)
    const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
    if (norm === 0) return vec;
    return vec.map((v) => v / norm);
  }

  /**
   * Computes cosine similarity between two normalized vectors
   */
  public cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    return dot;
  }

  public ingestDocument(params: {
    documentId: string;
    title: string;
    content: string;
    metadata?: Record<string, string>;
  }): DocumentChunk {
    const fullText = `${params.title} ${params.content}`;
    const chunk: DocumentChunk = {
      id: `chk_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      documentId: params.documentId,
      title: params.title,
      content: params.content,
      embedding: this.generateEmbedding(fullText),
      metadata: params.metadata,
      createdAt: new Date().toISOString(),
    };

    this.chunks.push(chunk);
    return chunk;
  }

  public query(params: RagQuery): SearchResult[] {
    const queryVec = this.generateEmbedding(params.query);
    const topK = params.topK || 5;
    const minScore = params.minScore ?? 0.0;

    const scored: SearchResult[] = this.chunks
      .map((chunk) => ({
        chunk,
        score: this.cosineSimilarity(queryVec, chunk.embedding),
      }))
      .filter((res) => res.score >= minScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }

  public getChunkCount(): number {
    return this.chunks.length;
  }
}
