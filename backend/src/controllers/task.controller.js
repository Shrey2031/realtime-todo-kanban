import Task from "../models/task.model.js";
import Log from "../models/log.model.js";
import { getLeastLoadedUser } from "../utils/smartAssign.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { ApiError } from "../utils/apiError.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedUser");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Prevent column name conflict
    if (["Todo", "In Progress", "Done"].includes(title)) {
      return res.status(400).json(
        new ApiResponse(400, "Title cannot match column name")
      )

      // return res.status(400).json({ message: "Title cannot match column name" });
    }

    const existing = await Task.findOne({ title });
    if (existing) return res.status(400).json({ message: "Title must be unique" });

    const task = await Task.create({ title, description, priority });
    await Log.create({ actionType: "Add", task: task._id, performedBy: req.user.id });

    req.io.emit("taskUpdated", task); // broadcast real-time update
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const oldTask = await Task.findById(id);
    if (!oldTask){
      throw new ApiError(404, "Task not found");
    } 

    // Conflict detection
    if (update.lastUpdated && new Date(update.lastUpdated) < oldTask.updatedAt) {
      return res.
      status(409)
      .json(new ApiResponse(409, "Data has been updated by another user",existing=oldTask));

      

    }

    update.lastUpdated = new Date();
    const task = await Task.findByIdAndUpdate(id, update, { new: true });

    await Log.create({ actionType: "Edit", task: task._id, performedBy: req.user.id });
    req.io.emit("taskUpdated", task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task){
      throw new ApiError(404, "Task not found");
    } 

    await Log.create({ actionType: "Delete", task: id, performedBy: req.user.id });
    req.io.emit("taskDeleted", { id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const smartAssign = async (req, res) => {
  try {
    const { taskId } = req.params;
    const bestUserId = await getLeastLoadedUser();
    if (!bestUserId){
      throw new ApiError(400, "No users to assign");
    }
      //  return res.status(400).json({ message: "No users to assign" });

    const task = await Task.findByIdAndUpdate(taskId, { assignedUser: bestUserId }, { new: true });

    await Log.create({
      actionType: "Assign",
      task: task._id,
      performedBy: req.user.id,
      details: `Smart assigned to user ${bestUserId}`
    });

    req.io.emit("taskUpdated", task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
