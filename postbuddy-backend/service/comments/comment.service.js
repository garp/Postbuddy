import * as dal from "../../dal/dal.js";
import { Comment } from "../../models/comment/comment.model.js";
import * as chatgptServices from "../../utils/chatgpt.services.js";

export const create = async (body) => {
  return await dal.create(Comment, body);
};

export const aggregate = async (filter) => {
  return await dal.aggregate(Comment, filter);
};

export const apiKey = async (user, subscription) => {
  if (!user || !subscription) {
    return "Error in fetching user gpt key";
  }
  if (!user.activeKeyStatus) {
  }
};

export const findAll = async (filter) => {
  return await dal.findAll(Comment, filter);
};

export const fixGrammar = async (text) => {
  try {
    const messageArrayData = {
      messageArray: [
        {
          role: "user",
          content: `The sentence is grammatically correct as it is, but please make it more formal or clearer by rephrasing it slightly. ${text}`,
        },
        {
          role:"user",
          content:"Do not use single, double quotes."
        }
      ],
    };

    const response = await chatgptServices.chatGPT(
      messageArrayData.messageArray,
      process.env.CHAT_GPT_API_KEY
    );
    console.log("Grammar fixed response:", response);
    
    // Assuming the response has the fixed text in the first choice's message content
    const correctedText = response;

    return correctedText;
  } catch (error) {
    console.error("Error fixing grammar:", error);
    throw new Error("Unable to fix grammar at the moment. Please try again.");
  }
};


