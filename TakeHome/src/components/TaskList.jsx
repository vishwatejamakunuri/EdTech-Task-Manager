import React from "react";

function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <p>No tasks yet. Create one above!</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task._id} className="task-item">
          <div className="task-main">
            <h4>{task.title}</h4>

            {task.dueDate && (
              <span className="task-date">
                Due:{" "}
                {new Date(task.dueDate).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            {task.description && (
              <p className="task-desc">{task.description}</p>
            )}
          </div>

          <div className="task-meta">
            <span className={`badge badge-${task.progress}`}>
              {task.progress.replace("-", " ")}
            </span>

            <div className="task-buttons">
              <button
                className="btn btn-small"
                onClick={() => onEdit(task)}
              >
                Edit
              </button>

              <button
                className="btn btn-small btn-danger"
                onClick={() => onDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
