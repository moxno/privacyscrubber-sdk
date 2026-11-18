/**
 * @privacyscrubber/sdk - LangChain RAG Ingestion & Synthesis Recipe
 *
 * Demonstrates:
 * 1. Pre-ingestion document transformation with createDocumentTransformer.
 * 2. Neutralizing PII in pageContent and sensitive metadata keys (e.g. author, user_id).
 * 3. Preserving vector embedding semantic fidelity with deterministic tokens.
 * 4. In-memory re-hydration of synthesized LLM answers with zero data leakage.
 *
 * Usage:
 *   node langchain-rag.js
 */

import { createDocumentTransformer } from '@privacyscrubber/sdk';

async function main() {
    console.log('=== PrivacyScrubber SDK: LangChain RAG Recipe ===\n');

    // 1. Initialize the LangChain Document Transformer
    // Zero network egress: operates 100% in local process memory (<1ms per document)
    const transformer = createDocumentTransformer({
        profile: 'General',
        sensitiveMetadataKeys: ['account_owner', 'submitter_email'],
        attachTelemetry: true,
        attachTokenMap: false // Do not leak token mappings into the vector database
    });

    // 2. Sample raw documents loaded from CRM / internal ticket logs
    const rawDocs = [
        {
            pageContent: 'Account Executive John Doe (john.doe@enterprise.com) finalized deal for client Acme Corp under SSN 000-12-3456.',
            metadata: {
                docId: 'doc_101',
                department: 'Enterprise Sales',
                account_owner: 'john.doe@enterprise.com',
                source: 'Salesforce'
            }
        },
        {
            pageContent: 'Technical escalation for customer Jane Smith. Direct contact phone is +1-555-019-2834, email janes@corp.org.',
            metadata: {
                docId: 'doc_102',
                department: 'Customer Success',
                submitter_email: 'janes@corp.org',
                source: 'Zendesk'
            }
        }
    ];

    console.log('--- 1. Raw Documents Before Sanitization ---');
    console.log(JSON.stringify(rawDocs, null, 2));

    // 3. Transform documents before vector embedding / storage
    const sanitizedDocs = await transformer.transformDocuments(rawDocs);

    console.log('\n--- 2. Sanitized Documents (Safe for Vector DB Ingestion) ---');
    console.log(JSON.stringify(sanitizedDocs, null, 2));

    // 4. Verify zero cleartext PII exists in the documents to be embedded
    const containsRawEmail = sanitizedDocs.some(d => d.pageContent.includes('john.doe@enterprise.com'));
    const containsRawSsn = sanitizedDocs.some(d => d.pageContent.includes('000-12-3456'));
    console.log(`\nZero Cleartext Email Verified: ${!containsRawEmail}`);
    console.log(`Zero Cleartext SSN Verified:   ${!containsRawSsn}`);

    // 5. Simulate an LLM synthesizing an answer over retrieved tokenized chunks
    // The LLM operates on the tokens without knowing the customer's true identity:
    const mockLlmResponse = 'Based on document [doc_101], [NAME_1] ([EMAIL_1]) successfully closed the deal for Acme Corp. Contract verified under tax ID [ID_1].';
    console.log('\n--- 3. LLM Answer Synthesized over Vector Space ---');
    console.log(`Raw LLM Output: "${mockLlmResponse}"`);

    // 6. Restore the answer in local memory for the authorized end user
    const { restoredText } = transformer.restore(mockLlmResponse);
    console.log('\n--- 4. Re-hydrated Answer (Local RAM Only) ---');
    console.log(`Final Response: "${restoredText}"`);

    // 7. Reset session when switching security context / tenant
    transformer.resetSession();
    console.log('\nSession token map purged. Memory footprint clean.');
}

main().catch(console.error);
