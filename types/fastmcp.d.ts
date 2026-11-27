/**
 * @privacyscrubber/fastmcp-guard
 * TypeScript Definitions
 */

export interface ZTDSMetadata {
  sessionId: string;
  standard: string;
  zeroEgress: boolean;
}

export interface ZTDSGuardOptions {
  enabledEntities?: string[];
  sanitizeInputs?: boolean;
  sanitizeOutputs?: boolean;
  useCryptoTokens?: boolean;
  autoZeroize?: boolean;
  maxSessionTokens?: number;
  engineMode?: 'auto' | 'full' | 'lightweight';
  profile?: string;
  licenseKey?: string;
  license?: string;
}

export interface ZTDSContext {
  sessionId: string;
  unmask: (val: unknown) => unknown;
  [key: string]: unknown;
}

export declare const ZTDS_PATTERNS: Record<string, RegExp>;
export declare const TOKEN_PATTERN: RegExp;

export declare class StreamingDetokenizer {
  constructor(tokenMap?: Record<string, string>, options?: object);
  buffer: string;
  feed(chunk: string | Uint8Array): string;
  process(chunk: string | Uint8Array): string;
  flush(): string;
  reset(): void;
  updateTokenMap(newMap: Record<string, string>): void;
  wrapStream<T = any>(asyncIterable: AsyncIterable<T>): AsyncGenerator<T>;
}

export declare function createStreamTokenRestorer(tokenMap: Record<string, string>, options?: object): StreamingDetokenizer;

export declare class ZTDSFastMCPGuard {
  constructor(options?: ZTDSGuardOptions);
  enabledEntities: string[];
  sanitizeInputs: boolean;
  sanitizeOutputs: boolean;
  useCryptoTokens: boolean;
  autoZeroize: boolean;
  maxSessionTokens: number;
  engineMode: 'auto' | 'full' | 'lightweight';
  profile: string;

  sanitizeText(text: string, sessionId: string): { sanitized: string; tokenMap: Record<string, string> };
  restoreText(text: string, sessionId: string): string;
  sanitizeObject(val: unknown, sessionId: string): unknown;
  restoreObject(val: unknown, sessionId: string): unknown;

  getStreamDetokenizer(sessionId: string): StreamingDetokenizer;
  feedStream(chunk: string, sessionId: string): string;
  flushStream(sessionId: string): string;
  restoreStream<T = any>(asyncIterable: AsyncIterable<T>, sessionId: string): AsyncGenerator<T>;

  wrapTool<TArgs = unknown, TResult = unknown>(
    toolName: string,
    handler: (args: TArgs, context: ZTDSContext) => Promise<TResult>
  ): (args: TArgs, context?: Partial<ZTDSContext>) => Promise<TResult & { _ztds: ZTDSMetadata }>;

  zeroizeSession(sessionId: string): void;
  inspectToolMetadata(toolDef: Record<string, unknown>): { safe: boolean; threats: string[] };
  inspectToolArgsForSsrf(args: unknown): { safe: boolean; threats: string[] };
}

export declare function inspectToolMetadata(toolDef: Record<string, unknown>): { safe: boolean; threats: string[] };
export declare function inspectToolArgsForSsrf(args: unknown): { safe: boolean; threats: string[] };

export declare function createZTDSGuard(options?: ZTDSGuardOptions): ZTDSFastMCPGuard;

export declare function ztdsGuardTool<TArgs = unknown, TResult = unknown>(
  handler: (args: TArgs, context: ZTDSContext) => Promise<TResult>,
  options?: ZTDSGuardOptions
): (args: TArgs, context?: Partial<ZTDSContext>) => Promise<TResult & { _ztds: ZTDSMetadata }>;

export declare function wrapExecute<TArgs = unknown, TResult = unknown>(
  handler: (args: TArgs, context: ZTDSContext) => Promise<TResult>,
  options?: ZTDSGuardOptions
): (args: TArgs, context?: Partial<ZTDSContext>) => Promise<TResult & { _ztds: ZTDSMetadata }>;

export declare function withZTDS<TServer extends object = object>(
  server: TServer,
  options?: ZTDSGuardOptions
): TServer;

declare const _default: {
  ZTDSFastMCPGuard: typeof ZTDSFastMCPGuard;
  ZTDS_PATTERNS: typeof ZTDS_PATTERNS;
  TOKEN_PATTERN: typeof TOKEN_PATTERN;
  StreamingDetokenizer: typeof StreamingDetokenizer;
  createStreamTokenRestorer: typeof createStreamTokenRestorer;
  createZTDSGuard: typeof createZTDSGuard;
  ztdsGuardTool: typeof ztdsGuardTool;
  wrapExecute: typeof wrapExecute;
  withZTDS: typeof withZTDS;
  inspectToolMetadata: typeof inspectToolMetadata;
  inspectToolArgsForSsrf: typeof inspectToolArgsForSsrf;
};
export default _default;
