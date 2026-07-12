const BASE_URL = "https://api.tensorx.ai/v1";
const VISION_MODEL = "moonshotai/kimi-k2.5";
const CHAT_MODEL = "deepseek/deepseek-chat-v3.1";
const WHISPER_MODEL = "Systran/faster-whisper-large-v3";

function apiKey() {
  const key = process.env.TENSORX_API_KEY;
  if (!key) throw new Error("TENSORX_API_KEY is not set");
  return key;
}

export async function chatCompletion(messages, { model = CHAT_MODEL } = {}) {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature: 0 }),
  });
  if (!res.ok) {
    throw new Error(`TensorX chat error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

export function visionModel() {
  return VISION_MODEL;
}

export async function transcribeAudio(file, { language = "en", prompt } = {}) {
  const form = new FormData();
  form.append("file", file, file.name || "audio.webm");
  form.append("model", WHISPER_MODEL);
  form.append("language", language);
  if (prompt) form.append("prompt", prompt);

  const res = await fetch(`${BASE_URL}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`TensorX audio error ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.text;
}

// Models sometimes wrap JSON in markdown fences despite instructions;
// strip them and any surrounding prose before parsing.
export function parseJsonResponse(raw) {
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) text = text.slice(start, end + 1);
  return JSON.parse(text);
}
