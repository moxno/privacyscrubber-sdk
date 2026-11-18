/**
 * TypeScript Definitions for @privacyscrubber/sdk
 */

export interface CustomRule {
    name?: string;
    pattern?: string;
    regex?: RegExp;
    mask?: string;
    type?: string;
    label?: string;
}

export type PiiProfile = 
    | 'General'
    | 'Dev'
    | 'Medical'
    | 'Financial'
    | 'Legal'
    | 'HR'
    | 'Security'
    | 'Marketing'
    | 'BizOps'
    | 'Sales'
    | 'Support'
    | 'RealEstate'
    | 'Compliance'
    | 'CCPA'
    | 'Engineering'
    | 'Manufacturing'
    | 'Industrial'
    | 'Agents'
    | 'Academic'
    | 'Creative'
    | 'Tech'
    | 'Personal'
    | 'WealthMgmt'
    | 'Insurance'
    | 'Accounting'
    | 'Pharma'
    | 'Biotech'
    | 'Underwriting'
    | 'Crypto'
    | 'Cloud'
    | 'E-Commerce'
    | 'Education'
    | 'Telecom'
    | 'Cybersecurity'
    | 'Gaming'
    | 'Government'
    | 'Automotive'
    | 'SocialMedia'
    | 'Logistics'
    | 'Energy'
    | 'Hospitality'
    | 'Travel'
    | 'Defense'
    | string;

export interface SanitizeOptions {
    /** Target compliance profile (Default: 'General'). */
    profile?: PiiProfile;
    /** Whether to automatically detect DevOps secrets (AWS keys, JWTs, DB URIs, Stripe, OpenAI keys). */
    detectSecrets?: boolean;
    /** PrivacyScrubber PRO / TEAMS / SDK / ENTERPRISE or ZTDS-LIC-v1 license key. */
    licenseKey?: string;
    /** Alias for licenseKey (ZTDS standard API compatibility). */
    license?: string;
    /** Automatically detect industry compliance profile ('auto'). */
    autoDetectProfile?: boolean;
    /** Custom regex rules array. */
    customRules?: CustomRule[];
    /** Custom label mappings (e.g. { NAME: 'INDIVIDUAL' }). */
    tokenLabelMap?: Record<string, string>;
    /** Pre-existing token session map for stateful conversation tracking. */
    existingSessionMap?: Record<string, string>;
    /** Whether tokenMap should return the full cumulative session map when existingSessionMap is provided (Default: false). */
    returnFullSessionMap?: boolean;
    /** Set or array of strings or exact terms to preserve unmasked in cleartext. */
    ignoreList?: string[] | Set<string>;
    /** Optional entity-type allowlist filter (e.g. ['NAME'] or ['PERSON'] to mask only person names while keeping batch/order numbers, dates, and IDs readable). */
    entities?: string[];
    /** Alias for entities. */
    entityTypes?: string[];
    /** Enable higher-recall person-name detection in free text (Default: false). */
    highRecallNames?: boolean;
    /** Alias for highRecallNames ('default' | 'high'). */
    nameRecall?: 'default' | 'high';
    /** Whether to generate a CISO Markdown audit receipt (Default: true). */
    generateReceipt?: boolean;
    /** Throw PrivacyScrubberLicenseError when free tier limits are reached (Default: true). */
    throwOnLimit?: boolean;
    /** Strategy when free tier limit is exceeded: 'throw' (default) or 'truncate' (soft limit with notification). */
    onLimit?: 'throw' | 'truncate';
}

export interface DetectedSpan {
    /** 0-based character start index in original text. */
    start: number;
    /** 0-based character end index in original text. */
    end: number;
    /** Raw matched value before sanitization. */
    value: string;
    /** Detected entity type (NAME, EMAIL, PHONE, ID, FINANCIAL, etc.). */
    type: string;
    /** Deterministic masking token assigned (e.g. [NAME_1]). */
    token?: string;
    /** True if anchored by context keyword, honorific, or statutory checksum. */
    isHighConfidence?: boolean;
}

