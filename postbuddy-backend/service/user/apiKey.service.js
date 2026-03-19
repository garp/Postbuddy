import axios from "axios";
import { encryptApiKey } from "../../utils/crypto.js";
const MODEL_ENDPOINTS = {
  Chatgpt: process.env.CHAT_GPT_URL,
  Gemini: process.env.GEMINI_URL,
  Claude: process.env.CLAUDE_URL,
  Deepseek: process.env.DEEPSEEK_URL,
};

async function checkCorrectKey(key, model) {
  if (!MODEL_ENDPOINTS[model]) {
    throw new Error("Unsupported AI model provided.");
  }

  let baseUrl = MODEL_ENDPOINTS[model];

  let requestData = {};
  let headers = {
    "Content-Type": "application/json",
  };

  switch (model) {
    case "Chatgpt":
      headers["Authorization"] = `Bearer ${key}`;
      requestData = {
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello!" }],
        max_tokens: 5,
      };
      break;

    case "Gemini":
      requestData = {
        "contents": [
          {
            "role": "user",
            "parts": [
              {
                "text": "Tell me a fun fact about octopuses."
              }
            ]
          }
        ]
      };
      baseUrl += `?key=${key}`;
      break;

    case "Claude":
      headers["x-api-key"] = key;
      requestData = {
        prompt: "\n\nHuman: Hello!\n\nAssistant:",
        model: "claude-2",
        max_tokens_to_sample: 5,
      };
      break;

    case "Deepseek":
      headers["Authorization"] = `Bearer ${key}`;
      requestData = {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Hello!" }],
        max_tokens: 5,
      };
      break;
  }

  try {
    const response = await axios.post(baseUrl, requestData, { headers });
    console.log("Response ==> ", response.status);
    return {
      status: response.status,
      valid: true,
      message: "API key is valid.",
    };
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error ${error.response.status}:`, error.response.data);
      return {
        status: 500,
        valid: false,
        message: error.response.data.error?.message || "Invalid API key.",
      };
    } else {
      console.error("❌ Request failed:", error.message);
      return { status: 500, valid: false, message: error.message };
    }
  }
}

export const checkApiKey = async (key, model) => {
  return await checkCorrectKey(key, model);
};

export const addApiKey = async (user, apiKey, model) => {
  try {
    console.log("user : ", user);
    user.modelApiKey = encryptApiKey(apiKey);
    user.model = model.toLowerCase();
    console.log("Data : ", {apiKey, model });
    return await user.save();
  } catch (error) {
    console.error(error.message);
  }
};
