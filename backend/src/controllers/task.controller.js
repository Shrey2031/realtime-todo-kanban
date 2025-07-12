import Task from "../models/task.model.js";
import Log from "../models/log.model.js";
import { getLeastLoadedUser } from "../utils/smartAssign.js";
import { ApiResponse } from "../utils/apiResponce.js";
import { ApiError } from "../utils/apiError.js";

// export const getTasks = async (req, res) => {
//   const tasks = await Task.find().populate("assignedUser");
//   res.json(tasks);
// };

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ assignedUser: req.user._id }).populate("assignedUser", "name");
  res.json(tasks);
};



//   try {
//     const { title, description, priority } = req.body;
//     if (!title || !description || !priority) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Prevent column name conflict
//     if (["Todo", "In Progress", "Done"].includes(title)) {
//       return res.status(400).json(
//         new ApiResponse(400, "Title cannot match column name")
//       )

//       // return res.status(400).json({ message: "Title cannot match column name" });
//     }

//     const existing = await Task.findOne({ title });
//     if (existing) return res.status(400).json({ message: "Title must be unique" });

//     const task = await Task.create({ title, description, priority,
//        user: req.user._id 
//      });
//      console.log("✅ Task created:", task.title);
//     await Log.create({ actionType: "Add", task: task._id, performedBy: req.user.id });
//     if (!req.user || !req.user._id) {
//     return res.status(401).json({ message: "Unauthorized user" });
// }


//     req.io.emit("taskUpdated", task); // broadcast real-time update
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
   

// };

export const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (["Todo", "In Progress", "Done"].includes(title)) {
      return res.status(400).json({ message: "Title cannot match column name" });
    }

    const existing = await Task.findOne({ title });
    if (existing) {
      return res.status(400).json({ message: "Title must be unique" });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      assignedUser: req.user._id
    });

    console.log("✅ Task created:", task.title);
   
    
   let log =  await Log.create({
      actionType: "Add",
      task: task._id,
      performedBy: req.user._id,
      details: `Task "${task.title}" created`
    });

    log = await log.populate("performedBy", "name").populate("task", "title");

// ✅ Broadcast to all clients
    req.io.emit("logAdded", log);

    // req.io.emit("taskUpdated", task); // broadcast real-time update
    const populatedTask = await task.populate("assignedUser", "name");
    req.io.emit("taskUpdated", populatedTask);
    res.status(201).json(populatedTask);


  } catch (err) {
    console.error("🔥 Error creating task:", err.message);
    res.status(500).json({ message: err.message });
  }
}


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
    // req.io.emit("taskUpdated", task);
    const updated = await Task.findById(id).populate("assignedUser", "name");
    req.io.emit("taskUpdated", updated);
    res.json(updated);

    // res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const deleteTask = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const task = await Task.findByIdAndDelete(id);
//     if (!task){
//       throw new ApiError(404, "Task not found");
//     } 

//     const taskTitle = task.title;

//    let log = await Log.create({ actionType: "Delete",
//        task: id,
//         performedBy: req.user.id ,
//        details: `Delete task "${taskTitle}"`
//       });

//     log = await log.populate("performedBy", "name").populate("task", "title");

//     req.io.emit("logAdded", log);

    
//     res.json({ message: "Task deleted" });
//   } catch (err) {
//      console.error("🔥 Delete task failed:", err.message);
//     res.status(500).json({ message: err.message });
//   }
// };

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const taskTitle = task.title;

    await task.deleteOne();

    const newLog = await Log.create({
      actionType: "Delete",
      task: task._id,
      performedBy: req.user._id,
      details: `Delete task "${taskTitle}"`
    });

      newLog = await Log.populate("performedBy", "name").populate("task", "title");

    req.io.emit("logAdded", newLog);
    req.io.emit("taskDeleted", task._id); // 👈 required for real-time deletion


    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("🔥 Delete task failed:", err.message);
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

    const task = await Task.findByIdAndUpdate(taskId, { assignedUser: bestUserId }, { new: true }).populate("assignedUser", "name");

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
