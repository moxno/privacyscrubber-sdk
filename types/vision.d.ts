/**
 * TypeScript Definitions for @privacyscrubber/sdk/vision
 */

export interface ExifStripResult {
    /** The sanitized binary buffer without EXIF/XMP/IPTC/GPS metadata. */
    cleanBuffer: Uint8Array | Buffer;
    /** Whether any metadata segment was found and stripped. */
    metadataStripped: boolean;
    /** Image format detected: 'jpeg' | 'png' | 'webp' | 'unknown'. */
    format: string;
    /** Array of removed segment identifiers. */
    removedSegments: string[];
    /** Number of bytes saved by removing metadata. */
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
    /** Fill color for blackout box (Default: '#000000'). */
    fillColor?: string;
    /** Border color (Default: 'rgba(0, 240, 255, 0.4)'). */
    borderColor?: string;
    /** Whether to render token label badges (Default: true). */
    showLabels?: boolean;
}

/**
 * Strips EXIF, XMP, GPS, and sensitive metadata chunks from image buffers (JPEG, PNG, WebP).
 */
export function stripExifMetadata(inputBuffer: Buffer | Uint8Array): ExifStripResult;

/**
 * Redacts bounding boxes on an HTML Canvas or 2D Canvas context.
 */
export function redactImageBoundingBoxes(
    canvasOrCtx: any,
    boxes?: VisionBoundingBox[],
    options?: VisionRedactOptions
): number;

/**
 * Generates an air-gapped SVG redaction mask overlay for headless environments.
 */
export function generateSvgRedactionOverlay(
    dimensions?: { width: number; height: number },
    boxes?: VisionBoundingBox[],
    options?: VisionRedactOptions
): string;
