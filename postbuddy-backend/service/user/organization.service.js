import { OrganizationModal } from "../../models/user/organization.model.js";
import Dal from '../../dal/dalClass.js'

class OrganizationService extends Dal {
  async create(body) {
    return await super.create(OrganizationModal, body);
  }

  async findAll(filter, sort) {
    return await super.findAll(OrganizationModal, filter, sort);
  }

  async findById(id) {
    return await super.findById(OrganizationModal, id);
  }

  async findOne(filter) {
    return await super.findOne(OrganizationModal, filter);
  }

  async update(filter, body) {
    return await super.findOneAndUpdate(OrganizationModal, filter, body);
  }

  async remove(filter) {
    return await super.findOneAndDelete(OrganizationModal, filter);
  }

  async aggregate(filter) {
    return await super.aggregate(OrganizationModal, filter);
  }
}

export default new OrganizationService();
