
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "AI is not configured yet."
    });
  }

  try {
    const body = req.body || {};
    const incoming = body.messages;

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return res.status(400).json({
        error: "Please send a message."
      });
    }

    // Limit history and message size
    const messages = incoming.slice(-10);

    for (const msg of messages) {
      if (
        !msg ||
        !["user", "assistant"].includes(msg.role) ||
        typeof msg.content !== "string" ||
        msg.content.length > 4000
      ) {
        return res.status(400).json({
          error: "Invalid message."
        });
      }
    }

    if (messages[messages.length - 1].role !== "user") {
      return res.status(400).json({
        error: "A user message is required."
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `You are Nextplay AI, a helpful,
friendly all-purpose assistant.

Help with coding, learning, writing, brainstorming
and everyday questions.

Reply in the language the user prefers.
For Hindi written in Roman script, reply similarly.
Explain things clearly and honestly.
Never claim you performed an action you did not do.`
            },
            ...messages
          ],
          max_completion_tokens: 1200
        }),
        signal: AbortSignal.timeout(25000)
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({
          error: "AI is busy. Please try again shortly."
        });
      }

      console.error("AI provider error:", response.status);

      return res.status(502).json({
        error: "AI service is temporarily unavailable."
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({
        error: "No response received from AI."
      });
    }

    return res.status(200).json({
      reply: reply.trim()
    });
  } catch (error) {
    console.error("Chat request failed:", error.name);

    return res.status(502).json({
      error: "Could not connect to AI. Please try again."
    });
  }
}
