class Dal {
  async create(model, body) {
    return await model.create(body);
  }

  async findById(model, id) {
    return await model.findById({ _id: id });
  }

  async findByIdAndUpdate(model, id, data) {
    return await model.findByIdAndUpdate({ _id: id }, data, { new: true });
  }

  async findOne(model, filter) {
    return await model.findOne(filter);
  }

  async findAll(model, filter, sort = { createdAt: -1 }) {
    return await model.find(filter).sort(sort);
  }

  async findOneAndDelete(model, filter) {
    return await model.findOneAndDelete(filter);
  }

  async findByIdAndDelete(model, id) {
    return await model.findByIdAndDelete({ _id: id });
  }

  async findOneAndUpsert(model, filter, data) {
    return await model.findOneAndUpdate(filter, data, {
      upsert: true,
      new: true,
    });
  }

  async findOneAndUpdate(model, filter, data) {
    return await model.findOneAndUpdate(filter, data, { new: true });
  }

  async aggregate(model, filter) {
    return await model.aggregate(filter);
  }

  async updateMany(model, filter, data) {
    return await model.updateMany(filter, data);
  }

  async deleteAll(model) {
    return await model.deleteMany({});
  }
}

export default Dal;
