import * as HttpService from "./httpServices.js";
import { AI_MODELS, API_ENDPOINTS } from "../config/ai.js";
import { logError } from "./logger.js";

export const comment = async (messageArray, model, key) => {
  console.log(messageArray, model, key);
  try {
    if (!AI_MODELS[model]) {
      logError(`Unsupported AI model: ${model}`);
      return `Unsupported AI model: ${model}`;
    }
    const { URL, MODEL, TEMPERATURE, HEADERS = {} } = AI_MODELS[`${model}`];

    const config = {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        ...HEADERS,
      },
    };

    const requestBody = {
      model: MODEL,
      messages: messageArray,
      temperature: TEMPERATURE,
    };

    const { data } = await HttpService.axiosPost(URL, requestBody, config);

    if (
      !data ||
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message
    ) {
      logError(`Unexpected response from ${model} API`);
      return `No valid response from ${model}.`;
    }

    return data.choices[0].message.content;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logError(`Error in ${model} Service: ${errorMessage}`);
    return `Error occurred while generating response from ${model}.`;
  }
};

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export const multiModelService = async (model, key, messageArrayData) => {
  try {

    model = typeof model === "string" ? model.trim().toLowerCase() : "";

    const modelHandlers = {
      chatgpt: () => handleChatGPT(key, messageArrayData, "gpt-4"),
      gemini: () => handleGemini(key, messageArrayData),
      deepseek: () => handleDeepSeek(key, messageArrayData),
    };

    const handler = modelHandlers[model];

    if (!handler) {
      throw new Error(`Unsupported model: ${model}`);
    }
    return await handler();
  } catch (error) {
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};


// ChatGPT API Handler (using direct API calls)
const handleChatGPT = async (apiKey, messages, model) => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages,
      temperature: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0]?.message?.content || "";
};

// Gemini Handler
const handleGemini = async (apiKey, messages) => {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Convert OpenAI message format to Gemini format
    const mapRole = (openaiRole) => {
      if (openaiRole === "assistant") return "model";
      if (openaiRole === "user") return "user";
      if (openaiRole === "system") return "user"; // System messages treated as user in Gemini
      return "user"; // Default fallback
    };

    // Validate each message has required properties
    const validMessages = messages.every(msg => 
      msg && typeof msg === 'object' && 
      typeof msg.role === 'string' && 
      typeof msg.content === 'string'
    );

    if (!validMessages) {
      throw new Error('Invalid message format: each message must have role and content properties');
    }

    if (messages.length > 1) {
      const geminiChat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: mapRole(msg.role),
          parts: [{ text: msg.content }]
        }))
      });
      
      // Send the last message
      const lastMessage = messages[messages.length - 1];
      const result = await geminiChat.sendMessage(lastMessage.content);
      return result.response.text().replace(/\*/g, '');
    } else {
      // Just use generateContent for single messages
      const singleMessage = messages[0];
      const result = await model.generateContent(singleMessage.content);
      return result.response.text();
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

// DeepSeek Handler
const handleDeepSeek = async (apiKey, messages) => {
  const response = await axios.post(
    "https://api.deepseek.com/v1/chat/completions",
    {
      model: "deepseek-chat",
      messages,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0]?.message?.content || "";
};
