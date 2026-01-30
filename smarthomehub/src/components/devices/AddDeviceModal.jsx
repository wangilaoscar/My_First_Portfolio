import { useState } from 'react';
import { X, Tv, Speaker, Lightbulb, Laptop, Bluetooth, Wifi, Search, Globe, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { scanForBluetoothDevices } from '../../services/BluetoothService';
import { getSampleWiFiDevices, validateIPAddress } from '../../services/WiFiService';
import './AddDeviceModal.css';

const AddDeviceModal = ({ isOpen, onClose }) => {
    const { addDevice } = useApp();
    const [step, setStep] = useState('choice'); // choice, manual, bt-scan, wifi-scan
    const [name, setName] = useState('');
    const [type, setType] = useState('tv');
    const [location, setLocation] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scannedDevices, setScannedDevices] = useState([]);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleManualSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (ipAddress && !validateIPAddress(ipAddress)) {
            return setError('Please enter a valid IP address (e.g. 192.168.1.50)');
        }
        addDevice({ name, type, location, ipAddress, deviceId });
        resetAndClose();
    };

    const handleBluetoothScan = async () => {
        setStep('bt-scan');
        setIsScanning(true);
        setError('');
        setScannedDevices([]);
        try {
            await scanForBluetoothDevices((device) => {
                setScannedDevices(prev => [...prev.filter(d => d.id !== device.id), device]);
                setIsScanning(false);
            });
        } catch (err) {
            setIsScanning(false);
            setError(`Bluetooth error: ${err.message || 'Check browser permissions'}`);
            console.error(err);
        }
    };

    const handleWiFiScan = async () => {
        setStep('wifi-scan');
        setIsScanning(true);
        setError('');
        setScannedDevices([]);
        try {
            const devices = await getSampleWiFiDevices();
            setScannedDevices(devices);
            setIsScanning(false);
        } catch (err) {
            setIsScanning(false);
            setError('Discovery service unavailable.');
            console.error(err);
        }
    };

    const handleAddScanned = (device) => {
        addDevice({
            name: device.name,
            type: device.type || 'speaker',
            location: 'Nearby',
            ipAddress: device.ip || '',
            deviceId: device.id
        });
        resetAndClose();
    };

    const resetAndClose = () => {
        setName('');
        setType('tv');
        setLocation('');
        setIpAddress('');
        setDeviceId('');
        setStep('choice');
        setScannedDevices([]);
        setError('');
        onClose();
    };

    const deviceTypes = [
        { id: 'tv', icon: <Tv size={24} />, label: 'TV' },
        { id: 'speaker', icon: <Speaker size={24} />, label: 'Speaker' },
        { id: 'lights', icon: <Lightbulb size={24} />, label: 'Lights' },
        { id: 'laptop', icon: <Laptop size={24} />, label: 'Laptop' },
    ];

    return (
        <div className="modal-overlay" onClick={resetAndClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Device</h2>
                    <button className="btn-icon" onClick={resetAndClose}><X size={20} /></button>
                </div>

                {step === 'choice' && (
                    <div className="connection-choice">
                        <button className="choice-card glass-card" onClick={() => setStep('manual')}>
                            <Globe size={32} />
                            <span>Manual Setup</span>
                            <p>Real Devices (IP Sync)</p>
                        </button>
                        <button className="choice-card glass-card" onClick={handleWiFiScan}>
                            <Wifi size={32} />
                            <span>WiFi Scan</span>
                            <p>Cloud/Local Samples</p>
                        </button>
                        <button className="choice-card glass-card" onClick={handleBluetoothScan}>
                            <Bluetooth size={32} />
                            <span>Bluetooth</span>
                            <p>BLE Device Pairing</p>
                        </button>
                    </div>
                )}

                {(step === 'bt-scan' || step === 'wifi-scan') && (
                    <div className="scan-section">
                        {error && <div className="badge badge-error mb-sm w-full">{error}</div>}

                        {isScanning ? (
                            <div className="scanning-ui">
                                <Search size={48} className="animate-spin" />
                                <p>{step === 'bt-scan' ? 'Searching for Bluetooth devices...' : 'Discovering WiFi samples...'}</p>
                                {step === 'bt-scan' && (
                                    <div className="scan-hint mt-md glass-card p-sm text-xs">
                                        <Info size={14} />
                                        <span>Real Bluetooth requires HTTPS and a secure context. Falling back to Sample mode if restricted.</span>
                                    </div>
                                )}
                            </div>
                        ) : scannedDevices.length > 0 ? (
                            <div className="scanned-list">
                                <div className="text-xs opacity-50 mb-sm">FOUND DEVICES:</div>
                                {scannedDevices.map(d => (
                                    <div key={d.id} className="scanned-item glass-card">
                                        <div className="scanned-info">
                                            {step === 'bt-scan' ? <Bluetooth size={16} /> : <Wifi size={16} />}
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>{d.name}</span>
                                                    {d.isSimulated && <span className="badge badge-sm" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)' }}>SAMPLE</span>}
                                                </div>
                                                {d.ip && <span className="text-xs opacity-50">{d.ip}</span>}
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-sm" onClick={() => handleAddScanned(d)}>Add</button>
                                    </div>
                                ))}
                                <button className="btn btn-secondary w-full mt-md" onClick={() => setStep('choice')}>Back to Choice</button>
                            </div>
                        ) : (
                            <div className="no-devices">
                                <p>No devices discovered.</p>
                                <button className="btn btn-secondary mt-md" onClick={() => setStep('choice')}>Back</button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'manual' && (
                    <form onSubmit={handleManualSubmit} className="add-device-form">
                        <div className="manual-guide glass-card mb-sm">
                            <Info size={16} />
                            <p>To add a <strong>real device</strong>, enter its local IP address below. Ensure it is connected to the same network.</p>
                        </div>

                        {error && <div className="badge badge-error mb-sm w-full">{error}</div>}

                        <div className="form-group">
                            <label>Device Name</label>
                            <input
                                type="text"
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. My Smart Lights"
                                required
                            />
                        </div>

                        <div className="flex-row gap-md" style={{ display: 'flex', gap: '1rem' }}>
                            <div className="form-group flex-1" style={{ flex: 1 }}>
                                <label>IP Address</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={ipAddress}
                                    onChange={(e) => setIpAddress(e.target.value)}
                                    placeholder="192.168.x.x"
                                    required
                                />
                            </div>
                            <div className="form-group flex-1" style={{ flex: 1 }}>
                                <label>Device ID</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                    placeholder="Optional ID"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Device Type</label>
                            <div className="type-grid">
                                {deviceTypes.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        className={`type-card ${type === t.id ? 'active' : ''}`}
                                        onClick={() => setType(t.id)}
                                    >
                                        {t.icon}
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                className="input"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. Kitchen"
                                required
                            />
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep('choice')}>Back</button>
                            <button type="submit" className="btn btn-primary">Add Real Device</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddDeviceModal;
