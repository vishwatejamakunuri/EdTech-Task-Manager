import React, { useCallback, useEffect, useState } from "react";
import TaskForm from "./TaskForm.jsx";
import TaskList from "./TaskList.jsx";

const API_URL = "http://localhost:5000";

function Dashboard({ user, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = create mode

  // -------------------------------
  // Load all tasks (READ)
  // -------------------------------
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to load tasks");
        setLoading(false);
        return;
      }

      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setMessage("Error loading tasks");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // -------------------------------
  // CREATE
  // -------------------------------
  const handleCreateTask = async (formData) => {
    setMessage("Creating task...");

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to create task");
        return;
      }

      // Add new task to state
      setTasks((prev) => [data.task, ...prev]);
      setMessage("Task created ✅");
    } catch (err) {
      console.error(err);
      setMessage("Error creating task");
    }
  };

  // -------------------------------
  // ENTER EDIT MODE
  // -------------------------------
  const handleStartEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------
  // UPDATE
  // -------------------------------
  const handleUpdateTask = async (formData) => {
    if (!editingTask) return;

    setMessage("Updating task...");

    try {
      const res = await fetch(`${API_URL}/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to update task");
        return;
      }

      // Replace updated task in state
      setTasks((prev) =>
        prev.map((t) => (t._id === data.task._id ? data.task : t))
      );

      setEditingTask(null);
      setMessage("Task updated ✅");
    } catch (err) {
      console.error(err);
      setMessage("Error updating task");
    }
  };

  // -------------------------------
  // DELETE
  // -------------------------------
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Failed to delete task");
        return;
      }

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      setMessage("Task deleted 🗑️");
    } catch (err) {
      console.error(err);
      setMessage("Error deleting task");
    }
  };

  // -------------------------------
  // Choose handler based on mode
  // -------------------------------
  const handleSubmitTask = (formData) => {
    if (editingTask) {
      handleUpdateTask(formData);
    } else {
      handleCreateTask(formData);
    }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h2>EdTech Task Manager</h2>
          {user && (
            <p className="user-info">
              Logged in as <b>{user.email}</b> ({user.role})
            </p>
          )}
        </div>

        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="card">
        <h3>{editingTask ? "Edit Task" : "Create Task"}</h3>

        <TaskForm
          initialTask={editingTask}
          onSubmit={handleSubmitTask}
          onCancel={() => setEditingTask(null)}
        />
      </section>

      <section className="card">
        <div className="tasks-header">
          <h3>Your Tasks</h3>
          <button className="btn btn-small" onClick={loadTasks}>
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleStartEdit}
            onDelete={handleDeleteTask}
          />
        )}
      </section>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Dashboard;
