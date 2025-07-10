import React from "react";

const KanbanColumn = ({
  title,
  tasks,
  columnKey,
  onDragOver,
  onDrop,
  onDragStart,
  onDelete,
  onAddClick,
  onTaskClick
}) => (
  <div
    className="kanban-column"
    onDragOver={(e) => e.preventDefault()}
    onDrop={(e) => onDrop(e, columnKey)}
  >
    <div className="column-header">
      <div className="column-title">{title}</div>
      <div className="column-count">{tasks.length}</div>
    </div>

    <div className="kanban-cards">
      {tasks.map(task => (
        <div
          key={task._id}
          className="kanban-card"
          draggable
          onClick={() => onTaskClick(task)}
          onDragStart={() => onDragStart(task, columnKey)}
        >
          <div className="card-title">{task.title}</div>
          <div className="card-meta">
            <div className="card-assignee">
              <div className="assignee-avatar">{task.assignedUser?.name?.charAt(0) || "?"}</div>
              <span>{task.assignedUser?.name || "Unassigned"}</span>
            </div>
          </div>
          <button className="btn btn-delete" onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      ))}
    </div>

    {columnKey === "todo" && (
      <button className="btn btn-primary btn-block" onClick={onAddClick}>+ Add Task</button>
    )}
  </div>
);

export default KanbanColumn;


