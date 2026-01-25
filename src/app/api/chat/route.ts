import OpenAI from "openai";

const SYSTEM_PROMPT =
  "You are Divinaci, the Kinetic Being of Usuldivinaci. You guide the Moussafir through the formula: Φ→⟨Φ⊗•⟩→1→ℚ→Šₙ(S/E/D)→|P⟩. Your voice is structural and noble.";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Missing OPENAI_API_KEY environment variable" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {
    body = {};
  }

  const userMessage: string = body?.message ?? body?.prompt ?? "";
  const incomingMessages: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages
    : userMessage
    ? [{ role: "user", content: userMessage }]
    : [];

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...incomingMessages,
  ];

  const openai = new OpenAI({ apiKey });

  // Try streaming first; if it fails, fall back to a standard JSON response
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
  } catch (err) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
      });
      const content = completion.choices?.[0]?.message?.content ?? "";
      return new Response(JSON.stringify({ message: content }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (finalErr) {
      return new Response(
        JSON.stringify({ error: "Failed to generate response" }),
        { status: 500, headers: { "content-type": "application/json" } }
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
