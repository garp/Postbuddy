export const totalCommentGraph = (filter) => {
  const query = [
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: {
          platform: "$platform",
          date: {
            $dateToString: {
              format: "%d/%m/%Y",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
        },
        total_count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        platform: "$_id.platform",
        date: "$_id.date",
        total_count: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ];

  return query;
};

export const orgCommentGraph = (filter) => {
  const query = [
    {
      $match: {
        ...filter,
      },
    },
  ];

  return query;
};
