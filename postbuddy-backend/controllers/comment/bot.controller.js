import { BotModel } from '../../models/comment/bot.model.js'
import * as Dal from '../../dal/dal.js'
import { errorHandler, responseHandler } from '../../utils/responseHandler.js'
import { createBotPrompts } from '../../prompts/bot.prompts.js'
import * as UserService from '../../service/user/user.service.js'
import * as chatgptServices from "../../utils/chatgpt.services.js";
import { logKey } from "../../utils/logger.js";
import { decryptApiKey } from "../../utils/crypto.js";
import * as AI from '../../utils/ai.service.js'
import * as SubscriptionService from "../../service/payment/subscription.service.js"
import * as CountService from "../../service/comments/count.service.js";


export const BotRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    let key
    let model
    const user = await UserService.findById(userId)
    if (!user) return responseHandler(null, res, 'User not found', 401);

    const subscription = await SubscriptionService.findOne({ userId: user._id })
    if (subscription.gatewaySubscriptionId === "sub_basic" && subscription.status === "active") {
      const check = await CountService.incCount(userId);
      if (check === "Daily limit reached") {
        return responseHandler(null, res, 'Daily limit reached', 400);
      }
      key = process.env.CHAT_GPT_API_KEY
      const data = req.body;
      const messageArray = createBotPrompts(data);
      logKey(`Model Used : ${model}, Key Used : ${key}`)
      const response = await chatgptServices.chatGPT(messageArray.messageArray, key);
      const body = {
        userId: userId,
        text: data.text,
        request: data.request,
        prompt: messageArray.prompt,
        response: response
      }
      const bot = await Dal.create(BotModel, body)
      return responseHandler(response, res, "Bot request successfully", 200);
    }
    else {
      // If keys and model are not present then use our api key
      if (!user.modelApiKey && !user.model) {
        const check = await CountService.incCount(userId);
        if (check === "Daily limit reached") {
          return responseHandler(null, res, 'Daily limit reached', 400);
        }
        key = process.env.CHAT_GPT_API_KEY
      }
      else {
        key = decryptApiKey(user.modelApiKey);
        model = user.model
        if (!key || !model) {
          return responseHandler(null, res, 'model or key is missing', 400);
        }
        const data = req.body;
        const messageArray = createBotPrompts(data);
        logKey(`Model Used : ${model}, Key Used : ${key}`)
        const response = await AI.comment(messageArray.messageArray, model, key)
        const body = {
          userId: userId,
          prompt: messageArray.prompt,
          comment: response
        };
        const comment = await CommentService.create(body);
        return responseHandler(comment.comment, res);
      }
    }

    const data = req.body;
    const messageArray = createBotPrompts(data);
    logKey(`Model Used : ${model}, Key Used : ${key}`)
    const response = await chatgptServices.chatGPT(messageArray.messageArray, key);
    const body = {
      userId: userId,
      text: data.text,
      request: data.request,
      prompt: messageArray.prompt,
      response: response
    }
    const bot = await Dal.create(BotModel, body)
    return responseHandler(response, res, "Bot request successfully", 200);

  } catch (error) {
    console.log(error)
    errorHandler('ERR_WHILE_REQUESTING_BOT', res, 500);
  }
}