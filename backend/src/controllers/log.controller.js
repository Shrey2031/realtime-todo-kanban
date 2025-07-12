import Log from "../models/log.model.js";

export const getRecentLogs = async (req, res) => {
  try {
    const logs = await Log.find({ performedBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("performedBy", "name")
      .populate("task", "title");

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
