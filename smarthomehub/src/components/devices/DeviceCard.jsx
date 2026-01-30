import { Tv, Volume2, Lightbulb, Laptop, Power, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './DeviceCard.css';

const DeviceCard = ({ device, onClick }) => {
    const { toggleDevicePower } = useApp();

    const getDeviceIcon = () => {
        switch (device.type) {
            case 'tv':
                return <Tv size={24} />;
            case 'speaker':
                return <Volume2 size={24} />;
            case 'lights':
                return <Lightbulb size={24} />;
            case 'laptop':
                return <Laptop size={24} />;
            default:
                return <Power size={24} />;
        }
    };

    const handlePowerToggle = (e) => {
        e.stopPropagation();
        toggleDevicePower(device.id);
    };

    return (
        <div
            className={`device-card glass-card ${device.state.power ? 'device-on' : ''}`}
            onClick={onClick}
        >
            <div className="device-header">
                <div className={`device-icon ${device.state.power ? 'active' : ''}`}>
                    {getDeviceIcon()}
                </div>
                <div className="device-status">
                    {device.isOnline ? (
                        <Wifi size={14} className="status-online" />
                    ) : (
                        <WifiOff size={14} className="status-offline" />
                    )}
                </div>
            </div>

            <div className="device-info">
                <h3 className="device-name">{device.name}</h3>
                <p className="device-location">{device.location}</p>
            </div>

            <div className="device-state">
                {device.type === 'speaker' && device.state.playing && (
                    <div className="now-playing">
                        <div className="pulse-indicator"></div>
                        Playing: {device.state.playing}
                    </div>
                )}
                {device.type === 'laptop' && (
                    <div className="battery-level">
                        Battery: {device.state.batteryLevel}%
                    </div>
                )}
            </div>

            <div className="device-footer">
                <button
                    className={`btn btn-power ${device.state.power ? 'active' : ''}`}
                    onClick={handlePowerToggle}
                >
                    <Power size={16} />
                    {device.state.power ? 'On' : 'Off'}
                </button>
                <span className={`badge ${device.state.power ? 'badge-success' : 'badge-warning'}`}>
                    {device.state.power ? 'Active' : 'Standby'}
                </span>
            </div>
        </div>
    );
};

export default DeviceCard;
