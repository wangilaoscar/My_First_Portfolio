import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import TaskList from '../components/dashboard/TaskList';
import './Tasks.css';

const Tasks = () => {
    return (
        <div className="tasks-page">
            <Header
                title="Tasks & Reminders"
                subtitle="Manage your to-do list and set automated reminders"
            />

            <div className="tasks-container">
                <TaskList />
            </div>
        </div>
    );
};

export default Tasks;