export interface LicenseMetadata {
    isPro: boolean;
    tier: 'PRO' | 'TEAMS' | 'SDK' | 'ENTERPRISE' | 'OEM' | 'EVAL' | 'FREE';
    limit: number;
    wasTruncated?: boolean;
    licenseId?: string | null;
    error?: string | null;
    upgradeUrl?: string;
    trialUrl?: string;
    trialCommand?: string;
    recommendation?: string;
}

export interface StatutoryCitation {
    statute: string;
    scope: string;
    rule: string;
}

export interface IpHoldings {
    standard: string;
    standardUrl: string;
    patent: string;
    wipoDas: string;
    trademark: string;
}

export interface AgenticProtocolMetadata {
    protocolsSupported: string[];
    agentCardUrl: string;
    ztdsStandardCardUrl: string;
    regulatorySafeHarbor: string[];
    zeroCleartextEgress: boolean;
}

export interface AuditTelemetry {
    totalCount: number;
    entities: Record<string, number>;
    types: string[];
    riskLevel: 'CLEAN (ZERO PII)' | 'LOW EXPOSURE' | 'MODERATE EXPOSURE' | 'CRITICAL (HIGH EXPOSURE)';
    frameworksList: string[];
    statutoryCitations?: StatutoryCitation[];
    ipHoldings?: IpHoldings;
    agenticProtocol?: AgenticProtocolMetadata;
}

export interface SanitizeResult {
    /** The scrubbed text with PII/secrets masked. */
    scrubbedText: string;
    /** The volatile in-memory token map needed to restore data. */
    tokenMap: Record<string, string>;
    /** Full cumulative session map when existingSessionMap was provided. */
    sessionMap?: Record<string, string>;
    /** Detailed array of detected entity spans and positions. */
    spans: DetectedSpan[];
    /** Alias for spans. */
    matches: DetectedSpan[];
    /** Total number of tokens masked. */
    count: number;
    /** Execution duration in milliseconds. */
    executionMs: number;
    /** Active license state and tier info. */
    license: LicenseMetadata;
    /** CISO compliance telemetry. */
    telemetry: AuditTelemetry;
    /** Markdown formatted compliance audit receipt. */
    auditReceipt: string;
}

export interface RestoreResult {
    /** The desanitized text with original values restored. */
    restoredText: string;
    /** Number of tokens restored. */
    restoredCount: number;
}

export interface LicenseValidationResult {
    valid: boolean;
    tier: 'PRO' | 'TEAMS' | 'SDK' | 'ENTERPRISE' | 'OEM' | 'EVAL' | null;
    rawTier?: string | null;
    format?: string | null;
    licenseId?: string | null;
    customerName?: string | null;
    maxNodes?: number | null;
    specializedProfiles?: boolean;
    allowedProfiles?: string[] | null;
    expires: number | null;
    error: string | null;
}

export class PrivacyScrubberLicenseError extends Error {
    tier: string;
    currentLength: number;
    limit: number;
    profile: string;
    upgradeUrl: string;
}

export function validateLicense(key: string): LicenseValidationResult;
export function validateLicenseKey(key: string): 'PRO' | 'TEAMS' | 'SDK' | 'ENTERPRISE' | 'OEM' | null;

export function buildAuditTelemetry(currentTokenMap?: Record<string, string> | string[]): AuditTelemetry;
export const buildCisoAuditTelemetry: typeof buildAuditTelemetry;
export function formatAuditReceipt(telemetry: AuditTelemetry): string;

export interface AuditEventData {
    timestamp?: string;
    version?: string;
    protocol?: string;
    event?: string;
    riskLevel?: string;
    tokensMasked?: number;
    entities?: Record<string, number>;
    frameworks?: string[];
    sessionHash?: string;
    source?: string;
    action?: string;
    organization?: string;
    department?: string;
    executionMs?: number;
    metadata?: Record<string, any>;
    [key: string]: any;
}

export function formatCefEvent(eventData?: AuditEventData): string;
export function formatSyslogEvent(eventData?: AuditEventData): string;
export function formatJsonlEvent(eventData?: AuditEventData): string;

export interface AuditLoggerOptions {
    format?: 'jsonl' | 'cef' | 'syslog' | 'json';
    destination?: string | any;
    organization?: string;
    department?: string;
}

