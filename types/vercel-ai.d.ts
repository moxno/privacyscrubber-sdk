/**
 * @privacyscrubber/sdk/vercel-ai
 * TypeScript Definitions for Vercel AI SDK Zero-Trust Middleware
 */

export interface PrivacyMiddlewareOptions {
  /**
   * Detection profile to apply.
   * Universal profiles: 'General' (universal consumer PII).
   * 30 Specialized Industry Profiles: 'Medical' (HIPAA), 'Finance' (GLBA/PCI-DSS), 'Dev' (API Keys/Secrets), 'Legal', etc.
   * Default: 'General'
   */
  profile?: string;

  /**
   * Whether to scan for DevOps secrets (OpenAI, AWS, GitHub tokens, private keys).
   * Default: true
   */
  detectSecrets?: boolean;

  /**
   * Commercial Developer SDK or Enterprise license key.
   */
  licenseKey?: string;

  /**
   * Whether to sanitize inbound prompt messages before LLM model invocation.
   * Default: true
   */
  sanitizeInputs?: boolean;

  /**
   * Whether to de-tokenize outbound generated text and real-time streaming deltas.
   * Default: true
   */
  sanitizeOutputs?: boolean;

  /**
   * Optional telemetry callback invoked upon inbound prompt sanitization.
   */
  onSanitized?: (telemetry: {
    type: 'generate' | 'stream';
    prompt: any;
    tokenMap: Record<string, string>;
    tokenCount: number;
  }) => void;

  /**
   * Optional sliding window buffer options for StreamingDetokenizer.
   */
  streamingOptions?: {
    tailWindow?: number;
    maxSessionTokens?: number;
  };

  /**
   * Custom user-defined regex rules to run in addition to the selected profile.
   */
  customRules?: Array<{ name: string; pattern: RegExp; tokenType: string }>;

  /**
   * Vercel AI SDK Middleware specification version ('v1' | 'v2' | 'v3').
   * Default: 'v1'
   */
  specificationVersion?: 'v1' | 'v2' | 'v3' | string;
}

export interface PrivacyMiddleware {
  specificationVersion?: string;
  transformParams: (options: {
    type: 'generate' | 'stream';
    params: any;
  }) => Promise<any>;

  wrapGenerate: (options: {
    doGenerate: () => Promise<any>;
    params: any;
    model: any;
  }) => Promise<any>;

  wrapStream: (options: {
    doStream: () => Promise<any>;
    params: any;
    model: any;
  }) => Promise<any>;
}

export interface SanitizePromptResult {
  sanitizedPrompt: any;
  tokenMap: Record<string, string>;
  tokenCount: number;
  telemetry: any;
}

/**
 * Creates a Vercel AI SDK LanguageModelV1Middleware instance.
 */
export declare function createPrivacyMiddleware(options?: PrivacyMiddlewareOptions): PrivacyMiddleware;

/**
 * Universal wrapper for Vercel AI SDK models or middleware creator.
 *
 * When passed a model:
 *   const safeModel = withPrivacyScrubber(openai('gpt-4o'), { profile: 'General' });
 * Returns the shielded model directly.
 *
 * When passed options:
 *   const middleware = withPrivacyScrubber({ profile: 'General' });
 * Returns the middleware for wrapLanguageModel.
 */
export declare function withPrivacyScrubber<TModel = any>(model: TModel, options?: PrivacyMiddlewareOptions): TModel;
export declare function withPrivacyScrubber(options?: PrivacyMiddlewareOptions): PrivacyMiddleware;

/**
 * Wraps a Vercel AI SDK LanguageModel with the specified middleware.
 */
export declare function wrapLanguageModel<TModel = any>(params: { model: TModel; middleware: any }): TModel;

/**
 * Creates a standard Web API TransformStream for piping text or deltas through the StreamingDetokenizer.
 */
export declare function createDetokenizerTransformStream(
  tokenMap?: Record<string, string>,
  options?: any
): TransformStream;

/**
 * Wraps an async iterable stream (e.g. result.textStream from streamText) and transparently
 * de-tokenizes split tokens on the fly.
 */
export declare function detokenizeStream<T = any>(
  stream: AsyncIterable<T>,
  tokenMap?: Record<string, string>,
  options?: any
): AsyncGenerator<T>;

/**
 * Replaces tokens in text with authentic values in local RAM.
 */
export declare function detokenizeText(text: string, tokenMap?: Record<string, string>): string;

/**
 * Direct prompt sanitization helper for Vercel AI SDK prompts.
 */
export declare function sanitizePrompt(prompt: any, options?: PrivacyMiddlewareOptions): SanitizePromptResult;

/**
 * Streaming Token Detokenizer with sliding window buffer for LLM chunk boundary splits.
 */
export { StreamingDetokenizer } from './index';

declare const _default: {
  createPrivacyMiddleware: typeof createPrivacyMiddleware;
  withPrivacyScrubber: typeof withPrivacyScrubber;
  wrapLanguageModel: typeof wrapLanguageModel;
  createDetokenizerTransformStream: typeof createDetokenizerTransformStream;
  detokenizeStream: typeof detokenizeStream;
  detokenizeText: typeof detokenizeText;
  sanitizePrompt: typeof sanitizePrompt;
  StreamingDetokenizer: any;
};

export default _default;
