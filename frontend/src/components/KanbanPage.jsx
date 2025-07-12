import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTasks, createTask, updateTask, deleteTask } from "../Api/tasks";
import { fetchLogs } from "../Api/logs";
import socket from "../socket";
import Header from "../components/Dashboard/Header";
import KanbanColumn from "../components/Dashboard/KanbanColumn";
import ActivityLog from "../components/Dashboard/ActivityLog";
import TaskModal from "../components/Dashboard/TaskModel";
import TaskActionModal from "./Dashboard/TaskActionModel";
import "../styles/kanban.css";

console.log("✅ VITE_API_URL:", import.meta.env.VITE_API_URL);

const KanbanDashboard = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user"));
  const statusColors = {
    todo: { badge: 'badge-todo' },
    inProgress: { badge: 'badge-progress' },
    done: { badge: 'badge-done' }
  };

  const statusMap = { "Todo": "todo", "In Progress": "inProgress", "Done": "done" };
  const reverseStatusMap = { todo: "Todo", inProgress: "In Progress", done: "Done" };

  const loadTasks = async () => {
    const res = await fetchTasks();
    const organized = { todo: [], inProgress: [], done: [] };
    res.data.forEach(task => {
      const key = statusMap[task.status] || "todo";
      organized[key].push(task);
    });
    setTasks(organized);
  };

  const loadLogs = async () => {
    const res = await fetchLogs();
    const formatted = res.data.map(log => ({
      id: log._id,
      action: log.details || `${log.actionType} task "${log.task?.title}"`,
      status: statusMap[log.task?.status] || "todo",
      user: log.performedBy?.name || "Someone",
      time: new Date(log.createdAt).toLocaleTimeString()
    }));
    setActivities(formatted);
  };

  useEffect(() => {
    loadTasks();
    loadLogs();
    socket.on("logAdded", (log) => {
        const activity = {
        id: log._id,
        action: log.details || `${log.actionType} task "${log.task?.title}"`,
        status: statusMap[log.task?.status] || "todo",
        user: log.performedBy?.name || "Someone",
        time: "Just now"
      };
      setActivities(prev => [activity, ...prev.slice(0, 19)]);
    });
        // 🟢 Task Created or Updated
   
  socket.on("taskUpdated", (task) => {
    const colKey = statusMap[task.status] || "todo";
    setTasks(prev => {
      const updatedCol = [...prev[colKey].filter(t => t._id !== task._id), task];
      return {
        ...prev,
        [colKey]: updatedCol
      };
    });
  });

  // 🔴 Task Deleted
  //   socket.on("taskDeleted", (taskId) => {
  //   setTasks(prev => {
  //     const updated = { ...prev };
  //     Object.keys(updated).forEach(key => {
  //       updated[key] = updated[key].filter(t => t._id !== taskId);
  //     });
  //     return updated;
  //   });
  // });

 socket.on("taskDeleted", (taskId) => {
    setTasks(prev => {
      const newTasks = {};
      for (const col in prev) {
        newTasks[col] = prev[col].filter(t => t._id !== taskId);
      }
      return newTasks;
    });
  });
    return () => {socket.off("logAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");

    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleAddTask = async (taskData) => {
    // await createTask({ ...taskData, status: reverseStatusMap[taskData.status] });
    // setIsModalOpen(false);
   try {
     const res = await createTask({ ...taskData, status: reverseStatusMap[taskData.status] });
     const createdTask = res.data;
 
    setTasks((prevTasks) => {
    const key = statusMap[createdTask.status] || "todo";
    return {
     ...prevTasks,
     [key]: [...prevTasks[key], createdTask],
    };
    });
 
   setIsModalOpen(false);
   } catch (error) {
     console.error("Failed to add task:", err);
   }

    // await loadTasks();
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    await loadTasks();
  };

  const handleDragStart = (task, column) => {
    setDraggedTask({ task, column });
  };

  const handleDrop = async (e, newCol) => {
    e.preventDefault();
    if (!draggedTask) return;
    const { task, column } = draggedTask;
    if (column === newCol) return;
    await updateTask(task._id, { status: reverseStatusMap[newCol] });
    await loadTasks();
    setDraggedTask(null);
  };

  return (
    <div className="container">
      <Header user={ 'john doe'} onLogout={handleLogout} />

      <div className="kanban-container">
        {Object.entries(tasks).map(([col, colTasks]) => (
          <KanbanColumn
            key={col}
            title={col.replace(/([A-Z])/g, ' $1')}
            columnKey={col}
            tasks={colTasks}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDelete={handleDelete}
            onAddClick={() => setIsModalOpen(true)}
            onTaskClick={(task) => setSelectedTask(task)}
          />
        ))}
      </div>

      <ActivityLog activities={activities} statusColors={statusColors} />

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
        />
      )}

      {selectedTask && (
     <TaskActionModal
    task={selectedTask}
    onClose={() => setSelectedTask(null)}
    onStatusChange={async (taskId, newStatus) => {
      await updateTask(taskId, { status: newStatus });
      await loadTasks();
      setSelectedTask(null);
    }}
    onDelete={async (taskId) => {
      await deleteTask(taskId);
      await loadTasks();
      setSelectedTask(null);
    }}
  />
   )}

    </div>
  );
};

export default KanbanDashboard;


