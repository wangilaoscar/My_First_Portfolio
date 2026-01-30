import { useState } from 'react';
import { Bell, Lock, Eye, Palette, Trash2, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import './Settings.css';

const Settings = () => {
    const { wallpaper, setWallpaper } = useApp();
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState(true);
    const [voiceControl, setVoiceControl] = useState(true);

    const wallpapers = [
        { id: 'default', label: 'Deep Blue', color: '#1a1a2e' },
        { id: 'sunset', label: 'Sunset Glow', color: '#f5576c' },
        { id: 'ocean', label: 'Ocean Blue', color: '#4facfe' },
        { id: 'forest', label: 'Forest Green', color: '#134e5e' },
        { id: 'midnight', label: 'Midnight', color: '#0f0c29' },
    ];

    return (
        <div className="settings-page">
            <Header
                title="Settings"
                subtitle="Customize your SmartHub experience"
            />

            <div className="settings-grid">
                <section className="settings-section glass-card">
                    <div className="section-header">
                        <Palette size={20} />
                        <h3>Appearance</h3>
                    </div>
                    <div className="settings-item">
                        <div className="item-info">
                            <span className="item-title">Wallpaper</span>
                            <p className="item-description">Choose your application background</p>
                        </div>
                        <div className="wallpaper-options">
                            {wallpapers.map((wp) => (
                                <button
                                    key={wp.id}
                                    className={`wallpaper-btn ${wallpaper === wp.id ? 'active' : ''}`}
                                    style={{ backgroundColor: wp.color }}
                                    title={wp.label}
                                    onClick={() => setWallpaper(wp.id)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="settings-section glass-card">
                    <div className="section-header">
                        <Bell size={20} />
                        <h3>Notifications</h3>
                    </div>
                    <div className="settings-item">
                        <div className="item-info">
                            <span className="item-title">Push Notifications</span>
                            <p className="item-description">Receive alerts for device status updates</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </section>

                <section className="settings-section glass-card">
                    <div className="section-header">
                        <Eye size={20} />
                        <h3>AI Assistant</h3>
                    </div>
                    <div className="settings-item">
                        <div className="item-info">
                            <span className="item-title">Voice Responses</span>
                            <p className="item-description">AI speaks its thoughts out loud</p>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={voiceControl}
                                onChange={(e) => setVoiceControl(e.target.checked)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </section>

                <section className="settings-section glass-card">
                    <div className="section-header">
                        <Lock size={20} />
                        <h3>Account</h3>
                    </div>
                    <div className="settings-item">
                        <div className="item-info">
                            <span className="item-title">User</span>
                            <p className="item-description">{user?.email}</p>
                        </div>
                        <button className="btn btn-secondary text-error" onClick={logout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
