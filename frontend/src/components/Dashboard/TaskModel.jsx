import React, { useState } from 'react';
import '../../styles/TaskModel.css'; // or your actual CSS

const TaskModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Validate before sending
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Title and Description are required.");
      return;
    }

    // Send only required fields to backend
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    });

    onClose(); // Close modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Add New Task</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor='title'>Task Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor='description'>Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
            />
          </div>

          <div className="form-group">
            <label htmlFor='priority'>Priority</label>
            <select
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option> {/* ✅ Correct casing */}
              <option value="High">High</option>
            </select>
          </div>
         <div>
          <button type="submit" className="save-btn">
            Save Task
          </button>
          <button
            type="button"
            className="cancel-btn"
            // style={{ marginTop: "5px" }}
            onClick={onClose}
          >
            Cancel
          </button>
         </div>
     
        </form>
      </div>
    </div>
  );
};

export default TaskModal;



