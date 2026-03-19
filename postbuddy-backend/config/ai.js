import dotenv from "dotenv";

dotenv.config({
  path: `./.env`,
});

export const CHAT_GPT = {
  URL: process.env.CHAT_GPT_URL ?? "https://api.openai.com/v1/chat/completions",
  MODEL: process.env.CHAT_GPT_MODEL ?? "gpt-4",
  TEMPERATURE: Number(process.env.CHAT_GPT_TEMPERATURE) ?? 0.7,
  API_KEY: process.env.CHAT_GPT_API_KEY ?? "",
};

export const GEMINI = {
  URL: process.env.GEMINI_URL ?? "https://api.gemini.com/v1/generate",
  MODEL: process.env.GEMINI_MODEL ?? "gemini-pro",
  TEMPERATURE: Number(process.env.GEMINI_TEMPERATURE) ?? 0.7,
  API_KEY: process.env.GEMINI_API_KEY ?? "",
};

export const CLAUDE = {
  URL: process.env.CLAUDE_URL ?? "https://api.anthropic.com/v1/complete",
  MODEL: process.env.CLAUDE_MODEL ?? "claude-v1",
  TEMPERATURE: Number(process.env.CLAUDE_TEMPERATURE) ?? 0.7,
  API_KEY: process.env.CLAUDE_API_KEY ?? "",
  HEADERS: {
    "Anthropic-Version": "2023-06-01",
  },
};

export const DEEPSEEK = {
  URL: process.env.DEEPSEEK_URL ?? "https://api.deepseek.com/v1/chat",
  MODEL: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
  TEMPERATURE: Number(process.env.DEEPSEEK_TEMPERATURE) ?? 0.7,
  API_KEY: process.env.DEEPSEEK_API_KEY ?? "",
};

export const AI_MODELS = {
  "chatgpt": CHAT_GPT,
  "gemini": GEMINI,
  "laude": CLAUDE,
  "deepseek": DEEPSEEK,
};

export const API_ENDPOINTS = {
  chatgpt: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  claude: process.env.ANTHROPIC_API_ENDPOINT || 'https://api.anthropic.com/v1/messages',
  deepseek: process.env.DEEPSEEK_API_ENDPOINT || 'https://api.deepseek.com/v1/chat/completions',
  gemini: process.env.GOOGLE_API_ENDPOINT || `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
  grok: process.env.GROQ_API_ENDPOINT || 'https://api.groq.com/openai/v1/chat/completions'
};

export const PSEUDO = {};
