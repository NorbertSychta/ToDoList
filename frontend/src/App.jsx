import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TaskItem from './components/TaskItem'
import './App.css'

const API_URL = '/api/tasks'; // Using proxy

function App() {
  const [tasks, setTasks] = useState([])
  const [editingTask, setEditingTask] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        // Update
        const response = await fetch(`${API_URL}/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...taskData, completed: editingTask.completed })
        });
        if (response.ok) {
          setEditingTask(null);
          fetchTasks();
        }
      } else {
        // Create
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (response.ok) {
          fetchTasks();
        }
      }
    } catch (error) {
      console.error("Error saving task", error);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  }

  const handleToggle = async (id, completed) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // We need to send the full object for PUT usually, but let's see backend.
      // Backend expects title, description, completed.
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: completed
        })
      });
      // Optimistic update or refetch
      setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
    } catch (error) {
      console.error("Error toggling task", error);
      fetchTasks(); // Revert on error
    }
  }

  const startEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✨ DevOps ToDo</h1>
        <p>Premium Task Management</p>
      </header>

      <main className="app-content">
        <section className="form-section">
          <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
          <TodoForm
            key={editingTask ? editingTask.id : 'new'}
            onSubmit={handleCreateOrUpdate}
            initialData={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </section>

        <section className="list-section">
          <div className="list-header">
            <h2>Your Tasks</h2>
            <span className="badge">{tasks.length}</span>
          </div>

          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-state">No tasks yet. Add one above! 🚀</p>
              ) : (
                tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onEdit={startEdit}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
