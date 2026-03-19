import * as dal from '../../dal/dal.js'
import { PlansModel } from '../../models/payment/plan.model.js'

export const create = async (body) => {
  return await dal.create(PlansModel, body)
}

export const searchAll = async (filter, sort) => {
  return await dal.findAll(PlansModel, filter, sort)
}

export const findById = async (filter) => {
  return await dal.findById(PlansModel, filter)
}

export const findOne = async (filter) => {
  return await dal.findOne(PlansModel, filter);
}

export const findOneAndUpdate = async (filter, body) => {
  return await dal.findOneAndUpdate(PlansModel, filter, body);
}

export const remove = async (filter) => {
  return await dal.findOneAndDelete(filter)
}