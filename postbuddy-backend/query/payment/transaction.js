import { ObjectId } from "mongodb";

class TransactionQuery {
  verifyTransactionQuery(gatewayPaymentId) {
    const query = [
      {
        $match: {
          gatewayPaymentId: gatewayPaymentId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "subscriptionId",
          foreignField: "_id",
          as: "SubscriptionDetails",
        },
      },
      {
        $unwind: {
          path: "$SubscriptionDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "SubscriptionDetails.planId",
          foreignField: "_id",
          as: "PlanDetails",
        },
      },
      {
        $unwind: {
          path: "$PlanDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    return query;
  }

  subscriptionTransactionQuery(gatewaySubscriptionId, userId) {
    const query = [
      {
        $match: {
          gatewaySubscriptionId: gatewaySubscriptionId,
          userId: new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "plans",
          localField: "planId",
          foreignField: "_id",
          as: "planDetails",
        },
      },
      {
        $unwind: {
          path: "$planDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];
    return query;
  }
}

export default new TransactionQuery();
