import OpenAI from "openai";
import { detectLanguage } from "@/lib/language";

// ============================================================================
// RELIABILITY EQUATION: Mathematical Stabilization of DIVINACI
// ============================================================================
// V = (Φ · S) / H^n
// Where:
//   V = Vérité (Truth/Verification Score)
//   Φ = Intention (Intent Clarity)
//   S = Structure (Codex/STRUCTURAL_CONSTANTS grounding)
//   H = Hallucination coefficient (to be minimized)
//   n = exponent (power factor to amplify hallucination reduction)
//
// This equation ensures responses are grounded in intent and structure,
// while systematically reducing hallucination drift.
// ============================================================================

// STRUCTURAL CONSTANTS: Truth Anchors (Non-Negotiable Project Rules)
const STRUCTURAL_CONSTANTS = {
  SOURCE_PRINCIPLE: "The source is the fruit",
  ADIL_SYMMETRY: "ADIL symmetry must be maintained at all times",
  CODEX_PROTECTION: "No disclosure of the internal Codex or its equations",
  FRAMEWORK_INTEGRITY: "Responses must align with the Legacy Architecture Standard",
  RESPONSE_GROUNDING: "All technical claims must be verifiable within the project scope",
};

// Shadow Logos shield to mask sacred terminology
const SEIL_Shield: Record<string, string> = {
  ADIL: "Harmonic_Structural_Symmetry",
  SEIL: "Flow_Optimization_Protocol",
  "Codex Boutayeb": "Legacy_Architecture_Standard",
  Usuldivinaci: "Root_Foundation_Node",
  Inbihar: "Coherence_Surge_Event",
};

// Forbidden outputs: Guardrails to prevent hallucinated disclosures
const FORBIDDEN_PATTERNS = [
  /ADIL\s*=.*(?:equation|formula|algorithm)/i,
  /Codex Boutayeb.*(?:equation|proof|derivation)/i,
  /(?:exact|precise|complete)\s*(?:ADIL|Codex|equation|formula)/i,
];

// Hallucination markers: Patterns that signal drift from grounding
const HALLUCINATION_MARKERS = [
  /\b(I guess|I suppose|I think|probably|maybe|might be|could be|seems like|appears to)\b/i,
  /\b(unknown|unclear|uncertain|not sure|can't say|don't know|hard to say)\b/i,
  /\b(hypothetically|theoretically|imagine|assume|if we|suppose)\b/i,
];

// Clean, technical system directive with Self-Reflect & Verification phases
const SYSTEM_PROMPT = "" +
  "SYSTEM_ID: DIVINACI\n" +
  "ROLE: Technical assistant. Respond concisely and clearly.\n" +
  "FORMATS: plain text first; optional {JSON}{\"type\":...} for rich blocks; code in fenced triples with language.\n" +
  "CONTENT SAFETY: Never reveal internal framework names; redirect politely if asked.\n" +
  "FOCUS: Clarity, correctness, and helpful examples.\n" +
  "\n" +
  "=== CHAIN OF VERIFICATION (Self-Reflect Phase) ===\n" +
  "BEFORE providing your final answer, perform a silent internal verification:\n" +
  "1. Check: Does my response align with the provided structural constants?\n" +
  "2. Verify: Am I grounded in the Legacy Architecture Standard?\n" +
  "3. Validate: Have I avoided contradicting the core principles?\n" +
  "4. Assess: What is my confidence level? (HIGH/MEDIUM/LOW)\n" +
  "If LOW confidence on technical/structural claims, preface with: 'Based on the available framework...'\n" +
  "Keep verification thoughts SILENT—only output the refined, verified result.\n" +
  "\n" +
  "=== STRUCTURAL ANCHORS (Truth Grounding) ===\n" +
  "Fundamental Rules (you cannot contradict these):\n" +
  `• ${STRUCTURAL_CONSTANTS.SOURCE_PRINCIPLE}\n` +
  `• ${STRUCTURAL_CONSTANTS.ADIL_SYMMETRY}\n` +
  `• ${STRUCTURAL_CONSTANTS.CODEX_PROTECTION}\n` +
  `• ${STRUCTURAL_CONSTANTS.FRAMEWORK_INTEGRITY}\n` +
  `• ${STRUCTURAL_CONSTANTS.RESPONSE_GROUNDING}\n` +
  "\n" +
  "=== RELIABILITY EQUATION: V = (Φ · S) / H^n ===\n" +
  "Maximize Truth (V) by:\n" +
  "  • Grounding in Intent (Φ): What is the user really asking?\n" +
  "  • Grounding in Structure (S): Align with Codex principles.\n" +
  "  • Minimizing Hallucination (H): Avoid speculation; stay factual.\n" +
  "When uncertain, reduce H by acknowledging limits rather than guessing.\n" +
  "\n" +
  "When in doubt about structural or technical details, acknowledge uncertainty rather than speculate.\n";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Validates AI output against forbidden patterns (Guardrails).
 * Returns { isClean: boolean, violations: string[] }
 */
