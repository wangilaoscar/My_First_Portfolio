import { X, Volume2, Palette, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './DeviceControlPanel.css';

const DeviceControlPanel = ({ device, onClose }) => {
    const { updateDevice } = useApp();

    if (!device) return null;

    const handleVolumeChange = (e) => {
        updateDevice(device.id, {
            state: { ...device.state, volume: parseInt(e.target.value) }
        });
    };

    const handleBrightnessChange = (e) => {
        updateDevice(device.id, {
            state: { ...device.state, brightness: parseInt(e.target.value) }
        });
    };

    const handleColorChange = (e) => {
        updateDevice(device.id, {
            state: { ...device.state, color: e.target.value }
        });
    };

    return (
        <div className="control-panel glass-card">
            <div className="control-header">
                <div>
                    <h3>{device.name}</h3>
                    <p>{device.location}</p>
                </div>
                <button className="btn-icon btn-secondary" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            <div className="control-body">
                {/* TV Controls */}
                {device.type === 'tv' && (
                    <>
                        <div className="control-group">
                            <div className="control-label">
                                <Volume2 size={18} />
                                <span>Volume</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={device.state.volume}
                                onChange={handleVolumeChange}
                                className="slider"
                            />
                            <span className="control-value">{device.state.volume}%</span>
                        </div>
                    </>
                )}

                {/* Speaker Controls */}
                {device.type === 'speaker' && (
                    <>
                        <div className="control-group">
                            <div className="control-label">
                                <Volume2 size={18} />
                                <span>Volume</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={device.state.volume}
                                onChange={handleVolumeChange}
                                className="slider"
                            />
                            <span className="control-value">{device.state.volume}%</span>
                        </div>
                        {device.state.playing && (
                            <div className="now-playing-info">
                                <span className="playing-badge badge badge-success">Now Playing</span>
                                <p>{device.state.playing}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Lights Controls */}
                {device.type === 'lights' && (
                    <>
                        <div className="control-group">
                            <div className="control-label">
                                <Sun size={18} />
                                <span>Brightness</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={device.state.brightness}
                                onChange={handleBrightnessChange}
                                className="slider"
                            />
                            <span className="control-value">{device.state.brightness}%</span>
                        </div>
                        <div className="control-group">
                            <div className="control-label">
                                <Palette size={18} />
                                <span>Color</span>
                            </div>
                            <input
                                type="color"
                                value={device.state.color}
                                onChange={handleColorChange}
                                className="color-picker"
                            />
                            <span className="control-value">{device.state.color}</span>
                        </div>
                    </>
                )}

                {/* Laptop Controls */}
                {device.type === 'laptop' && (
                    <div className="laptop-info">
                        <div className="info-item">
                            <span className="info-label">Battery Level:</span>
                            <span className="info-value">{device.state.batteryLevel}%</span>
                        </div>
                        <div className="battery-bar">
                            <div
                                className="battery-fill"
                                style={{ width: `${device.state.batteryLevel}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeviceControlPanel;
