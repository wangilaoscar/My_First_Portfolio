import { useState } from 'react';
import { X, Plus, Trash2, Check, Clock, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './TaskList.css';

const TaskList = () => {
    const { tasks, addTask, removeTask, toggleTask } = useApp();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        time: '',
        reminder: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newTask.title) {
            addTask(newTask);
            setNewTask({ title: '', time: '', reminder: false });
            setShowAddForm(false);
        }
    };

    const formatTime = (time) => {
        if (!time) return '';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <div>
                    <h3>Tasks & Reminders</h3>
                    <p>{tasks.filter(t => !t.completed).length} pending tasks</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <Plus size={18} />
                    Add Task
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="add-task-form glass-card">
                    <input
                        type="text"
                        className="input"
                        placeholder="Task description..."
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        autoFocus
                    />
                    <div className="task-options">
                        <div className="time-input-group">
                            <Clock size={16} />
                            <input
                                type="time"
                                className="input time-input"
                                value={newTask.time}
                                onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                            />
                        </div>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={newTask.reminder}
                                onChange={(e) => setNewTask({ ...newTask, reminder: e.target.checked })}
                            />
                            <Bell size={16} />
                            Set Reminder
                        </label>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add
                        </button>
                    </div>
                </form>
            )}

            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <p>No tasks yet. Add your first task!</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={`task-item glass-card ${task.completed ? 'completed' : ''}`}
                        >
                            <button
                                className="task-checkbox"
                                onClick={() => toggleTask(task.id)}
                            >
                                {task.completed && <Check size={16} />}
                            </button>
                            <div className="task-content">
                                <span className="task-title">{task.title}</span>
                                {task.time && (
                                    <div className="task-meta">
                                        <Clock size={14} />
                                        <span>{formatTime(task.time)}</span>
                                        {task.reminder && <Bell size={14} className="reminder-icon" />}
                                    </div>
                                )}
                            </div>
                            <button
                                className="btn-icon btn-secondary"
                                onClick={() => removeTask(task.id)}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