export interface AuditLogger {
    formatEvent(eventData: AuditEventData): string;
    logSanitization(result: SanitizeResult | Record<string, string>, context?: any): string;
    logEvent(eventData: AuditEventData): string;
    log(eventData: AuditEventData): string;
    getEntries(): string[];
    getBuffer(): string[];
    clear(): void;
    clearBuffer(): void;
    format: string;
    destination: any;
}

export function createAuditLogger(options?: AuditLoggerOptions): AuditLogger;

export interface GenerateAuditReportOptions {
    companyName?: string;
    department?: string;
    format?: 'markdown' | 'json' | 'summary' | 'cef' | 'syslog' | 'jsonl';
}

export function generateAuditReport(
    sessionMap?: Record<string, string>,
    options?: GenerateAuditReportOptions
): any;

export interface ProcurementMemoOptions {
    /** Target application or pipeline name (Default: 'Internal AI Applications & LLM Pipelines'). */
    appName?: string;
    /** Team or developer name (Default: 'Engineering / AI Platform Team'). */
    developer?: string;
    /** Output format: 'markdown' or 'text' (Default: 'markdown'). */
    format?: 'markdown' | 'text';
    /** Number of engineers on the team (Default: 10). */
    teamSize?: number;
    /** Estimated monthly prompt volume (Default: '50M - 500M characters/month'). */
    estimatedVolume?: string;
}

/**
 * Generates an executive CISO & Legal Procurement Memo for enterprise approval of @privacyscrubber/sdk.
 */
export function generateProcurementMemo(options?: ProcurementMemoOptions): string;

export const SDK_VERSION: string;
export const PSR2_VERSION: 'PSR-2';
export const PSR2_STATEMENTS: {
    measured: string[];
    byDesign: string[];
    limits: string[];
};
export const DEVOPS_SECRETS_DETECTOR: Array<{
    name: string;
    regex: RegExp;
    label: string;
}>;

export interface Psr2Receipt {
    version: string;
    timestamp: string;
    outputSha256: string | null;
    manifestSha256: string;
    entityCounts: string;
    tokensTotal: number;
    tokensPresentInOutput: number | null;
    canonical: string;
    receiptSha256: string;
}

export function buildPsr2Receipt(tokenMap?: Record<string, string>, timestamp?: string): Psr2Receipt;
export function psr2Lines(receipt: Psr2Receipt): string[];
export function _resetCommunityNoticeForTesting(): void;
export function _resetDevSecretNoticeForTesting(): void;

/**
 * Sanitizes input text, masking all PII and secrets with zero network requests.
 */
export function sanitize(text: string, options?: SanitizeOptions): SanitizeResult;
export function scrub(text: string, options?: SanitizeOptions): SanitizeResult;

export interface SanitizeObjectResult<T = any> {
    sanitized: T;
    tokenMap: Record<string, string>;
    count: number;
    executionMs: number;
    telemetry: AuditTelemetry;
    auditReceipt: string;
}

/**
 * Recursively sanitizes all string values within an object, array, Map, or Set.
 */
export function sanitizeObject<T = any>(obj: T, options?: SanitizeOptions): SanitizeObjectResult<T>;

/**
 * Restores masked tokens in AI outputs back to original plaintext in-memory.
 */
export function restore(aiResponse: string, tokenMap: Record<string, string>): RestoreResult;
export function unscrub(aiResponse: string, tokenMap: Record<string, string>): RestoreResult;
export function desanitize(aiResponse: string, tokenMap: Record<string, string>): RestoreResult;

/**
 * Recursively restores all masked tokens within a sanitized object, array, Map, or Set.
 */
export function restoreObject<T = any>(obj: T, tokenMap?: Record<string, string>): T;

export interface EngineConfig {
    licenseKey?: string;
    /** Alias for licenseKey (ZTDS standard API compatibility). */
    license?: string;
    apiKey?: string;
    defaultProfile?: PiiProfile;
    profile?: PiiProfile;
    /** Optional list of target compliance profiles (uses primary profile for runtime enforcement). */
    profiles?: PiiProfile[];
    /** Whether to automatically detect DevOps secrets (AWS keys, JWTs, DB URIs, Stripe, OpenAI keys). */
    detectSecrets?: boolean;
    customRules?: CustomRule[];
    tokenLabelMap?: Record<string, string>;
    generateReceipt?: boolean;
    initialSessionMap?: Record<string, string>;
    ignoreList?: string[] | Set<string>;
    maxSessionTokens?: number;
}

