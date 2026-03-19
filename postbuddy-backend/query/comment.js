export const commentPlan = (filter) => {
  const query = [
    {
      $match: {
        ...filter,
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "userId",
        foreignField: "userId",
        pipeline: [
          {
            $project: {
              razorpay_subscription_id: 1,
              status: 1
            }
          }
        ],
        as: "plan"
      }
    },
    {
      $unwind: {
        path: "$plan",
        preserveNullAndEmptyArrays: true
      }
    }
  ];

  return query;
};


export const commentOnDay = (filter) => {
  const query = [

  ]
  return query;
}

export const commentsData = (filter) => {
  const query = [
  ]

  return query;
}
