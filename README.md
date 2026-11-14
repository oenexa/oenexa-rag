# OENEXA RAG Service (`oenexa-rag`)

> **Retrieval-Augmented Generation (RAG) & Vector Knowledge Engine**  
> Governed by the OENEXA AI Architecture & Machine Learning Organizations.

## 1. Domain Ownership
This repository authoritatively owns the **AI Knowledge & RAG Domain**:
- **Owned Data**: Vector Embeddings, Semantic Document Chunks, Vector Index, Corpus Metadata.
- **Owned APIs**: `POST /v1/rag/ingest`, `POST /v1/rag/query`, `GET /v1/rag/corpus`.
- **Database Boundary**: Isolated `oenexa-rag-prod-db` (pgvector). Zero shared databases.
