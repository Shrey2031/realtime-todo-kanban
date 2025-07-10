import React from "react";

const teamMembers = ['JD', 'AM', 'SB', 'TK', 'RM'];

function AddTaskForm({ newTask, setNewTask, onCancel, onSubmit }) {
  return (
    <div className="add-task-form">
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          className="form-control"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>Assignee</label>
        <select
          className="form-control"
          value={newTask.assignee}
          onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
        >
          {teamMembers.map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Status</label>
        <select
          className="form-control"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button className="btn btn-primary btn-block" onClick={onSubmit}>
        Add Task
      </button>
      <button className="btn btn-block" style={{ marginTop: "5px" }} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AddTaskForm;
