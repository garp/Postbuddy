export const subscriptionQuery = (filter) => {
  const query = [
    {
      $match: {
        ...filter,
      }
    },
    {
      $lookup: {
        from: "plans",
        localField: "planId",
        foreignField: "_id",
        as: "planDetails"
      }
    }
  ]
  return query;
};

export const activeSubscription = (filter) => {
  const query = [
    {
      $match:
      {
        ...filter,
      }
    },
    {
      $lookup: {
        from: "transactions",
        localField: "_id",
        foreignField: "subscriptionId",
        pipeline: [
          {
            $project: {
              subscriptionActivation: 1
            }
          }
        ],
        as: "transactions"
      }
    },
    {
      $unwind: {
        path: "$transactions",
        preserveNullAndEmptyArrays: true
      }
    }
  ]
  return query;
}