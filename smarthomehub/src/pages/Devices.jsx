import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/layout/Header';
import DeviceCard from '../components/devices/DeviceCard';
import DeviceControlPanel from '../components/devices/DeviceControlPanel';
import AddDeviceModal from '../components/devices/AddDeviceModal';
import './Devices.css';

const Devices = () => {
    const { devices, removeDevice } = useApp();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [filterType, setFilterType] = useState('all');

    const filteredDevices = filterType === 'all'
        ? devices
        : devices.filter(d => d.type === filterType);

    const deviceTypes = [
        { value: 'all', label: 'All Devices', count: devices.length },
        { value: 'tv', label: 'TVs', count: devices.filter(d => d.type === 'tv').length },
        { value: 'speaker', label: 'Speakers', count: devices.filter(d => d.type === 'speaker').length },
        { value: 'lights', label: 'Lights', count: devices.filter(d => d.type === 'lights').length },
        { value: 'laptop', label: 'Laptops', count: devices.filter(d => d.type === 'laptop').length },
    ];

    return (
        <div className="devices-page">
            <Header
                title="My Devices"
                subtitle="Manage all your connected devices"
            >
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Device
                </button>
            </Header>

            <div className="filter-tabs">
                {deviceTypes.map((type) => (
                    <button
                        key={type.value}
                        className={`filter-tab glass-card ${filterType === type.value ? 'active' : ''}`}
                        onClick={() => setFilterType(type.value)}
                    >
                        <span>{type.label}</span>
                        <span className="badge badge-success">{type.count}</span>
                    </button>
                ))}
            </div>

            <div className="devices-grid">
                {filteredDevices.length === 0 ? (
                    <div className="empty-state glass-card">
                        <div className="empty-icon">📱</div>
                        <h3>No devices found</h3>
                        <p>Add your first device to get started</p>
                        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                            <Plus size={18} />
                            Add Device
                        </button>
                    </div>
                ) : (
                    filteredDevices.map((device) => (
                        <div key={device.id} className="device-wrapper">
                            <DeviceCard
                                device={device}
                                onClick={() => setSelectedDevice(device)}
                            />
                            <button
                                className="delete-btn btn-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Remove ${device.name}?`)) {
                                        removeDevice(device.id);
                                    }
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
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

export default Devices;
