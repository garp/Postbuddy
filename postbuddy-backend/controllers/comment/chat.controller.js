import { chatsPrompt, recreatePostPrompt } from "../../prompts/chats.prompt.js";
import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import * as chatgptServices from "../../utils/chatgpt.services.js";
import * as UserService from "../../service/user/user.service.js";
import * as SubscriptionService from "../../service/payment/subscription.service.js";
import { OpenAI } from "openai";
import fs from "fs";
import * as CommentService from "../../service/comments/comment.service.js";
import * as CountService from "../../service/comments/count.service.js";
import { logKey } from "../../utils/logger.js";
import { decryptApiKey } from "../../utils/crypto.js";
import chalk from "chalk";
import { multiModelService } from "../../utils/ai.service.js";
import BrandVoiceService from "../../service/user/brandVoice.service.js";

export const generateChat = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return errorHandler({ message: "User not found" }, res, 404);
    }
    const data = req.body;

    let brandVoice = [];
    if (data.metaDetails.brandVoice) {
      brandVoice = await BrandVoiceService.getBrandVoiceById(
        data.metaDetails.brandVoice
      );
    }
    const summary =
      brandVoice.length > 0 ? brandVoice[0].brandVoicesDetails.summary : "";
    const messageArrayData = chatsPrompt(data, summary);

    const currentSubscription = await SubscriptionService.findOne({
      userId: user._id,
      status: "active",
    });

    // User is on Free Plan
    if (currentSubscription.gatewaySubscriptionId === "sub_basic") {
      const checkCount = await CountService.incCount(user._id);
      if (checkCount === "Daily limit reached") {
        return errorHandler("Daily limit reached", res, 429);
      }
      const chatResponse = await chatgptServices.chatGPT(
        messageArrayData.messageArray,
        process.env.CHAT_GPT_API_KEY
      );
      const body = {
        userId: user._id,
        prompt: messageArrayData.prompt,
        comment: chatResponse,
        platform: data.platform,
        type: "chat",
      };
      await CommentService.create(body);
      responseHandler(body.comment, res);
    }

    // User is on Paid Plan
    else {
      // User users model and modelApiKey
      if (user.model && user.modelApiKey) {
        const key = decryptApiKey(user.modelApiKey);
        const response = await multiModelService(
          user.model,
          key,
          messageArrayData.messageArray
        );
        const body = {
          userId: user._id,
          prompt: messageArrayData.prompt,
          comment: response,
          platform: data.platform,
          type: "chat",
        };
        await CommentService.create(body);
        responseHandler(body.comment, res);
      } else {
        const checkCount = await CountService.incCount(user._id);
        if (checkCount === "Daily limit reached") {
          return errorHandler("Daily limit reached", res, 429);
        }
        const chatResponse = await chatgptServices.chatGPT(
          messageArrayData.messageArray,
          process.env.CHAT_GPT_API_KEY
        );
        const body = {
          userId: user._id,
          prompt: messageArrayData.prompt,
          comment: chatResponse,
          platform: data.platform,
          type: "chat",
        };
        await CommentService.create(body);
        responseHandler(body.comment, res);
      }
    }
  } catch (error) {
    console.log("error : ", error);
    errorHandler(error, res);
  }
};

// const openai = new OpenAI({ apiKey: process.env.CHAT_GPT_API_KEY });

export const recreatePost = async (req, res) => {
  try {
    // Get user information from token
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return errorHandler({ message: "User not found" }, res, 404);
    }

    // Check if user has enough credits
    const checkCount = await CountService.checkCount("recreate", user._id);
    if (checkCount === "Daily limit reached") {
      return errorHandler("Daily limit reached, Please Upgrade Plan", res, 429);
    }

    // Get request data and create prompt for AI
    const data = req.body;
    const { messageArray } = recreatePostPrompt(data);
    let rewrittenPost;

    // Validate message format
    if (!messageArray) {
      responseHandler(null, res, "Invalid message format", 400);
      throw new Error("Invalid Message Array format");
    }

    const currentSubscription = await SubscriptionService.findOne({
      userId: user._id,
      status: "active",
    });

    if (currentSubscription.gatewaySubscriptionId === "sub_basic") {
      const response = await chatgptServices.chatGPT(
        messageArray,
        process.env.CHAT_GPT_API_KEY
      );

      // Handle error response from AI service
      if (response === "Error occurred while generating response.") {
        errorHandler(
          { message: "Error communicating with AI service" },
          res,
          500
        );
        throw new Error("Error communicating with AI service");
      }

      rewrittenPost = response;
      const body = {
        userId: user._id,
        prompt: messageArray.prompt,
        comment: rewrittenPost,
        platform: data.platform,
        type: "recreate",
      };
      await CommentService.create(body);

      // Update the count
      await CountService.recreateCountUpdate(user._id);
    }

    // User is on Paid Plan
    else {
      if (user.model && user.modelApiKey) {
        const key = decryptApiKey(user.modelApiKey);

        const response = await multiModelService(user.model, key, messageArray);
        rewrittenPost = response;
        const body = {
          userId: user._id,
          prompt: messageArray.prompt,
          comment: rewrittenPost,
          platform: data.platform,
          type: "recreate",
        };

        await CommentService.create(body);
        responseHandler(body.comment, res);
      } else {
        const response = await chatgptServices.chatGPT(
          messageArray,
          process.env.CHAT_GPT_API_KEY
        );

        // Handle error response from AI service
        if (response === "Error occurred while generating response.") {
          errorHandler(
            { message: "Error communicating with AI service" },
            res,
            500
          );
          throw new Error("Error communicating with AI service");
        }

        rewrittenPost = response;
        const body = {
          userId: user._id,
          prompt: messageArray.prompt,
          comment: rewrittenPost,
          platform: data.platform,
          type: "recreate",
        };
        await CommentService.create(body);

        // Update the count
        await CountService.recreateCountUpdate(user._id);
      }
    }

    // Return the rewritten post to client
    responseHandler(
      {
        rewrittenPost,
      },
      res,
      200
    );
  } catch (error) {
    console.log("error: ", error);
    errorHandler(error, res);
    throw new Error(error);
  }
};