export interface ZTDSSanitizeResult extends SanitizeResult {
    text: string;
    sanitized: string;
    sanitizedText: string;
    sanitizedPrompt: string;
    tokens: Record<string, string>;
    entitiesDetected: number;
    latencyMs: number;
    latency_ms: number;
    executionUs: number;
    zeroEgressAttested: boolean;
    receipt: string;
}

export class PrivacyScrubberEngine {
    sessionMap: Record<string, string>;
    ignoreList: Set<string>;
    license: LicenseValidationResult;
    constructor(config?: EngineConfig);
    setLicenseKey(key: string): LicenseValidationResult;
    sanitize(text: string, options?: SanitizeOptions & { persistSession?: boolean; maxSessionTokens?: number }): SanitizeResult;
    restore(aiResponse: string, tokenMap?: Record<string, string> | null): RestoreResult;
    resetSession(): void;
    markFalsePositive(token: string): { success: boolean; token?: string; original?: string; ignoreListSize?: number; reason?: string };
    clearIgnoreList(): void;
    createStreamRestorer(tokenMap?: Record<string, string> | null, options?: any): StreamTokenRestorer;
    wrapStream<T = any>(stream: AsyncIterable<T>, tokenMap?: Record<string, string> | null, options?: any): AsyncGenerator<any, void, unknown>;
}

/**
 * Drop-in ZTDS Open Standard compatible engine wrapping PrivacyScrubberEngine.
 */
export class ZTDSEngine extends PrivacyScrubberEngine {
    profiles: PiiProfile[];
    constructor(config?: EngineConfig);
    sanitize(text: string, options?: (SanitizeOptions & { persistSession?: boolean; maxSessionTokens?: number }) | PiiProfile): ZTDSSanitizeResult;
    mask(cleartext: string, options?: (SanitizeOptions & { persistSession?: boolean; maxSessionTokens?: number }) | PiiProfile): ZTDSSanitizeResult;
    reveal(maskedText: string, tokenMap?: Record<string, string> | null): string;
    rehydrate(maskedText: string, tokenMap?: Record<string, string> | null): string;
    flush(): void;
}

/**
 * Transparent zero-trust wrapper for OpenAI SDK client (chat.completions.create & responses.create).
 */
export function wrapOpenAI<T = any>(openaiClient: T, options?: SanitizeOptions): T;

/**
 * Transparent zero-trust wrapper for Anthropic SDK client (messages.create).
 */
export function wrapAnthropic<T = any>(anthropicClient: T, options?: SanitizeOptions): T;

/**
 * Transparent zero-trust wrapper for Google Gemini SDKs (@google/genai and @google/generative-ai).
 * Sanitizes string/Part[]/Content[] prompts and systemInstruction in RAM and restores tokens in sync and streaming responses.
 */
export function wrapGemini<T = any>(geminiClientOrModel: T, options?: SanitizeOptions & { engine?: PrivacyScrubberEngine }): T;
export const wrapGoogleGenAI: typeof wrapGemini;

/**
 * Universal drop-in HTTP/SSE fetch wrapper for any OpenAI-compatible or custom LLM SDK
 * (OpenAI, Anthropic, OpenRouter, Groq, DeepSeek, Mistral, Together, Ollama, Cloudflare AI Gateway).
 */
export interface PrivacyFetchOptions extends SanitizeOptions {
    fetch?: typeof fetch;
    engine?: PrivacyScrubberEngine;
    sanitizeInputs?: boolean;
    sanitizeOutputs?: boolean;
    streamingOptions?: any;
    onSanitized?: (telemetry: { url: string; tokenMap: Record<string, string>; tokenCount: number }) => void;
}
export function createPrivacyFetch(options?: PrivacyFetchOptions): typeof fetch & { engine: PrivacyScrubberEngine };

