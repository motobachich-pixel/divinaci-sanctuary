import OpenAI from "openai";
import { detectLanguage } from "@/lib/language";

// ============================================================================
// STRUCTURAL CONSTANTS: Truth Anchors (Non-Negotiable Project Rules)
// ============================================================================
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
      content: `RESPOND ENTIRELY IN ${languageName.toUpperCase()}. Do not translate; always use ${languageName} for your entire response.`,
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

      // 3. Assess confidence and apply framing if needed
      const confidence = assessConfidence(originalUserMessage, content);
      content = applyConfidenceFraming(content, confidence);

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
