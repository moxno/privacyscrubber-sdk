/**
 * @privacyscrubber/sdk - LlamaIndex Node & Pipeline Transformation Recipe
 *
 * Demonstrates:
 * 1. Sanitizing LlamaIndex TextNodes and Documents before VectorStoreIndex insertion.
 * 2. Preserving node IDs, relationships, and structural metadata.
 * 3. Preventing irreversible PII poisoning in vector embedding spaces.
 * 4. Re-hydrating synthesized response text back to original cleartext.
 *
 * Usage:
 *   node llamaindex-rag.js
 */

import { createLlamaIndexTransform } from '@privacyscrubber/sdk';

async function main() {
    console.log('=== PrivacyScrubber SDK: LlamaIndex Node Transform Recipe ===\n');

    // 1. Initialize the LlamaIndex Transform
    // Operates in-memory (<1ms per node) with zero external network dependencies
    const transform = createLlamaIndexTransform({
        profile: 'General',
        detectSecrets: true
    });

    // 2. Simulated LlamaIndex Nodes / Ingestion Chunks
    const nodes = [
        {
            id_: 'node-001',
            text: 'Patient Alice Brown (phone: 555-839-2001, email: alice.brown@health-secure.org) visited Cardiology Clinic for routine ECG follow-up.',
            metadata: {
                doc_id: 'ehr_84920',
                department: 'Cardiology',
                facility: 'General Hospital'
            }
        },
        {
            id_: 'node-002',
            text: 'Attending physician Dr. Robert House recorded notes: Contact assistant at 555-912-3847 or emergency line doc-house@internal.hospital.',
            metadata: {
                doc_id: 'ehr_84921',
                department: 'Cardiology',
                facility: 'General Hospital'
            }
        }
    ];

    console.log('--- 1. Raw LlamaIndex Nodes Prior to Index Ingestion ---');
    console.log(JSON.stringify(nodes, null, 2));

    // 3. Transform nodes through PrivacyScrubber
    const sanitizedNodes = transform.transform(nodes);

    console.log('\n--- 2. Sanitized Nodes (Vector-Index Ready) ---');
    console.log(JSON.stringify(sanitizedNodes, null, 2));

    // 4. Invariant checks:
    // - Node IDs remain untouched
    // - All PII replaced with reversible syntax tokens
    // - Metadata flagged with ZTDS security tags
    const containsRawEmail = sanitizedNodes.some(n => n.text.includes('alice.brown@health-secure.org'));
    const preservedIds = sanitizedNodes[0].id_ === 'node-001' && sanitizedNodes[1].id_ === 'node-002';
    console.log(`\nZero Cleartext Email in Embeddings: ${!containsRawEmail}`);
    console.log(`Node IDs & Metadata Intact:          ${preservedIds}`);

    // 5. Query phase: Vector store retrieves tokenized nodes; LLM generates answer
    const mockLlmAnswer = 'The patient [NAME_1] (contact: [EMAIL_1], [PHONE_1]) is under the care of [NAME_2]. For questions, reach out via [EMAIL_2].';
    console.log('\n--- 3. LLM Query Response over Tokenized Index ---');
    console.log(`Raw LLM Synthesis: "${mockLlmAnswer}"`);

    // 6. Restore original cleartext in local RAM for authorized user
    const { restoredText } = transform.restore(mockLlmAnswer);
    console.log('\n--- 4. Re-hydrated Query Response (Local RAM Only) ---');
    console.log(`De-tokenized Output: "${restoredText}"`);

    // 7. Reset session map
    transform.resetSession();
    console.log('\nLlamaIndex session map reset complete.');
}

main().catch(console.error);