/**
 * OpenAI Agents SDK (@openai/agents) compatible InputGuardrail and OutputGuardrail factory.
 */
export interface OpenAIAgentGuardrailsOptions extends SanitizeOptions {
    engine?: PrivacyScrubberEngine;
    inputGuardrailName?: string;
    outputGuardrailName?: string;
    tripwireOnCritical?: boolean;
    tripwireOnAnyPii?: boolean;
    tripwireOnOutputLeak?: boolean;
    mutateInPlace?: boolean;
}
export interface OpenAIAgentGuardrailsResult {
    inputGuardrail: {
        name: string;
        execute: (args: { input: any; context?: any; agent?: any }) => Promise<{
            tripwireTriggered: boolean;
            outputInfo: {
                scrubbedInput: any;
                tokenMap: Record<string, string>;
                tokenCount: number;
                riskLevel: string;
                frameworks?: string[];
                telemetry: AuditTelemetry;
            };
        }>;
    };
    outputGuardrail: {
        name: string;
        execute: (args: { agentOutput: any; context?: any; agent?: any }) => Promise<{
            tripwireTriggered: boolean;
            outputInfo: {
                restoredOutput: any;
                restoredCount: number;
            };
        }>;
    };
    inputGuardrails: Array<OpenAIAgentGuardrailsResult['inputGuardrail']>;
    outputGuardrails: Array<OpenAIAgentGuardrailsResult['outputGuardrail']>;
    engine: PrivacyScrubberEngine;
}
export function createOpenAIAgentGuardrails(options?: OpenAIAgentGuardrailsOptions): OpenAIAgentGuardrailsResult;

/**
 * Transparent zero-trust wrapper for Vercel AI SDK language models.
 * Sanitizes prompts in local RAM and detokenizes streaming and final outputs.
 */
export function wrapAiModel<T = any>(model: T, options?: SanitizeOptions): T;
export const wrapAiSdk: typeof wrapAiModel;

/**
 * Middleware transform for LangChain and LlamaIndex pipelines.
 */
export function createLangChainTransform(options?: SanitizeOptions): {
    preprocess: (input: string) => SanitizeResult;
    postprocess: (output: string, tokenMap: Record<string, string>) => RestoreResult;
};

export interface LangChainDocument {
    pageContent: string;
    metadata?: Record<string, any>;
    [key: string]: any;
}

export interface DocumentTransformerOptions extends SanitizeOptions {
    sensitiveMetadataKeys?: string[];
    attachTelemetry?: boolean;
    attachTokenMap?: boolean;
}

export interface DocumentTransformer {
    transformDocuments(documents: LangChainDocument[]): Promise<LangChainDocument[]>;
    invoke(documents: LangChainDocument[]): Promise<LangChainDocument[]>;
    sessionMap: Record<string, string>;
    restore(output: string, tokenMap?: Record<string, string>): RestoreResult;
    resetSession(): void;
}

export function createDocumentTransformer(options?: DocumentTransformerOptions): DocumentTransformer;
export const createLangChainDocumentTransformer: typeof createDocumentTransformer;

export interface LlamaIndexNode {
    text?: string;
    pageContent?: string;
    getContent?: () => string;
    setContent?: (text: string) => void;
    metadata?: Record<string, any>;
    [key: string]: any;
}

export interface LlamaIndexTransform {
    transform<T extends LlamaIndexNode | LlamaIndexNode[]>(nodes: T): T;
    sessionMap: Record<string, string>;
    restore(text: string, map?: Record<string, string>): RestoreResult;
    resetSession(): void;
}

export function createLlamaIndexTransform(options?: SanitizeOptions): LlamaIndexTransform;

export interface VectorIngestionGuardOptions extends SanitizeOptions {
    sensitiveMetadataKeys?: string[];
    autoRestoreResults?: boolean;
}

export interface VectorIngestionGuard {
    sanitizeRecords<T = any>(records: T): T;
    sanitizeQuery(query: string): {
        query: string;
        rawQuery: string;
        tokensDetected: number;
        tokenMap: Record<string, string>;
    };
    restoreSearchResults<T = any>(results: T, customTokenMap?: Record<string, string> | null): T;
    wrapVectorStore<T = any>(vectorStore: T): T;
    sessionMap: Record<string, string>;
    restore(text: string, map?: Record<string, string>): RestoreResult;
    resetSession(): void;
}

