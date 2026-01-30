import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ListTodo, MessageCircle, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/devices', icon: Grid, label: 'Devices' },
        { path: '/tasks', icon: ListTodo, label: 'Tasks' },
        { path: '/ai-assistant', icon: MessageCircle, label: 'AI Assistant' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="sidebar glass">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">🏠</div>
                    <h2>SmartHub</h2>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile glass-card">
                    <div className="avatar">👤</div>
                    <div className="user-info">
                        <div className="user-name">Guest User</div>
                        <div className="user-status">Online</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
