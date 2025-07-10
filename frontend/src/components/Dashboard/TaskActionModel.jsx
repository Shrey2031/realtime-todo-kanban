import React from 'react';
import '../../styles/TaskModel.css'; // reuse existing modal styles

const TaskActionModal = ({ task, onClose, onStatusChange, onDelete }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">Task: {task.title}</h3>
        <p>Status: {task.status}</p>

        {task.status !== "Todo" && (
          <button
            className="btn btn-block"
            onClick={() => onStatusChange(task._id, "Todo")}
          >
            Move to To Do
          </button>
        )}
        {task.status !== "In Progress" && (
          <button
            className="btn btn-block"
            onClick={() => onStatusChange(task._id, "In Progress")}
          >
            Move to In Progress
          </button>
        )}
        {task.status !== "Done" && (
          <button
            className="btn btn-block"
            onClick={() => onStatusChange(task._id, "Done")}
          >
            Move to Done
          </button>
        )}

        <hr />
        <button className="btn btn-danger btn-block" onClick={() => onDelete(task._id)}>
          Delete Task
        </button>
        <button className="btn btn-secondary btn-block" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TaskActionModal;

