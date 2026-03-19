import * as UserService from '../../service/user/user.service.js'
import { responseHandler, errorHandler } from '../../utils/responseHandler.js';
import { decryptApiKey } from '../../utils/crypto.js';
import * as ApiKeyService from '../../service/user/apiKey.service.js'

export const addApiKey = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    if (!userId) {
      return responseHandler(null, res, 'Unauthorized request', 401);
    }

    const { apiKey, model } = req.body;
    if (!apiKey || !model) {
      return responseHandler(null, res, 'API key is required', 400);
    }

    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, 'User not found', 401);
    }
    const check = await ApiKeyService.checkApiKey(apiKey, model)
    if (check.status === 200) {
      await ApiKeyService.addApiKey(user, apiKey, model)
      return responseHandler(null, res, 'API key added successfully', 200);
    } else {
      return responseHandler(null, res, check.message, check.status);
    }
  } catch (error) {
    console.error(error.message);
    errorHandler('ERR_WHILE_SAVING_API_KEY_IN_DB', res);
  }
};

export const getApiKey = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    if (!userId) {
      return responseHandler(null, res, 'Unauthorized request', 401);
    }
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, 'User not found', 401);
    }

    if (!user || !user.modelApiKey || !user.model) {
      return responseHandler(null, res, 'No data to show', 201);
    }
    const decryptedKey = decryptApiKey(user.modelApiKey);
    responseHandler({ model: user.model, key: decryptedKey }, res, "Api Key fetched Successfully", 200)
  } catch (error) {
    console.log(error.message);
  }
}

export const removeApiKey = async (req, res) => {
  try {
    const { _id: id } = req.user;
    if (!id) {
      return responseHandler(null, res, 'Unauthorized request', 401);
    }
    const user = await UserService.findById(id);
    if (!user) {
      return responseHandler(null, res, 'User not found', 401);
    }

    user.modelApiKey = null;
    user.save();

    responseHandler(null, res, 'API key removed successfully', 200);
  } catch (error) {
    console.log(error)
    errorHandler('ERR_WHILE_REMOVING_API_KEY', res, 500);
  }
}