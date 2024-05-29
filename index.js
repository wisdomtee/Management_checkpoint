import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    // Load tasks from local storage when the app initializes
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever there's a change in the task list
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!taskName || !taskDescription) {
      alert('Please fill in both task name and description.');
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
    setTaskDescription('');
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setTaskName(taskToEdit.name);
    setTaskDescription(taskToEdit.description);
    setEditingTaskId(taskId);
  };

  const handleSaveEdit = () => {
    if (!taskName || !taskDescription) {
      alert('Please fill in both task name and description.');
      return;
    }

    setTasks(tasks.map(task =>
      task.id === editingTaskId ? { ...task, name: taskName, description: taskDescription } : task
    ));
    setTaskName('');
    setTaskDescription('');
    setEditingTaskId(null);
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <textarea
          placeholder="Task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        {editingTaskId ? (
          <button onClick={handleSaveEdit}>Save Edit</button>
        ) : (
          <button onClick={handleAddTask}>Add Task</button>
        )}
      </div>
      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
            </div>
            <div>
              <button onClick={() => handleToggleComplete(task.id)}>
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => handleEditTask(task.id)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
