import { errorHandler, responseHandler } from "../../utils/responseHandler.js";
import organizationService from "../../service/user/organization.service.js";
import * as CommentService from "../../service/comments/comment.service.js";
import * as BotService from "../../service/comments/bot.service.js";
import * as UserService from "../../service/user/user.service.js";
import { ObjectId } from "mongodb";
import moment from "moment-timezone";
import * as GraphQuery from "../../query/graph.query.js";

const getDateRange = (offset = 0) => {
  const endDate = moment()
    .tz("Asia/Kolkata")
    .subtract(offset * 7, "days")
    .endOf("day");
  const startDate = moment(endDate).subtract(6, "days").startOf("day");
  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  };
};

const formatDate = (date) => {
  return moment(date).tz("Asia/Kolkata").format("DD/MM/YY");
};

export const graphData = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    const reqQuery = req.query;
    const offset = parseInt(reqQuery.offset) || 0;

    const filter = {};
    if (reqQuery.platform) {
      filter.platform = reqQuery.platform;
    }

    const { startDate, endDate } = getDateRange(offset);

    // Query for comment data
    const commentQuery = [
      {
        $match: {
          userId: new ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: { date: "$createdAt", timezone: "Asia/Kolkata" },
            },
            month: { $month: { date: "$createdAt", timezone: "Asia/Kolkata" } },
            year: { $year: { date: "$createdAt", timezone: "Asia/Kolkata" } },
          },
          totalUsage: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ];

    // Query for bot data
    const botQuery = [
      {
        $match: {
          userId: new ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dayOfMonth: { date: "$createdAt", timezone: "Asia/Kolkata" },
            },
            month: { $month: { date: "$createdAt", timezone: "Asia/Kolkata" } },
            year: { $year: { date: "$createdAt", timezone: "Asia/Kolkata" } },
          },
          totalBot: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ];

    console.log("Comment Query ==> ", JSON.stringify(commentQuery));
    console.log("Bot Query ==> ", JSON.stringify(botQuery));

    // Execute both queries
    const usageData = await CommentService.aggregate(commentQuery);
    const botData = await BotService.aggregate(botQuery);

    const mappedData = [];

    // Loop through the last 7 days and map the data
    for (let i = 6; i >= 0; i--) {
      const currentDate = moment(endDate).subtract(i, "days");

      // Find data for the current date using IST date parts
      const dataForCurrentDate = usageData.find(
        (item) =>
          item._id.day === currentDate.date() &&
          item._id.month === currentDate.month() + 1 &&
          item._id.year === currentDate.year()
      );

      // Find data for bot for the current date
      const dataForCurrentBotDate = botData.find(
        (item) =>
          item._id.day === currentDate.date() &&
          item._id.month === currentDate.month() + 1 &&
          item._id.year === currentDate.year()
      );

      mappedData.push({
        // Format date as dd/mm (only day and month)
        date: formatDate(currentDate).split("/").slice(0, 2).join("/"),
        count: dataForCurrentDate ? dataForCurrentDate.totalUsage : 0,
        bot: dataForCurrentBotDate ? dataForCurrentBotDate.totalBot : 0,
      });
    }

    responseHandler(
      { data: mappedData },
      res,
      "Graph data fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching usage data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const totalCommentGraph = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserService.findById(userId);
    let org;
    if (user.role === "orgAdmin") {
      org = await organizationService.findOne({
        organizationId: user.organizationId,
      });
      console.log("Org : ", org);
    }
    if (!user) {
      return responseHandler(null, res, "User not found", 401);
    }
    const reqQuery = req.query;
    const filter = {};
    if (reqQuery.userId) {
      filter.userId = new ObjectId(reqQuery.userId);
    } else {
      filter.userId = new ObjectId(userId);
    }
    if (reqQuery.startDate) {
      filter.createdAt = { $gte: new Date(reqQuery.startDate) };
    }
    if (reqQuery.endDate) {
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $lte: new Date(reqQuery.endDate),
      };
    }
    if (reqQuery.platform) {
      filter.platform = reqQuery.platform;
    }
    if (user.role === "orgAdmin" && !reqQuery.userId) {
      const memberIds = [];

      if (org && org.members && org.members.length > 0) {
        org.members.forEach((member) => {
          if (member._id) {
            memberIds.push(new ObjectId(member._id));
          }
        });
      }
      if (org && org.admin_id) {
        memberIds.push(new ObjectId(org.admin_id));
      }
      memberIds.push(new ObjectId(userId));
      if (memberIds.length > 0) {
        filter.userId = { $in: memberIds };
      }
    }

    // Execute the query to get platform-wise counts
    const query = GraphQuery.totalCommentGraph(filter);
    console.log("Query : ", JSON.stringify(query));
    const platformData = await CommentService.aggregate(query);

    // All supported platforms
    const allPlatforms = [
      "linkedin",
      "youtube",
      "instagram",
      "x",
      "facebook",
      "whatsapp",
    ];

    // Format data by date
    const dateGroupedData = {};

    // Group data by date
    platformData.forEach((item) => {
      const { date, platform, total_count } = item;

      if (!dateGroupedData[date]) {
        dateGroupedData[date] = {};

        // Initialize all platforms with 0 for this date
        allPlatforms.forEach((p) => {
          dateGroupedData[date][p] = 0;
        });
      }

      // Set actual value if platform exists
      if (platform) {
        dateGroupedData[date][platform] = total_count;
      }
    });

    // Calculate total count across all platforms and dates
    const totalCount = platformData.reduce(
      (sum, item) => sum + item.total_count,
      0
    );

    console.log("Data : ", JSON.stringify(dateGroupedData));
    responseHandler(
      {
        dateData: dateGroupedData,
        totalCount,
      },
      res,
      "Platform-wise comment counts by date fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching total comment graph:", error);
    errorHandler(error.message, res, 500);
  }
};
