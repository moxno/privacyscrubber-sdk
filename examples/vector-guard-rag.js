/**
 * @privacyscrubber/sdk - Universal Vector Database Ingestion Guard Recipe
 *
 * Demonstrates:
 * 1. Initializing createVectorIngestionGuard for Chroma, Pinecone, Qdrant, and Weaviate.
 * 2. Columnar batch sanitization for Chroma ({ ids, documents, metadatas }).
 * 3. Record-level sanitization for Pinecone and Qdrant ({ id, text/payload, metadata }).
 * 4. Search query token alignment (query tokens matched to sanitized vector space tokens).
 * 5. Transparent vector store proxy wrapping via wrapVectorStore().
 * 6. Post-retrieval in-memory re-hydration with zero vector store PII retention.
 *
 * Usage:
 *   node vector-guard-rag.js
 */

import { createVectorIngestionGuard } from '@privacyscrubber/sdk';

async function main() {
    console.log('=== PrivacyScrubber SDK: Universal Vector DB Ingestion Guard ===\n');

    // 1. Initialize the Vector Ingestion Guard
    // Operates 100% in-process RAM with zero network egress (<1ms per batch)
    const guard = createVectorIngestionGuard({
        profile: 'General',
        sensitiveMetadataKeys: ['contractor_email', 'billing_contact'],
        attachTelemetry: true
    });

    // -------------------------------------------------------------------------
    // Scenario A: Chroma Columnar Ingestion ({ ids, documents, metadatas })
    // -------------------------------------------------------------------------
    console.log('--- 1. Chroma Columnar Batch Sanitization ---');
    const chromaBatch = {
        ids: ['doc-101', 'doc-102'],
        documents: [
            'Vendor agreement with Michael Scott (mscott@dundermifflin.com), SSN 000-44-5555.',
            'Direct support line for Jim Halpert: +1-555-019-8765, email jhalpert@dundermifflin.com.'
        ],
        metadatas: [
            { branch: 'Scranton', contractor_email: 'temp.auditor@external.org' },
            { branch: 'Scranton', tier: 'Enterprise' }
        ]
    };

    const cleanChroma = guard.sanitizeRecords(chromaBatch);
    console.log('Sanitized Chroma documents:');
    console.log(cleanChroma.documents);
    console.log('Sanitized Chroma metadatas:');
    console.log(cleanChroma.metadatas);

    // -------------------------------------------------------------------------
    // Scenario B: Pinecone / Qdrant Record Array Ingestion
    // -------------------------------------------------------------------------
    console.log('\n--- 2. Pinecone & Qdrant Record Sanitization ---');
    const records = [
        {
            id: 'vec-201',
            text: 'Employee record: Pam Beesly (pamb@office.com), personal mobile 555-432-1098.',
            metadata: { role: 'Office Administrator', department: 'Operations' }
        },
        {
            id: 'vec-202',
            payload: {
                text: 'Executive escalation from Dwight Schrute (dschrute@schrutefarms.com).',
                region: 'PA'
            }
        }
    ];

    const cleanRecords = guard.sanitizeRecords(records);
    console.log('Sanitized Pinecone record:');
    console.log(cleanRecords[0]);
    console.log('Sanitized Qdrant payload:');
    console.log(cleanRecords[1]);

    // -------------------------------------------------------------------------
    // Scenario C: Search Query Token Alignment
    // When a user searches for an email or SSN that was previously ingested,
    // the query must be mapped to the identical ZTDS token before vector embedding.
    // -------------------------------------------------------------------------
    console.log('\n--- 3. Search Query Token Alignment ---');
    const rawUserQuery = 'Find agreements involving mscott@dundermifflin.com and audit history';
    const alignedQuery = guard.sanitizeQuery(rawUserQuery);

    console.log('Raw user query:     ', rawUserQuery);
    console.log('Aligned query:      ', alignedQuery.query);
    console.log('Tokens detected:    ', alignedQuery.tokensDetected);

    // -------------------------------------------------------------------------
    // Scenario D: Transparent Vector Store Proxy Wrapping
    // wrapVectorStore intercepts addDocuments/upsert and similaritySearch/query
    // to sanitize pre-write and re-hydrate post-read automatically.
    // -------------------------------------------------------------------------
    console.log('\n--- 4. Transparent Vector Store Proxy Wrapping ---');

    // Mock client simulating Chroma / Pinecone / LangChain VectorStore
    const nativeVectorStore = {
        storage: [],
        async addDocuments(docs) {
            this.storage.push(...docs);
            return { count: docs.length };
        },
        async similaritySearch(query) {
            // Emulate cosine similarity retrieval against vector store text
            return this.storage.filter(d => (d.pageContent || d.text || '').includes(query));
        }
    };

    const guardedStore = guard.wrapVectorStore(nativeVectorStore);

    // Ingest through transparent guard
    await guardedStore.addDocuments([
        {
            pageContent: 'Restricted memo: Contact CFO David Wallace at dwallace@cfo-network.com regarding Q4 EBITDA.',
            metadata: { classification: 'Confidential' }
        }
    ]);

    // Verify vector store internal memory contains ZERO plaintext PII
    const rawStored = nativeVectorStore.storage[nativeVectorStore.storage.length - 1];
    console.log('Physical vector store entry (Zero-Trust RAM):');
    console.log('  pageContent:', rawStored.pageContent);
    console.log('  Contains raw email:', rawStored.pageContent.includes('dwallace@cfo-network.com')); // false

    // Query through transparent guard: query is tokenized, retrieved results are automatically re-hydrated
    const searchResults = await guardedStore.similaritySearch('dwallace@cfo-network.com');
    console.log('\nRetrieved & Re-hydrated Search Result:');
    console.log('  pageContent:', searchResults[0].pageContent);
    console.log('  Contains authentic email:', searchResults[0].pageContent.includes('dwallace@cfo-network.com')); // true

    console.log('\nUniversal Vector Ingestion Guard recipe completed with 0 bytes network egress.');
}

main().catch(err => {
    console.error('Vector Guard Recipe Error:', err);
    process.exit(1);
});