export function createVectorIngestionGuard(options?: VectorIngestionGuardOptions): VectorIngestionGuard;

export interface ApplyPatchOptions {
    tokenMap?: Record<string, string>;
    engine?: PrivacyScrubberEngine;
    createBackup?: boolean;
}

export interface ApplyPatchResult {
    success: boolean;
    filePath: string;
    restoredCount: number;
    backupCreated: boolean;
    backupPath?: string;
}

export interface GuardExecParams {
    command: string;
    cwd?: string;
    profile?: PiiProfile;
    timeoutMs?: number;
}

export interface GuardExecResult {
    command: string;
    stdout: string;
    stderr: string;
    exitCode: number;
    tokenCount: number;
    telemetry: AuditTelemetry;
    receipt: string;
    responseText: string;
}

export interface GuardReadFileParams {
    filePath: string;
    maxLines?: number;
    profile?: PiiProfile;
}

export interface GuardReadFileResult {
    filePath: string;
    content: string;
    totalLines: number;
    wasTruncated: boolean;
    tokenCount: number;
    telemetry: AuditTelemetry;
    receipt: string;
    responseText: string;
}

export interface GuardGitDiffParams {
    staged?: boolean;
    cwd?: string;
    profile?: PiiProfile;
}

export interface GuardGitDiffResult {
    diff: string;
    isStaged: boolean;
    tokenCount: number;
    telemetry?: AuditTelemetry;
    receipt?: string;
    responseText: string;
}

export interface GuardedTools {
    guardExec: {
        name: 'guard_exec';
        description: string;
        parameters: object;
        execute: (params: GuardExecParams) => Promise<GuardExecResult>;
    };
    guardReadFile: {
        name: 'guard_read_file';
        description: string;
        parameters: object;
        execute: (params: GuardReadFileParams) => Promise<GuardReadFileResult>;
    };
    guardApplyPatch: {
        name: 'guard_apply_patch';
        description: string;
        parameters: object;
        execute: (params: { filePath: string; content: string; createBackup?: boolean }) => Promise<ApplyPatchResult & { responseText: string }>;
    };
    guardGitDiff: {
        name: 'guard_git_diff';
        description: string;
        parameters: object;
        execute: (params?: GuardGitDiffParams) => Promise<GuardGitDiffResult>;
    };
    getDefinitions: () => Array<{ type: 'function'; function: { name: string; description: string; parameters: object } }>;
    engine: PrivacyScrubberEngine;
}

/**
 * Creates a Node.js Transform stream for zero-trust PII sanitization.
 */
export function createSanitizeStream(options?: SanitizeOptions & { engine?: PrivacyScrubberEngine }): any;

/**
 * Restores masked tokens in AI-generated code or text and writes directly to disk.
 */
export function applyPatch(filePath: string, content: string, options?: ApplyPatchOptions): ApplyPatchResult;
export function restoreToFile(filePath: string, content: string, tokenMapOrOptions?: Record<string, string> | ApplyPatchOptions, options?: ApplyPatchOptions): ApplyPatchResult;

/**
 * Creates CISO-grade Zero-Trust Agentic Guard tools for AI agents.
 */
export function createGuardedTools(engineOrOptions?: PrivacyScrubberEngine | SanitizeOptions, toolConfig?: { cwd?: string; profile?: PiiProfile }): GuardedTools;

/**
 * Stream token restorer interface for zero-latency SSE chunk processing.
 */
export interface StreamTokenRestorer {
    /** Pushes an incoming streaming chunk and returns immediately rehydrated text. */
    push(chunk: string | Uint8Array | any): string;
    /** Feeds an incoming chunk and returns de-tokenized text. */
    feed(chunk: string | Uint8Array | any): string;
    /** Alias for feed. */
    process(chunk: string | Uint8Array | any): string;
    /** Flushes any buffered incomplete tokens at the end of the stream. */
    flush(): string;
    /** Wraps an async iterable LLM stream yielding de-tokenized chunks in real-time. */
    wrapStream<T = any>(asyncIterable: AsyncIterable<T>): AsyncGenerator<any, void, unknown>;
    /** Converts to a native Node.js Transform stream for .pipe() or stream.pipeline(). */
    toNodeTransform(): any;
    /** Underlying StreamingDetokenizer instance. */
    detokenizer: StreamingDetokenizer;
}

