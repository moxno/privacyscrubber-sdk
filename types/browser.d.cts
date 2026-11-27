// TypeScript definitions for @privacyscrubber/sdk/browser
// Browser / Edge runtime zero-dependency entry point (no Node.js fs/crypto/Buffer).

import {
    DEVOPS_SECRETS_DETECTOR,
    FREE_PROD_SPECIALIZED_CALL_LIMIT,
    PSR2_STATEMENTS,
    PSR2_VERSION,
    PrivacyScrubberEngine,
    PrivacyScrubberLicenseError,
    StreamingDetokenizer,
    ZTDSEngine,
    buildAuditTelemetry,
    buildCisoAuditTelemetry,
    buildPsr2Receipt,
    buildStreamReplacer,
    clean,
    createOpenAIAgentGuardrails,
    createPrivacyFetch,
    createStreamTokenRestorer,
    desanitize,
    detectProfile,
    formatAuditReceipt,
    generateAuditReport,
    generateSvgRedactionOverlay,
    psr2Lines,
    redactImageBoundingBoxes,
    restore,
    restoreObject,
    sanitize,
    sanitizeObject,
    scrub,
    scrubText,
    stripExifMetadata,
    unscrub,
    unscrubText,
    validateLicense,
    validateLicenseKey,
    wrapAiStream,
    wrapGemini,
    wrapGoogleGenAI,
} from './index.cjs';

export type {
    AgenticProtocolMetadata,
    AuditTelemetry,
    CustomRule,
    DetectedSpan,
    EngineConfig,
    ExifStripResult,
    GenerateAuditReportOptions,
    IpHoldings,
    LicenseMetadata,
    LicenseTier,
    LicenseValidationResult,
    OpenAIAgentGuardrailsOptions,
    OpenAIAgentGuardrailsResult,
    PiiProfile,
    PrivacyFetchOptions,
    ProfileAlternative,
    ProfileDetectionResult,
    ProfileDetectionSummary,
    Psr2Receipt,
    RestoreResult,
    SanitizeObjectResult,
    SanitizeOptions,
    SanitizeResult,
    StatutoryCitation,
    StreamTokenRestorer,
    VisionBoundingBox,
    VisionRedactOptions,
    ZTDSSanitizeResult,
} from './index.cjs';

export {
    DEVOPS_SECRETS_DETECTOR,
    FREE_PROD_SPECIALIZED_CALL_LIMIT,
    PSR2_STATEMENTS,
    PSR2_VERSION,
    PrivacyScrubberEngine,
    PrivacyScrubberLicenseError,
    StreamingDetokenizer,
    ZTDSEngine,
    buildAuditTelemetry,
    buildCisoAuditTelemetry,
    buildPsr2Receipt,
    buildStreamReplacer,
    clean,
    createOpenAIAgentGuardrails,
    createPrivacyFetch,
    createStreamTokenRestorer,
    desanitize,
    detectProfile,
    formatAuditReceipt,
    generateAuditReport,
    generateSvgRedactionOverlay,
    psr2Lines,
    redactImageBoundingBoxes,
    restore,
    restoreObject,
    sanitize,
    sanitizeObject,
    scrub,
    scrubText,
    stripExifMetadata,
    unscrub,
    unscrubText,
    validateLicense,
    validateLicenseKey,
    wrapAiStream,
    wrapGemini,
    wrapGoogleGenAI,
};

declare const defaultExport: {
    DEVOPS_SECRETS_DETECTOR: typeof DEVOPS_SECRETS_DETECTOR;
    FREE_PROD_SPECIALIZED_CALL_LIMIT: typeof FREE_PROD_SPECIALIZED_CALL_LIMIT;
    PSR2_STATEMENTS: typeof PSR2_STATEMENTS;
    PSR2_VERSION: typeof PSR2_VERSION;
    PrivacyScrubberEngine: typeof PrivacyScrubberEngine;
    PrivacyScrubberLicenseError: typeof PrivacyScrubberLicenseError;
    StreamingDetokenizer: typeof StreamingDetokenizer;
    ZTDSEngine: typeof ZTDSEngine;
    buildAuditTelemetry: typeof buildAuditTelemetry;
    buildCisoAuditTelemetry: typeof buildCisoAuditTelemetry;
    buildPsr2Receipt: typeof buildPsr2Receipt;
    buildStreamReplacer: typeof buildStreamReplacer;
    clean: typeof clean;
    createOpenAIAgentGuardrails: typeof createOpenAIAgentGuardrails;
    createPrivacyFetch: typeof createPrivacyFetch;
    createStreamTokenRestorer: typeof createStreamTokenRestorer;
    desanitize: typeof desanitize;
    detectProfile: typeof detectProfile;
    formatAuditReceipt: typeof formatAuditReceipt;
    generateAuditReport: typeof generateAuditReport;
    generateSvgRedactionOverlay: typeof generateSvgRedactionOverlay;
    psr2Lines: typeof psr2Lines;
    redactImageBoundingBoxes: typeof redactImageBoundingBoxes;
    restore: typeof restore;
    restoreObject: typeof restoreObject;
    sanitize: typeof sanitize;
    sanitizeObject: typeof sanitizeObject;
    scrub: typeof scrub;
    scrubText: typeof scrubText;
    stripExifMetadata: typeof stripExifMetadata;
    unscrub: typeof unscrub;
    unscrubText: typeof unscrubText;
    validateLicense: typeof validateLicense;
    validateLicenseKey: typeof validateLicenseKey;
    wrapAiStream: typeof wrapAiStream;
    wrapGemini: typeof wrapGemini;
    wrapGoogleGenAI: typeof wrapGoogleGenAI;
};

export default defaultExport;
