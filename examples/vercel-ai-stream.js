/**
 * @privacyscrubber/sdk/vercel-ai - Vercel AI SDK Streaming Sanitization Recipe
 *
 * Demonstrates:
 * 1. Universal 1-line model wrapper: withPrivacyScrubber(model, options)
 * 2. Official AI SDK middleware integration: createPrivacyMiddleware(options)
 * 3. In-flight streaming de-tokenization with split token chunk boundaries
 * 4. Web Streams API pipeline: createDetokenizerTransformStream(tokenMap)
 * 5. Zero-Trust Data Sanitization (ZTDS) invariants: 0 network egress, <1ms overhead
 *
 * Usage:
 *   node vercel-ai-stream.js
 */

import {
  withPrivacyScrubber,
  createPrivacyMiddleware,
  wrapLanguageModel,
  createDetokenizerTransformStream
} from '@privacyscrubber/sdk/vercel-ai';
import { ReadableStream } from 'node:stream/web';

async function main() {
  console.log('=== PrivacyScrubber SDK: Vercel AI SDK Streaming Recipe ===\n');

  // =========================================================================
  // Mock Vercel AI SDK LanguageModelV1
  // Simulates provider behavior (OpenAI, Anthropic, Gemini) with streaming deltas
  // =========================================================================
  let lastCapturedModelPrompt = null;

  const mockLanguageModel = {
    specificationVersion: 'v1',
    modelId: 'gpt-4o-mock',
    provider: 'openai-mock',
    defaultObjectGenerationMode: 'json',

    // Non-streaming completion simulation
    doGenerate: async (params) => {
      lastCapturedModelPrompt = params.prompt;
      return {
        text: 'Confirmation for [NAME_1]: account reset code sent to [EMAIL_1].',
        finishReason: 'stop',
        usage: { promptTokens: 18, completionTokens: 14 }
      };
    },

    // Streaming completion simulation with split token chunks across boundaries
    doStream: async (params) => {
      lastCapturedModelPrompt = params.prompt;

      async function* generateStreamChunks() {
        // Chunk 1: Normal text
        yield { type: 'text-delta', textDelta: 'Security Alert: User ' };
        // Chunk 2: Split token part 1 ("[NA")
        yield { type: 'text-delta', textDelta: '[NA' };
        // Chunk 3: Split token part 2 ("ME_1]")
        yield { type: 'text-delta', textDelta: 'ME_1] updated phone to ' };
        // Chunk 4: Split token part 1 ("[PHO")
        yield { type: 'text-delta', textDelta: '[PHO' };
        // Chunk 5: Split token part 2 ("NE_1]")
        yield { type: 'text-delta', textDelta: 'NE_1] successfully.' };
        // Chunk 6: Finish event
        yield { type: 'finish', finishReason: 'stop', usage: { promptTokens: 25, completionTokens: 20 } };
      }

      return {
        stream: generateStreamChunks(),
        rawCall: { rawPrompt: params.prompt }
      };
    }
  };

  // =========================================================================
  // Scenario A: Universal 1-Line Model Wrapper (withPrivacyScrubber)
  // =========================================================================
  console.log('--- 1. Scenario A: Universal 1-Line Drop-in (withPrivacyScrubber) ---');

  const safeModel = withPrivacyScrubber(mockLanguageModel, {
    profile: 'General',
    detectSecrets: true
  });

  const rawUserPrompt = 'Please reset password for Michael Scott (mscott@dundermifflin.com).';
  console.log(`Original Input Prompt:\n  "${rawUserPrompt}"\n`);

  // A1: Non-streaming generate
  const genResponse = await safeModel.doGenerate({
    inputFormat: 'prompt',
    mode: { type: 'regular' },
    prompt: rawUserPrompt
  });

  console.log('Sanitized Prompt Captured by Model Provider (Zero Cleartext Egress):');
  console.log(' ', JSON.stringify(lastCapturedModelPrompt));

  console.log('\nRestored Output Returned to Application:');
  console.log(`  "${genResponse.text}"\n`);

  // A2: Streaming execution with split-chunk token reassembly
  console.log('Streaming Delta Chunks (Real-Time In-Flight De-Tokenization):');
  const streamResult = await safeModel.doStream({
    inputFormat: 'prompt',
    mode: { type: 'regular' },
    prompt: 'Alert: Michael Scott changed contact number to +1-555-019-9821.'
  });

  let fullStreamedText = '';
  process.stdout.write('  ');
  for await (const chunk of streamResult.stream) {
    if (chunk.type === 'text-delta') {
      process.stdout.write(chunk.textDelta);
      fullStreamedText += chunk.textDelta;
    }
  }
  console.log('\n\nFinal Assembled Stream:');
  console.log(`  "${fullStreamedText}"\n`);

  // =========================================================================
  // Scenario B: Official Vercel AI SDK Middleware (wrapLanguageModel)
  // With CISO Audit Telemetry and Redaction Hooks
  // =========================================================================
  console.log('--- 2. Scenario B: Vercel AI SDK Middleware with Telemetry ---');

  let auditMetadata = null;
  const privacyMiddleware = createPrivacyMiddleware({
    profile: 'Dev',
    detectSecrets: true,
    onSanitized: (meta) => {
      auditMetadata = meta;
    }
  });

  const enterpriseModel = wrapLanguageModel({
    model: mockLanguageModel,
    middleware: privacyMiddleware
  });

  const devPrompt = 'Deploy cluster with AWS key AKIAIOSFODNN7EXAMPLE and notify dev-ops@internal.net';
  console.log(`Raw Developer Input:\n  "${devPrompt}"\n`);

  await enterpriseModel.doGenerate({
    inputFormat: 'prompt',
    mode: { type: 'regular' },
    prompt: devPrompt
  });

  console.log('ZTDS Telemetry Metadata Emitted to CISO Logging:');
  console.log(JSON.stringify(auditMetadata, null, 2));

  // =========================================================================
  // Scenario C: Native Web Streams TransformStream Pipeline
  // For Next.js Route Handlers & Edge Runtime
  // =========================================================================
  console.log('\n--- 3. Scenario C: Web Streams TransformStream Pipeline ---');

  const sessionTokenMap = {
    '[NAME_1]': 'Dwight Schrute',
    '[EMAIL_1]': 'dschrute@dundermifflin.com'
  };

  const detokenizerTransform = createDetokenizerTransformStream(sessionTokenMap);

  // Simulated Web ReadableStream emitting fragmented token pieces
  const rawStream = new ReadableStream({
    start(controller) {
      controller.enqueue({ type: 'text-delta', textDelta: 'Report generated for: [NA' });
      controller.enqueue({ type: 'text-delta', textDelta: 'ME_1] (contact: [EM' });
      controller.enqueue({ type: 'text-delta', textDelta: 'AIL_1]). Status: Approved.' });
      controller.close();
    }
  });

  const transformedStream = rawStream.pipeThrough(detokenizerTransform);
  const reader = transformedStream.getReader();

  let webStreamOutput = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value && value.type === 'text-delta') {
      webStreamOutput += value.textDelta;
    }
  }

  console.log('Transformed Web Stream Result:');
  console.log(`  "${webStreamOutput}"`);

  console.log('\n=== All Vercel AI SDK Streaming Scenarios Completed Successfully ===');
}

main().catch((err) => {
  console.error('Fatal error in vercel-ai-stream recipe:', err);
  process.exit(1);
});
