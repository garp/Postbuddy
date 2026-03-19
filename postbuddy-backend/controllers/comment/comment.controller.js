import { responseHandler, errorHandler } from "../../utils/responseHandler.js";
import * as chatgptServices from "../../utils/chatgpt.services.js";
// import { commentCreatePrompt } from "../../prompts/commentV1.prompts.js";
import { commentCreatePrompt } from "../../prompts/comment.prompts.js";
import * as CountService from "../../service/comments/count.service.js";
import * as CommentService from "../../service/comments/comment.service.js";
import * as SubscriptionService from "../../service/payment/subscription.service.js";
import BrandVoiceService from "../../service/user/brandVoice.service.js";
// import * as Queries from '../../query/comment.js'
import * as UserService from "../../service/user/user.service.js";
import * as AI from "../../utils/ai.service.js";
import { decryptApiKey } from "../../utils/crypto.js";
import { logKey } from "../../utils/logger.js";

export const generateComment = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const data = req.body;

    // Validate user exists
    const user = await UserService.findById(userId);
    if (!user) {
      return errorHandler({ message: "User not found" }, res, 404);
    }

    // Handle grammar check if needed
    if (data.subType === "grammar") {
      return checkGrammer(data.text, user);
    }


    // Get brand voice if specified
    let brandVoice = [];
    if (data.metaDetails?.brandVoice) {
      brandVoice = await BrandVoiceService.getBrandVoiceById(
        data.metaDetails.brandVoice
      );
    }
    const summary = brandVoice[0]?.brandVoicesDetails?.summary || "";

    // Generate prompt
    const messageArrayData = commentCreatePrompt(data, summary);

    // Get active subscription
    const subscription = await SubscriptionService.findOne({
      userId: user._id,
      status: "active",
    });

    // Handle free tier users
    if (subscription?.gatewaySubscriptionId === "sub_basic") {
      return await handleBasicPlanComment(user, messageArrayData, data, res);
    }

    // Handle premium users
    return await handlePremiumComment(user, messageArrayData, data, res);
  } catch (error) {
    console.error("Comment generation error:", error);
    // errorHandler(error, res);
    errorHandler("An error occurred while generating the comment", res, 500);
    throw error;
  }
};

// Helper Functions

const handleBasicPlanComment = async (user, messageArrayData, data, res) => {
  const limitCheck = await CountService.incCount(user._id);
  if (limitCheck === "Daily limit reached") {
    return errorHandler("Daily limit reached", res, 429);
  }

  const response = await chatgptServices.chatGPT(
    messageArrayData.messageArray,
    process.env.CHAT_GPT_API_KEY
  );

  return saveAndReturnComment(
    user._id,
    messageArrayData.prompt,
    response,
    data,
    res
  );
};

const handlePremiumComment = async (user, messageArrayData, data, res) => {
  if (user.model && user.modelApiKey) {
    const key = decryptApiKey(user.modelApiKey);
    const response = await AI.multiModelService(
      user.model,
      key,
      messageArrayData.messageArray
    );
    return saveAndReturnComment(
      user._id,
      messageArrayData.prompt,
      response,
      data,
      res
    );
  }

  const limitCheck = await CountService.incCount(user._id);
  if (limitCheck === "Daily limit reached") {
    return errorHandler("Daily limit reached", res, 429);
  }

  const response = await chatgptServices.chatGPT(
    messageArrayData.messageArray,
    process.env.CHAT_GPT_API_KEY
  );

  return saveAndReturnComment(
    user._id,
    messageArrayData.prompt,
    response,
    data,
    res
  );
};

const saveAndReturnComment = async (userId, prompt, response, data, res) => {
  const commentData = {
    userId,
    prompt,
    comment: response,
    platform: data.platform,
    postLink: data.postLink,
    type: "comment",
  };

  const comment = await CommentService.create(commentData);
  return responseHandler(comment.comment, res);
};

export const credsLeft = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const count = await CountService.findOne({ userId: userId });
    if (!count) {
      return responseHandler(10, res, "", 201);
    }
    responseHandler(10 - count.count, res, "", 201);
  } catch (error) {
    console.log(error);
    errorHandler("Unable to fetch creds", res, 500);
  }
};

export const getCommentsData = async (req, res) => {
  try {
    const reqQuery = req.query;
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }

    let filter = {};

    if (user.role == "orgAdmin") {
      const { admins, members } = await UserService.orgCommentDetails(
        user.email
      );
      filter = {
        userId: { $in: [...admins, ...members] },
      };
    } else {
      filter.userId = userId;
    }

    // Pagination parameters
    if (reqQuery.platform) {
      filter.platform = reqQuery.platform;
    }
    const page = parseInt(reqQuery.pageno) || 1;
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await CommentService.findAll(filter);
    const paginatedComments = comments.slice(skip, skip + limit);

    const commentsData = paginatedComments.map((comment) => {
      const type = comment.type;
      return {
        comment: comment.comment,
        platform: comment.platform,
        postLink: comment.postLink,
        date: comment.createdAt,
        type: type,
      };
    });

    const response = {
      data: commentsData,
      pagination: {
        total: comments.length,
        page,
        totalPages: Math.ceil(comments.length / limit),
        hasMore: skip + limit < comments.length,
      },
    };

    responseHandler(response, res, "", 200);
  } catch (error) {
    console.log(error);
    errorHandler("Unable to fetch comments", res, 500);
  }
};

export const fixGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    const fixedText = await CommentService.fixGrammar(text);
    res.status(200).json({ data: fixedText });
  } catch (error) {
    console.error("Error fixing grammar:", error);
    res.status(500).json({ error: "Failed to fix grammar" });
  }
};