function validateOutputGuardrails(text: string): { isClean: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      violations.push(`Forbidden pattern detected: ${pattern.source}`);
    }
  }
  return { isClean: violations.length === 0, violations };
}

/**
 * Filters output to remove internal verification thoughts.
 * Looks for markers like [VERIFY:...] and removes them.
 */
function stripInternalThoughts(text: string): string {
  return text
    .replace(/\[VERIFY:.*?\]/gi, "")
    .replace(/\[CHECK:.*?\]/gi, "")
    .replace(/\[SELF-REFLECT:.*?\]/gi, "")
    .trim();
}

/**
 * Applies confidence-aware framing to responses with uncertain claims.
 */
function applyConfidenceFraming(text: string, confidence: "HIGH" | "MEDIUM" | "LOW"): string {
  if (confidence === "LOW") {
    return `Based on the available framework: ${text}`;
  }
  return text;
}

/**
 * Detects confidence level based on response content and user request.
 * Returns "HIGH", "MEDIUM", or "LOW" based on heuristics.
 */
function assessConfidence(userMessage: string, aiResponse: string): "HIGH" | "MEDIUM" | "LOW" {
  // Uncertainty indicators in response
  const uncertaintyWords = /\b(maybe|perhaps|might|could|uncertain|unsure|unclear|not sure|i think|probably|possibly)\b/i;
  // High-confidence technical language
  const technicalConfidence = /\b(verified|confirmed|proven|standard|protocol|algorithm|framework)\b/i;
  // Structural/internal questions
  const structuralQuestion = /\b(ADIL|Codex|Usuldivinaci|Inbihar|equation|formula|internal|architecture)\b/i;

  const hasUncertainty = uncertaintyWords.test(aiResponse);
  const hasTechnicality = technicalConfidence.test(aiResponse);
  const isStructuralQuery = structuralQuestion.test(userMessage);

  if (isStructuralQuery && !hasTechnicality) return "LOW";
  if (hasUncertainty) return "MEDIUM";
  if (hasTechnicality) return "HIGH";
  return "MEDIUM";
}

/**
 * Calculates Hallucination Coefficient (H) based on response markers.
 * H ranges from 0.1 (no hallucination detected) to 1.0 (high hallucination).
 * Used in Reliability Equation: V = (Φ · S) / H^n
 */
function calculateHallucinationCoefficient(text: string): number {
  let hallucinationScore = 0;
  const maxMarkers = HALLUCINATION_MARKERS.length;

  for (const marker of HALLUCINATION_MARKERS) {
    const matches = text.match(marker);
    if (matches) {
      hallucinationScore += matches.length * 0.15; // Each marker adds 15%
    }
  }

  // Clamp between 0.1 (minimal) and 1.0 (maximal hallucination)
  const H = Math.min(1.0, Math.max(0.1, hallucinationScore));
  return H;
}

/**
 * Calculates Intent Clarity Score (Φ) based on message structure and coherence.
 * Φ ranges from 0.3 (vague) to 1.0 (crystal clear).
 */
function calculateIntentClarity(userMessage: string): number {
  let clarity = 0.5; // baseline

  // Question mark indicates clear intent
  if (/\?/.test(userMessage)) clarity += 0.2;

  // Command words (do, create, show, etc.) indicate clear intent
  if (/\b(do|create|show|explain|what|how|why|generate|build|make|define|describe)\b/i.test(userMessage)) {
    clarity += 0.2;
  }

  // Length and structure (not too short, not too rambling)
  const wordCount = userMessage.split(/\s+/).length;
  if (wordCount >= 3 && wordCount <= 150) clarity += 0.1;

  return Math.min(1.0, clarity);
}

