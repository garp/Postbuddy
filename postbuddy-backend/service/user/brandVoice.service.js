import { BrandVoiceModel } from "../../models/user/brandVoice.model.js";
import { UserModal } from "../../models/user/user.model.js";
import Dal from "../../dal/dalClass.js";
import * as chatgptServices from "../../utils/chatgpt.services.js";
import { brandVoiceSummaryPrompt } from "../../prompts/brandVoice.prompts.js";

class BrandVoiceService extends Dal {
  async create(body) {
    const user = await super.findById(UserModal, body.userId);
    if (!user) {
      throw new Error("User not found");
    }
    await super.findOneAndUpdate(
      BrandVoiceModel,
      { userId: user._id, status: "active" },
      { status: "inactive" }
    );
    return await super.create(BrandVoiceModel, body);
  }

  async getBrandVoiceById(id) {
    return await super.findById(BrandVoiceModel, id);
  }

  async generateSummary(data) {
    const key = process.env.CHAT_GPT_API_KEY;
    const messageArray = brandVoiceSummaryPrompt(data);
    const response = await chatgptServices.chatGPT(
      messageArray.messageArray,
      key
    );
    return response;
  }

  async findAll(filter) {
    return await super.findAll(BrandVoiceModel, filter);
  }
  async activateBrandVoice(id, userId) {
    // First, set all brand voices for this user to inactive
    // Check if this is actually updating records
    const updateResult = await super.updateMany(
      BrandVoiceModel,
      { userId: userId, status: "active" },
      { status: "inactive" }
    );
    console.log(
      `Updated ${updateResult.modifiedCount} brand voices to inactive`
    );

    // Then activate the selected brand voice
    return await super.findByIdAndUpdate(BrandVoiceModel, id, {
      status: "active",
    });
  }

  async findByIdAndUpdate(id, data) {
    return await super.findByIdAndUpdate(BrandVoiceModel, id, data);
  }

  async findByIdAndDelete(id) {
    return await super.findByIdAndDelete(BrandVoiceModel, id);
  }

  async findById(id) {
    return await super.findById(BrandVoiceModel, id);
  }
}

export default new BrandVoiceService();
