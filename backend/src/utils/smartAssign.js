import Task from "../models/task.model.js";

export const getLeastLoadedUser = async () => {
  // Group by assignedUser where task is not done
  const activeTaskCounts = await Task.aggregate([
    { $match: { status: { $ne: "Done" }, assignedUser: { $ne: null } } },
    { $group: { _id: "$assignedUser", count: { $sum: 1 } } },
    { $sort: { count: 1 } }
  ]);

  if (activeTaskCounts.length === 0) return null;
  return activeTaskCounts[0]._id;
};
