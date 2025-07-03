import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  actionType: {
    type: String,
    enum: ["Add", "Edit", "Delete", "Assign", "Move"],
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task"
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  details: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

export default mongoose.model("Log", logSchema);
