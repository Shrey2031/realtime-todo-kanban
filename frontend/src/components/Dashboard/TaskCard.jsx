import React from "react";

function TaskCard({ task, column, onDragStart, onDelete }) {
  return (
    <div
      key={task._id}
      className={`kanban-card ${column}`}
      draggable
      onDragStart={() => onDragStart(task, column)}
    >
      <div className="card-title">{task.title}</div>
      <div className="card-meta">
        <div className="card-assignee">
          <div className="assignee-avatar">{task.assignee?.charAt(0) || "?"}</div>
          <span>{task.assignee || "Unassigned"}</span>
        </div>
        <div className="card-due-date">{task.dueDate || "N/A"}</div>
      </div>
      <button
        className="delete-task-btn"
        onClick={() => onDelete(task._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;


