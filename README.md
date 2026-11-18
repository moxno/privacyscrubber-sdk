# @privacyscrubber/sdk

[![NPM Version](https://img.shields.io/npm/v/@privacyscrubber/sdk?color=10b981&label=npm)](https://www.npmjs.com/package/@privacyscrubber/sdk)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-059669.svg)](https://www.npmjs.com/package/@privacyscrubber/sdk)
[![Latency](https://img.shields.io/badge/latency-%3C1ms-2563eb.svg)](https://privacyscrubber.com/dlp-speed-test/)
[![Zero Network Egress](https://img.shields.io/badge/network_calls-0-0f172a.svg)](https://privacyscrubber.com/sdk/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3b82f6.svg)](./types/index.d.ts)
[![ZTDS Certified](https://img.shields.io/badge/ZTDS_Standard-Certified_ZTD--2026--001-059669)](https://ztds.ai/companies/privacyscrubber/)
[![IETF Draft](https://img.shields.io/badge/IETF_Draft-draft--sibiryakov--ztds--protocol-6d28d9.svg)](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
[![Patents](https://img.shields.io/badge/Patents-Pending%20(US%20%26%20Intl)-0284c7.svg)](https://privacyscrubber.com/patents/)
[![License](https://img.shields.io/badge/License-Community%20%26%20Commercial-0f172a.svg)](./LICENSE)

**Official Node.js, TypeScript, Browser, and WASM Developer SDK (`@privacyscrubber/sdk`) for Zero-Trust Data Sanitization (ZTDS™).**

`@privacyscrubber/sdk` intercepts and neutralizes PII, regulated identifiers, and DevOps/cloud credentials inside local process RAM before prompts, retrieved RAG chunks, embeddings, or tool payloads leave your infrastructure — guaranteeing **Zero Network & Cloud Leakage** with sub-millisecond execution and deterministic surrogate restoration.

> **Package vs. Repository Architecture:** The compiled zero-dependency npm runtime (`@privacyscrubber/sdk`) is published directly to npm under dual Community & Commercial licensing ([`./LICENSE`](./LICENSE)). This repository hosts TypeScript declarations (`./types/`), framework integration recipes (`./examples/`), issue tracking, and architectural documentation. Looking for the cursor/IDE Model Context Protocol server instead? See [`moxno/privacyscrubber-mcp`](https://github.com/moxno/privacyscrubber-mcp).

---

### Core Architecture Guarantees

- **Zero Network & Cloud Leakage:** All detection, tokenization, and restoration run 100% inside local process RAM. Zero outbound HTTP calls, zero third-party sanitization subprocessors, and zero disk persistence.
- **Deterministic Surrogate Tokenization:** Entities become syntax-preserving typed surrogates (`[NAME_1]`, `[EMAIL_1]`, `[SECRET_1]`, `[FINANCIAL_1]`), retaining LLM reasoning accuracy and multi-turn conversational continuity.
- **Fault-Tolerant Reverse Detokenization:** `unscrubText()` and streaming detokenizers restore LLM completions cleanly back to original cleartext in local memory even when models alter token casing or wrap tokens in Markdown.
- **30 Specialized Industry Profiles:** General consumer baseline (Free) plus 30 specialized industry profiles across Healthcare (HIPAA Safe Harbor), Financial Services (PCI-DSS / IBAN / SWIFT), Legal Privilege, DevSecOps Cloud Secrets, Defense, Automotive, Telecom, and Biotech.
- **Local Compliance Receipts:** Generate SHA-256 audit receipts, severity ratings, and framework attribution metadata in memory for SIEM logging and Statutory Risk Minimization under GDPR Art. 32, Israel Amendment 13 Sec. 17, HIPAA Safe Harbor, SOC 2, PCI-DSS, and NIST AI RMF.

---

### Installation & Subpath Exports

```bash
npm install @privacyscrubber/sdk
```

| Import Path | Environment | Primary Purpose | Types |
| :--- | :--- | :--- | :--- |
| `@privacyscrubber/sdk` | Node.js >= 18 (ESM & CJS) | Core `scrubText`, `unscrubText`, `wrapOpenAI`, RAG & Vector DB guards, audit receipts | [`types/index.d.ts`](./types/index.d.ts) |
| `@privacyscrubber/sdk/browser` | Browsers & Edge Workers | Client-side ESM bundle for SPA/PWA sanitization in browser RAM | [`types/index.d.ts`](./types/index.d.ts) |
| `@privacyscrubber/sdk/vercel-ai` | Vercel AI SDK | `withPrivacyScrubber`, `createPrivacyMiddleware`, `createDetokenizerTransformStream` | [`types/vercel-ai.d.ts`](./types/vercel-ai.d.ts) |
| `@privacyscrubber/sdk/fastmcp` | FastMCP Tool Servers | Zero-trust middleware wrapping MCP tool arguments and return payloads | [`types/fastmcp.d.ts`](./types/fastmcp.d.ts) |
| `@privacyscrubber/sdk/vision` | Document / Multimodal | In-memory vision & structured document pre-flight boundary | [`types/vision.d.ts`](./types/vision.d.ts) |
| `@privacyscrubber/sdk/sarif` | CI/CD Security Gates | SARIF v2.1.0 output formatter for repository PII & secret scans | — |

CLI tools included with `@privacyscrubber/sdk`:

```bash
npx @privacyscrubber/sdk --help
```

---

### Quick Start

#### 1. Core In-Memory Scrub & Restore (TypeScript / Node.js)

```ts
import { scrubText, unscrubText } from '@privacyscrubber/sdk';

const prompt = 'Prepare renewal memo for Dana Levi (dana@acme-corp.example, +1-415-555-0192).';

// Sanitize locally in RAM (<1ms, 0 external calls)
const { maskedText, tokenMap, stats } = scrubText(prompt, {
  profile: 'General',
  detectSecrets: true
});
// maskedText -> "Prepare renewal memo for [NAME_1] ([EMAIL_1], [PHONE_1])."

// Send ONLY `maskedText` to your external LLM provider...
const llmReply = 'Renewal memo drafted for [NAME_1] via [EMAIL_1].';

// Re-hydrate original values strictly inside local RAM
const finalOutput = unscrubText(llmReply, tokenMap);
```

#### 2. Vercel AI SDK Streaming Middleware (`@privacyscrubber/sdk/vercel-ai`)

Wraps streaming responses so tokens split across SSE chunk boundaries are reassembled and restored seamlessly in memory:

```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { withPrivacyScrubber } from '@privacyscrubber/sdk/vercel-ai';

const safeModel = withPrivacyScrubber(openai('gpt-4o'), {
  profile: 'Financial',
  licenseKey: process.env.PRIVACYSCRUBBER_KEY
});

const result = await streamText({
  model: safeModel,
  prompt: 'Summarize account wire instructions for IBAN DE89370400440532013000.'
});
```

#### 3. RAG & Vector Database Guard

Sanitize documents and metadata *before* computing embeddings so raw PII never enters Pinecone, Qdrant, Chroma, or Weaviate:

- [`examples/vercel-ai-stream.js`](./examples/vercel-ai-stream.js) — Vercel AI SDK `withPrivacyScrubber`, middleware & stream transform
- [`examples/langchain-rag.js`](./examples/langchain-rag.js) — LangChain document transformer & RAG answer re-hydration
- [`examples/llamaindex-rag.js`](./examples/llamaindex-rag.js) — LlamaIndex `TextNode` / document pre-ingestion transform
- [`examples/vector-guard-rag.js`](./examples/vector-guard-rag.js) — Chroma, Pinecone, Qdrant & Weaviate vector ingestion wrapper

To run the examples locally after installing `@privacyscrubber/sdk`:

```bash
cd examples
npm install
node vercel-ai-stream.js
```

---

### Architectural Comparison

| Dimension | `@privacyscrubber/sdk` | Self-Hosted NLP (Presidio / spaCy) | Cloud DLP APIs |
| :--- | :--- | :--- | :--- |
| **Execution** | Local In-Process RAM (`<1ms`) | Python Microservice (`~35ms+` HTTP hop) | External Cloud API (`180–500ms`) |
| **Network Egress** | 0 Bytes (Air-Gapped) | Internal Service Traffic | Full Cleartext Sent to 3rd Party |
| **Subprocessors / DPA** | None (0 external vendors) | Internal Compute Only | External Data Subprocessor Required |
| **Reversibility** | Deterministic Surrogate Re-hydration | Manual External Vault | Typically Lossy / Non-Reversible |
| **Dependencies** | 0 Runtime Dependencies | 500MB+ ML Runtime | Proprietary Cloud SDK |

---

### Licensing, Commercial Tiers & Support

- **Free Tier (`$0`):** General baseline profile evaluation (`15,000` chars/scrub) and Specialized Industry Profile trial evaluation (`5,000` chars/scrub).
- **Developer SDK (`$299/mo` or `$2,990/yr`):** Unlimited characters, all 30 Specialized Industry Profiles, offline license validation, unlimited internal backend nodes/microservices/RAG pipelines.
- **TEAMS (`$99/mo` flat):** Unlimited team seats, encrypted session handoff, and governance cockpit.
- **Enterprise / OEM:** Air-gapped source licensing and custom compliance profile calibration (`Custom Enterprise Licensing`).

- **Documentation & Live Sandbox:** [privacyscrubber.com/sdk/](https://privacyscrubber.com/sdk/)
- **Pricing & Self-Serve Key Issuance:** [privacyscrubber.com/#pricing](https://privacyscrubber.com/#pricing)
- **Intellectual Property:** [privacyscrubber.com/patents/](https://privacyscrubber.com/patents/)
- **ZTDS™ Open Standard & IETF Specification:** [ztds.ai/standard/](https://ztds.ai/standard/) · [`draft-sibiryakov-ztds-protocol`](https://datatracker.ietf.org/doc/draft-sibiryakov-ztds-protocol/)
- **Support & Security Disclosures:** `support@privacyscrubber.com` · [GitHub Issues](https://github.com/moxno/privacyscrubber-sdk/issues)