/**
 * High-performance streaming de-tokenization engine with sliding-window chunk boundary buffering.
 */
export class StreamingDetokenizer {
    constructor(tokenMap?: Record<string, string>, options?: any);
    feed(chunk: string | Uint8Array | any): string;
    process(chunk: string | Uint8Array | any): string;
    flush(): string;
    toNodeTransform(): any;
    wrapStream<T = any>(asyncIterable: AsyncIterable<T>): AsyncGenerator<any, void, unknown>;
}

/**
 * Builds an ultra-fast streaming token replacement function preserving all whitespace.
 */
export function buildStreamReplacer(tokenMap?: Record<string, string>): (text: string) => string;

/**
 * Ergonomic 1-liner: string-in, sanitized string-out without metadata ceremonies.
 * @param text - Plaintext prompt containing potential PII/secrets.
 * @param profile - Compliance profile (Default: 'General').
 * @returns Scrubbed string ready to send to LLM.
 */
export function clean(text: string, profile?: PiiProfile): string;

/**
 * Creates a stream token restorer that rehydrates masked tokens across chunk boundaries in real-time.
 * @param tokenMap - Map of token bindings returned from sanitize().
 * @param options - Optional configuration.
 */
export function createStreamTokenRestorer(tokenMap?: Record<string, string>, options?: any): StreamTokenRestorer;

/**
 * Creates a Node.js native Transform stream for backend streaming pipelines (stream.pipeline / .pipe()).
 * @param tokenMap - Map of token bindings returned from sanitize().
 * @param options - Optional configuration.
 */
export function createNodeStreamTokenRestorer(tokenMap?: Record<string, string>, options?: any): any;

/**
 * Wraps an AI streaming response (e.g. OpenAI stream, Vercel AI SDK textStream)
 * and yields real-time plain chunks with all tokens restored on the fly.
 * @param stream - AsyncIterable or ReadableStream of string chunks or delta objects.
 * @param tokenMap - Map of token bindings returned from sanitize().
 */
export function wrapAiStream<T = any>(
    stream: AsyncIterable<T> | any,
    tokenMap?: Record<string, string>
): AsyncGenerator<any, void, unknown>;

/**
 * Zero-Trust wrapper for Next.js App Router Route Handlers (route.js / route.ts).
 * Automatically intercepts incoming Request JSON body, sanitizes PII in RAM,
 * and passes scrubbed body along with tokenMap and stream restorer factory.
 */
export function withPrivacyScrubber(
    handler: (req: Request, context?: any, psContext?: { tokenMap: Record<string, string>; telemetry: AuditTelemetry; createStreamRestorer: () => StreamTokenRestorer }) => any,
    options?: SanitizeOptions
): (req: Request, context?: any) => Promise<any>;

/**
 * Express.js / Connect middleware for automatic zero-trust PII sanitization.
 * Sanitizes req.body in local RAM and attaches req.psTokenMap, req.restore(), and req.createStreamRestorer().
 */
export function createExpressMiddleware(
    options?: SanitizeOptions
): (req: any, res: any, next: (err?: any) => void) => void;

// Legacy exports
export function scrubText(
    text: string,
    customRules?: any[],
    tokenLabelMap?: Record<string, string>,
    profile?: string,
    existingSessionMap?: Record<string, string>,
    isPro?: boolean
): {
    scrubbedText: string;
    tokenMap: Record<string, string>;
    count: number;
    executionMs: number;
};

export function unscrubText(
    aiResponse: string,
    tokenMap: Record<string, string>
): {
    restoredText: string;
    restoredCount: number;
};

