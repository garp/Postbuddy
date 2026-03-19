export const create = async (model, body) => {
  return await model.create(body);
};

export const findById = async (model, id) => {
  return await model.findById({ _id: id });
};

export const findByIdAndUpdate = async (model, id, data) => {
  return await model.findByIdAndUpdate({ _id: id }, data, { new: true });
};

export const findOne = async (model, filter) => {
  return await model.findOne(filter);
};

export const findAll = async (model, filter, sort = { createdAt: -1 }) => {
  return await model.find(filter).sort(sort);
};

export const findOneAndDelete = async (model, filter) => {
  return await model.findOneAndDelete(filter);
};

export const findOneAndUpsert = async (model, filter, data) => {
  return await model.findOneAndUpdate(filter, data, {
    upsert: true,
    new: true,
  });
};

export const findOneAndUpdate = async (model, filter, data) => {
  return await model.findOneAndUpdate(filter, data, { new: true });
};

export const aggregate = async (model, filter, sort = { createdAt: -1 }) => {
  return await model.aggregate(filter).sort(sort);
};

export const updateMany = async (model, filter, data) => {
  return await model.updateMany(filter, data);
};

export const deleteById = async (model, id) => {
  return await model.findByIdAndDelete(id);
};

export const deleteAll = async (model) => {
  return await model.deleteMany({});
};
