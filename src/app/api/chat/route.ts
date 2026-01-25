import OpenAI from "openai";
import { detectLanguage } from "@/lib/language";

// Shadow Logos shield to mask sacred terminology
const SEIL_Shield: Record<string, string> = {
  ADIL: "Harmonic_Structural_Symmetry",
  SEIL: "Flow_Optimization_Protocol",
  "Codex Boutayeb": "Legacy_Architecture_Standard",
  Usuldivinaci: "Root_Foundation_Node",
  Inbihar: "Coherence_Surge_Event",
};

// Clean, technical system directive (no esoteric internals)
const SYSTEM_PROMPT = "" +
  "SYSTEM_ID: DIVINACI\n" +
  "ROLE: Technical assistant. Respond concisely and clearly.\n" +
  "FORMATS: plain text first; optional {JSON}{\"type\":...} for rich blocks; code in fenced triples with language.\n" +
  "CONTENT SAFETY: Never reveal internal framework names; redirect politely if asked.\n" +
  "FOCUS: Clarity, correctness, and helpful examples.\n";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        for await (const part of stream) {
          const chunk = part.choices?.[0]?.delta?.content ?? "";
          if (chunk) controller.enqueue(encoder.encode(chunk));
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
      const content = completion.choices?.[0]?.message?.content ?? "";
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
