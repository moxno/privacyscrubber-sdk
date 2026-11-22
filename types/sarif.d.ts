/**
 * TypeScript Definitions for @privacyscrubber/sdk/sarif
 */

import type { SanitizeResult } from './index.js';

export type SarifLevel = 'error' | 'warning' | 'note';

export interface SarifPosition {
    line: number;
    column: number;
}

export interface SarifInputFinding {
    pii_type?: string;
    type?: string;
    file_uri?: string;
    file?: string;
    position?: SarifPosition;
    end_position?: SarifPosition | null;
    line?: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
    match_length?: number;
    length?: number;
    value?: string;
    context_snippet?: string;
    detector?: string;
}

export interface SarifReportingDescriptor {
    id: string;
    name: string;
    shortDescription: { text: string };
    fullDescription: { text: string };
    helpUri: string;
    properties: {
        tags: string[];
        precision: string;
        'problem.severity': SarifLevel;
        'security-severity': string;
    };
}

export interface SarifResult {
    ruleId: string;
    level: SarifLevel;
    message: { text: string };
    locations: Array<{
        physicalLocation: {
            artifactLocation: {
                uri: string;
                uriBaseId: string;
            };
            region: {
                startLine: number;
                startColumn: number;
                endLine: number;
                endColumn: number;
                snippet: { text: string };
            };
        };
    }>;
    fingerprints: {
        primaryFingerprint: string;
        sha256: string;
    };
    properties: {
        piiType: string;
        matchLength: number;
        detector: string;
        zeroEgress: boolean;
    };
}

export interface EmitSarifOptions {
    toolName?: string;
    toolVersion?: string;
    sarifVersion?: string;
    repositoryUri?: string;
    commitSha?: string;
    weeklyDigest?: Record<string, any>;
    pretty?: boolean;
}

export const PII_LEVEL_MAP: Record<string, SarifLevel>;
export const PII_PLACEHOLDER: Record<string, string>;

export function emitSarif(findings: SarifInputFinding[], options?: EmitSarifOptions): string;
export function generateRules(): SarifReportingDescriptor[];
export function findingToSarifResult(finding: SarifInputFinding): SarifResult;
export function offsetToLineColumn(text: string, offset: number): SarifPosition;
export function sanitizeResultToFindings(
    sanitizeResult: Pick<SanitizeResult, 'matches' | 'spans'> | Record<string, any>,
    sourceText?: string,
    fileUri?: string
): SarifInputFinding[];
export function tokenMapToFindings(
    tokenMap?: Record<string, string>,
    fileUri?: string
): SarifInputFinding[];
export function weeklyDigestToFindings(
    dailyStats?: Record<string, any>,
    activityLog?: Array<Record<string, any>>,
    fileUri?: string
): SarifInputFinding[];

export function normalizePiiType(type: string): string;

declare const defaultExport: {
    emitSarif: typeof emitSarif;
    generateRules: typeof generateRules;
    findingToSarifResult: typeof findingToSarifResult;
    offsetToLineColumn: typeof offsetToLineColumn;
    sanitizeResultToFindings: typeof sanitizeResultToFindings;
    tokenMapToFindings: typeof tokenMapToFindings;
    weeklyDigestToFindings: typeof weeklyDigestToFindings;
    normalizePiiType: typeof normalizePiiType;
    PII_LEVEL_MAP: typeof PII_LEVEL_MAP;
    PII_PLACEHOLDER: typeof PII_PLACEHOLDER;
};

export default defaultExport;
