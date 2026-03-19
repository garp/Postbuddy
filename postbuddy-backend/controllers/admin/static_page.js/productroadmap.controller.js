import * as Dal from '../../../dal/dal.js'
import { ProductRoadMap } from '../../../models/admin/static_page/productroadmap.models.js'
import * as UserService from '../../../service/user/user.service.js'
import { errorHandler, responseHandler } from '../../../utils/responseHandler.js'

export const createRoadMap = async (req, res) => {
    try {
        const body = req.body
        const { _id: userId } = req.user;
        const user = await UserService.findById(userId);
        if (user.role !== "admin") {
            return errorHandler("UNAUTHORIZED_REQUEST", res, 401)
        }
        const roadmap = await dal.create(ProductRoadMap, body)
        responseHandler(roadmap, res, "Roadmap Created Successfully", 200)
    } catch (error) {
        console.log("Error : ", error)
        errorHandler("ERROR_CREATING_ROADMAP",res)
    }
}

export const getAllRoadMap = async (req, res) => {
    try {
        const roadmap = await dal.findAll(ProductRoadMap)
        responseHandler(roadmap, res, "Roadmap Fetched Successfully", 200)
    } catch (error) {
        console.log("Error : ", error)
        errorHandler("ERROR_FETCHING_ROADMAP",res)
    }
}

export const upvoteRoadMap = async (req, res) => {
    try {
      const { _id: userId } = req.user;
      const user = await UserService.findById(userId);
  
      if (!user) {
        return responseHandler(null, res,"Login to upvote",404);
      }
      const { roadmapId } = req.params;
      const roadmap = await dal.findById(ProductRoadMap, roadmapId);
      if (!roadmap) {
        return errorHandler("ROADMAP_NOT_FOUND", res);
      }
      const hasUpvoted = roadmap.upvotes.includes(userId);
      if (hasUpvoted) {
        roadmap.upvotes = roadmap.upvotes.filter(id => id.toString() !== userId.toString());
      } else {
        roadmap.upvotes.push(userId);
      }
      await roadmap.save();
      const message = hasUpvoted ? "Upvote removed successfully" : "Roadmap upvoted successfully";
      responseHandler(null, res, message, 200);
    } catch (error) {
      console.log("Error : ", error);
      errorHandler("ERROR_UPVOTING_ROADMAP", res);
    }
  };
  