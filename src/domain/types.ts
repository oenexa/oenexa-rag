export interface DocumentChunk {
  id: string;
  documentId: string;
  title: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number; // Cosine similarity: -1.0 to 1.0
}

export interface RagQuery {
  query: string;
  topK?: number;
  minScore?: number;
}
