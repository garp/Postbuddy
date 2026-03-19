import * as dal from '../../dal/dal.js'
import { BotModel } from '../../models/comment/bot.model.js';

export const aggregate = async (filter) => {
  return await dal.aggregate(BotModel, filter);
}