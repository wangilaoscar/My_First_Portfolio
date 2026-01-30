import { useState, useEffect } from 'react';
import { Plus, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import DeviceCard from '../components/devices/DeviceCard';
import DeviceControlPanel from '../components/devices/DeviceControlPanel';
import AddDeviceModal from '../components/devices/AddDeviceModal';
import TaskList from '../components/dashboard/TaskList';
import './Dashboard.css';

const Dashboard = () => {
    const { devices, welcomeHome } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        welcomeHome();
    }, []);

    const activeDevices = devices.filter(d => d.state.power).length;

    return (
        <div className="dashboard-page">
            <Header
                title="Dashboard"
                subtitle="Welcome home! Manage your smart devices"
            >
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Device
                </button>
            </Header>

            <div className="dashboard-stats">
                <div className="stat-card glass-card">
                    <div className="stat-icon">🏠</div>
                    <div className="stat-content">
                        <div className="stat-value">{devices.length}</div>
                        <div className="stat-label">Total Devices</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon">
                        <Zap size={24} />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{activeDevices}</div>
                        <div className="stat-label">Active Now</div>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon">📡</div>
                    <div className="stat-content">
                        <div className="stat-value">{devices.filter(d => d.isOnline).length}</div>
                        <div className="stat-label">Online</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="devices-section">
                    <h3>Quick Access</h3>
                    <div className="devices-grid">
                        {devices.slice(0, 4).map((device) => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                onClick={() => setSelectedDevice(device)}
                            />
                        ))}
                        {devices.length === 0 && (
                            <div className="empty-devices glass-card">
                                <p>No devices yet. Add your first device!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="tasks-section">
                    <TaskList />
                </div>
            </div>

            {selectedDevice && (
                <div className="control-panel-overlay" onClick={() => setSelectedDevice(null)}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <DeviceControlPanel
                            device={selectedDevice}
                            onClose={() => setSelectedDevice(null)}
                        />
                    </div>
                </div>
            )}

            <AddDeviceModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
        </div>
    );
};

export default Dashboard;