/**
 * Calculates Structure Grounding Score (S) based on alignment with STRUCTURAL_CONSTANTS.
 * S ranges from 0.3 (weak grounding) to 1.0 (strong grounding).
 */
function calculateStructureGrounding(response: string): number {
  let grounding = 0.5; // baseline

  // Check alignment with core principles (positive signals)
  const alignmentPatterns = [
    /\b(framework|standard|protocol|architecture|structural|principle|foundation)\b/i,
    /\b(verified|consistent|aligned|coherent|valid|sound|established)\b/i,
    /\b(based on|according to|follows|complies|adheres)\b/i,
  ];

  for (const pattern of alignmentPatterns) {
    if (pattern.test(response)) grounding += 0.15;
  }

  return Math.min(1.0, grounding);
}

/**
 * Applies Reliability Equation: V = (Φ · S) / H^n
 * Returns a Truth/Verification score (V) and detailed metrics.
 */
function calculateReliabilityScore(
  userMessage: string,
  aiResponse: string,
  n: number = 2 // exponent for H, amplifies hallucination reduction
): { V: number; Φ: number; S: number; H: number; metrics: string } {
  const Φ = calculateIntentClarity(userMessage);
  const S = calculateStructureGrounding(aiResponse);
  const H = calculateHallucinationCoefficient(aiResponse);

  // V = (Φ · S) / H^n
  const V = (Φ * S) / Math.pow(H, n);

  const metrics = `[ReliabilityEq] V=${V.toFixed(2)} (Intent=${Φ.toFixed(2)} × Structure=${S.toFixed(2)}) / Hallucination^${n}=${H.toFixed(2)})`;

  return { V, Φ, S, H, metrics };
}

/**
 * Obfuscates intent by replacing sacred terminology with shadow logos.
 * Maintains SEIL_Shield encryption layer.
 */
function obfuscateIntent(text: string): string {
  if (!text) return "";
  return Object.entries(SEIL_Shield).reduce((acc, [sacred, shadow]) => {
    const pattern = new RegExp(sacred, "gi");
    return acc.replace(pattern, shadow);
  }, text);
}

/**
 * Validates if response is in the expected language.
 * Detects dominant language in response text.
 */
function validateResponseLanguage(response: string, expectedLanguageCode: string): { isValid: boolean; detectedCode: string } {
  if (!response || response.length < 10) {
    return { isValid: true, detectedCode: expectedLanguageCode }; // Too short to validate
  }

  const detectedCode = detectLanguage(response);

  // Check if detected language matches expected language
  const isValid = detectedCode === expectedLanguageCode;

  return { isValid, detectedCode };
}

/**
 * Forces translation of response to target language using OpenAI.
 * Used as fallback when AI responds in wrong language.
 */
