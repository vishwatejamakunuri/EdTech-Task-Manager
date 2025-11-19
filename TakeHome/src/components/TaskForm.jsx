import React, { useEffect, useState } from "react";

// initialTask = null  → create mode
// initialTask = task  → edit mode
function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState("not-started");

  // When initialTask changes, fill the form for edit mode
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || "");
      setDescription(initialTask.description || "");
      setProgress(initialTask.progress || "not-started");

      if (initialTask.dueDate) {
        // convert ISO -> yyyy-mm-dd for <input type="date">
        const d = new Date(initialTask.dueDate);
        const iso = d.toISOString().slice(0, 10);
        setDueDate(iso);
      } else {
        setDueDate("");
      }
    } else {
      // reset for create mode
      setTitle("");
      setDescription("");
      setDueDate("");
      setProgress("not-started");
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || null,
      progress,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      {/* <div className="field">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          rows={8}
        />
      </div> */}

      <div className="field-row">
        <div className="field">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          >
            <option value="not-started">Not started</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="actions">
        <button type="submit" className="btn">
          {initialTask ? "Update Task" : "Add Task"}
        </button>

        {initialTask && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