declare const defaultExport: {
    SDK_VERSION: typeof SDK_VERSION;
    clean: typeof clean;
    sanitize: typeof sanitize;
    sanitizeObject: typeof sanitizeObject;
    scrub: typeof scrub;
    restore: typeof restore;
    restoreObject: typeof restoreObject;
    unscrub: typeof unscrub;
    desanitize: typeof desanitize;
    StreamingDetokenizer: typeof StreamingDetokenizer;
    createStreamTokenRestorer: typeof createStreamTokenRestorer;
    createNodeStreamTokenRestorer: typeof createNodeStreamTokenRestorer;
    buildStreamReplacer: typeof buildStreamReplacer;
    wrapAiStream: typeof wrapAiStream;
    withPrivacyScrubber: typeof withPrivacyScrubber;
    createExpressMiddleware: typeof createExpressMiddleware;
    validateLicense: typeof validateLicense;
    validateLicenseKey: typeof validateLicenseKey;
    buildAuditTelemetry: typeof buildAuditTelemetry;
    buildCisoAuditTelemetry: typeof buildCisoAuditTelemetry;
    formatAuditReceipt: typeof formatAuditReceipt;
    generateAuditReport: typeof generateAuditReport;
    PSR2_VERSION: typeof PSR2_VERSION;
    PSR2_STATEMENTS: typeof PSR2_STATEMENTS;
    buildPsr2Receipt: typeof buildPsr2Receipt;
    psr2Lines: typeof psr2Lines;
    formatCefEvent: typeof formatCefEvent;
    formatSyslogEvent: typeof formatSyslogEvent;
    formatJsonlEvent: typeof formatJsonlEvent;
    createAuditLogger: typeof createAuditLogger;
    generateProcurementMemo: typeof generateProcurementMemo;
    PrivacyScrubberEngine: typeof PrivacyScrubberEngine;
    ZTDSEngine: typeof ZTDSEngine;
    PrivacyScrubberLicenseError: typeof PrivacyScrubberLicenseError;
    wrapOpenAI: typeof wrapOpenAI;
    wrapAnthropic: typeof wrapAnthropic;
    wrapGemini: typeof wrapGemini;
    wrapGoogleGenAI: typeof wrapGoogleGenAI;
    wrapAiModel: typeof wrapAiModel;
    wrapAiSdk: typeof wrapAiSdk;
    createPrivacyFetch: typeof createPrivacyFetch;
    createOpenAIAgentGuardrails: typeof createOpenAIAgentGuardrails;
    createLangChainTransform: typeof createLangChainTransform;
    createDocumentTransformer: typeof createDocumentTransformer;
    createLangChainDocumentTransformer: typeof createLangChainDocumentTransformer;
    createLlamaIndexTransform: typeof createLlamaIndexTransform;
    createVectorIngestionGuard: typeof createVectorIngestionGuard;
    createSanitizeStream: typeof createSanitizeStream;
    applyPatch: typeof applyPatch;
    restoreToFile: typeof restoreToFile;
    createGuardedTools: typeof createGuardedTools;
    scrubText: typeof scrubText;
    unscrubText: typeof unscrubText;
    DEVOPS_SECRETS_DETECTOR: typeof DEVOPS_SECRETS_DETECTOR;
    stripExifMetadata: typeof stripExifMetadata;
    redactImageBoundingBoxes: typeof redactImageBoundingBoxes;
    generateSvgRedactionOverlay: typeof generateSvgRedactionOverlay;
};

export interface ExifStripResult {
    cleanBuffer: Uint8Array | Buffer;
    metadataStripped: boolean;
    format: string;
    removedSegments: string[];
    bytesSaved: number;
}

export interface VisionBoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
}

export interface VisionRedactOptions {
    fillColor?: string;
    borderColor?: string;
    showLabels?: boolean;
}

export function stripExifMetadata(inputBuffer: Buffer | Uint8Array): ExifStripResult;
export function redactImageBoundingBoxes(
    canvasOrCtx: any,
    boxes?: VisionBoundingBox[],
    options?: VisionRedactOptions
): number;
export function generateSvgRedactionOverlay(
    dimensions?: { width: number; height: number },
    boxes?: VisionBoundingBox[],
    options?: VisionRedactOptions
): string;

export default defaultExport;