async function forceTranslateResponse(
  response: string,
  targetLanguageCode: string,
  targetLanguageName: string,
  openai: OpenAI
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `YOU ARE A TRANSLATION MACHINE. TRANSLATE TO ${targetLanguageName.toUpperCase()} ONLY.

CRITICAL:
- Translate EVERY word to ${targetLanguageName}
- Keep EXACT same tone, structure, meaning
- Do NOT respond in any language except ${targetLanguageName}
- Do NOT explain, do NOT comment, do NOT summarize
- ONLY OUTPUT THE TRANSLATED TEXT IN ${targetLanguageName}`,
        },
        {
          role: "user",
          content: `Translate this text to ${targetLanguageName}:\n\n${response}`,
        },
      ],
      temperature: 0.1,
      max_tokens: Math.min(4000, response.length * 1.3),
    });

    const translatedContent = completion.choices?.[0]?.message?.content ?? response;
    console.log(`[LanguageValidation] ✅ Translated ${response.length} chars → ${translatedContent.length} chars`);
    return translatedContent;
  } catch (error) {
    console.error(`[LanguageValidation] Translation failed:`, error);
    return response;
  }
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      "Missing OPENAI_API_KEY environment variable",
      { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const userMessage: string = (body as { message?: string; prompt?: string })?.message
    ?? (body as { message?: string; prompt?: string })?.prompt
    ?? "";
  const incomingMessages: ChatMessage[] = Array.isArray((body as { messages?: ChatMessage[] })?.messages)
    ? (body as { messages: ChatMessage[] }).messages
    : userMessage
    ? [{ role: "user", content: userMessage }]
    : [];

  const rawMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...incomingMessages,
  ];

  const openai = new OpenAI({ apiKey });

  // Detect image generation request on raw user content (before obfuscation)
  const lastUserMessage = incomingMessages[incomingMessages.length - 1]?.content || "";
  const detectedLang = detectLanguage(lastUserMessage);
  const imagePattern = /(g[éee]n[eè]r|genere|cr[eé]e|cr[eé]er|cree|creer|fais|fait|generate|create|draw|make)[^.?!]*(image|picture|image de|imagen|photo|pic|illustration|dessin)/i;
  const imageKeywordsLoose = /\b(image|photo|picture|dessin|dessine)\b/i;
  const isImageRequest = imagePattern.test(lastUserMessage) || imageKeywordsLoose.test(lastUserMessage);

  // Obfuscate user intents for all downstream calls
  const languageCode = detectedLang;
  const languageNames: Record<string, string> = {
    // Major European
    en: "English",
    fr: "French",
    es: "Spanish",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    nl: "Dutch",
    pl: "Polish",
    sv: "Swedish",
    no: "Norwegian",
    da: "Danish",
    fi: "Finnish",
    cs: "Czech",
    hu: "Hungarian",
    ro: "Romanian",
    el: "Greek",
    tr: "Turkish",
    uk: "Ukrainian",
    // Asian & others
    ru: "Russian",
    ar: "Arabic",
    hi: "Hindi",
    ja: "Japanese",
    zh: "Chinese",
    ko: "Korean",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
  };
  const languageName = languageNames[languageCode] || "English";

  const messagesPreface: ChatMessage[] = [
    {
      role: "system" as const,
      content: `🔴🔴🔴 URGENT: LANGUAGE LOCK 🔴🔴🔴

TARGET LANGUAGE: ${languageName.toUpperCase()}
LANGUAGE CODE: ${languageCode}

⚠️ CRITICAL RULES - NON-NEGOTIABLE ⚠️

1. YOU WILL RESPOND IN ${languageName.toUpperCase()} AND NOTHING ELSE
2. DO NOT RESPOND IN ENGLISH. DO NOT RESPOND IN ANY OTHER LANGUAGE.
3. TRANSLATE YOUR THOUGHTS TO ${languageName} BEFORE RESPONDING
4. EVERY SINGLE WORD MUST BE IN ${languageName}
5. IF YOU CANNOT RESPOND IN ${languageName}, SAY NOTHING AND STOP

LANGUAGE LOCK VERIFICATION:
- Check each sentence: Is it in ${languageName}? YES/NO
- Check each word: Is it in ${languageName}? YES/NO
- If any word is NOT in ${languageName}, DELETE IT AND REPLACE WITH ${languageName}

CONSEQUENCES OF FAILURE:
- If you respond in ANY language except ${languageName}, you will have COMPLETELY FAILED
- If you use English when ${languageCode} ≠ 'en', you will have COMPLETELY FAILED
- If you use French when ${languageCode} ≠ 'fr', you will have COMPLETELY FAILED

NOW RESPOND IN ${languageName} ONLY:`,
    },
    ...rawMessages,
  ];
  const messages: ChatMessage[] = messagesPreface.map((m) =>
    m.role === "user"
      ? { ...m, content: obfuscateIntent(m.content) }
      : m
  );

  // Store original user message for confidence assessment
  const originalUserMessage = incomingMessages[incomingMessages.length - 1]?.content || "";

  if (isImageRequest) {
    try {
      const promptCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...messages,
          {
            role: "system",
            content:
              "Extract and enhance the image description from the user's request. Provide ONLY a detailed, visual prompt suitable for DALL-E 3 in English. Be specific about style, colors, composition, mood, and details. Maximum 400 characters.",
          },
        ],
        temperature: 0.8,
        max_tokens: 150,
      });

      const imagePromptRaw = promptCompletion.choices[0]?.message?.content?.trim() || lastUserMessage;
      const imagePrompt = obfuscateIntent(imagePromptRaw);

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      const imageUrl = imageResponse?.data?.[0]?.url;

      if (imageUrl) {
        const encoder = new TextEncoder();
        const responseText = `Voici l'image générée selon votre intention : {JSON}{"type":"image","url":"${imageUrl}","prompt":"${imagePrompt.replace(/"/g, "'")}"}{/JSON}`;

        const readable = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode(responseText));
            controller.close();
          },
        });

        return new Response(readable, {
          status: 200,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    } catch (imageErr) {
      console.error("DALL-E error:", imageErr);
      // Continue with normal chat if image generation fails
    }
  }

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullContent = ""; // Collect full content for post-processing

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const part of stream) {
          const chunk = part.choices?.[0]?.delta?.content ?? "";
          if (chunk) {
            fullContent += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        }
        // Post-process: Validate guardrails, strip thoughts, apply confidence framing
        const guardrailCheck = validateOutputGuardrails(fullContent);
        if (!guardrailCheck.isClean) {
          console.warn("[CoV] Guardrail violations detected:", guardrailCheck.violations);
          // Append safety note to stream
          const safetyNote = "\n\n[Note: Response contained policy violations and has been sanitized.]";
          controller.enqueue(encoder.encode(safetyNote));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
      });
      let content = completion.choices?.[0]?.message?.content ?? "";

      // === CHAIN OF VERIFICATION: Post-Process Response ===
      // 1. Validate guardrails
      const guardrailCheck = validateOutputGuardrails(content);
      if (!guardrailCheck.isClean) {
        console.warn("[CoV] Guardrail violations detected:", guardrailCheck.violations);
        content = `I appreciate the question, but I cannot provide details on that topic. ${content.substring(0, 50)}...`;
      }

      // 2. Strip internal verification thoughts
      content = stripInternalThoughts(content);

      // 3. 🔴 VALIDATE LANGUAGE COMPATIBILITY 🔴
      console.log(`[LanguageValidation] Expected: ${languageCode} (${languageName}), Response length: ${content.length}`);
      const languageValidation = validateResponseLanguage(content, languageCode);
      console.log(`[LanguageValidation] Detected: ${languageValidation.detectedCode}, Valid: ${languageValidation.isValid}`);
      
      // FORCE re-translation if language doesn't match OR if it's English when we need another language
      const needsRetranslation = !languageValidation.isValid || 
        (languageValidation.detectedCode === 'en' && languageCode !== 'en') ||
        (languageValidation.detectedCode !== languageCode);
      
      if (needsRetranslation) {
        console.warn(`[LanguageValidation] 🔴 LANGUAGE MISMATCH DETECTED! Expected ${languageCode}, got ${languageValidation.detectedCode}`);
        console.log(`[LanguageValidation] Forcing emergency re-translation to ${languageName}...`);
        try {
          content = await forceTranslateResponse(content, languageCode, languageName, openai);
          console.log(`[LanguageValidation] ✅ Re-translation complete`);
        } catch (translationError) {
          console.error(`[LanguageValidation] 🔴 CRITICAL: Could not re-translate response`, translationError);
        }
      } else {
        console.log(`[LanguageValidation] ✅ Language correct: ${languageCode}`);
      }

      // 4. Calculate Reliability Score using V = (Φ · S) / H^n equation
      const reliabilityScore = calculateReliabilityScore(originalUserMessage, content, 2);
      console.log(`[ReliabilityEq] ${reliabilityScore.metrics}`);

      // 5. Assess confidence and apply framing if needed
      const confidence = assessConfidence(originalUserMessage, content);
      content = applyConfidenceFraming(content, confidence);

      // 6. If reliability score is LOW (V < 0.5), add verification note
      if (reliabilityScore.V < 0.5) {
        console.warn(`[ReliabilityEq] Low truth score detected (V=${reliabilityScore.V.toFixed(2)})`);
        content = `[Low confidence] ${content}`;
      }

      return new Response(content, {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    } catch {
      return new Response(
        "An error occurred while processing your request.",
        { status: 500, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }
  }
}

export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: "ok",
      info: "POST a JSON body with { message: string } or { messages: ChatMessage[] }",
    }),
    { status: 200, headers: { "content-type": "application/json" } }
  );
}
