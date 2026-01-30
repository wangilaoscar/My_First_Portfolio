/**
 * Bluetooth Connectivity Service (Web Bluetooth API)
 */

export const scanForBluetoothDevices = async (onDeviceFound) => {
    // Check for browser support
    if (!navigator.bluetooth) {
        console.warn("Web Bluetooth is not supported. Switching to Simulation Mode.");
        return simulateBluetoothScan(onDeviceFound);
    }

    try {
        // Requesting device involves a browser popup
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service', 'heart_rate_measurement']
        });

        if (device) {
            onDeviceFound({
                id: device.id,
                name: device.name || 'Unknown Bluetooth Device',
                type: 'bluetooth',
                connected: false,
                isSimulated: false
            });
        }
    } catch (error) {
        console.error("Bluetooth Scan Error Details:", {
            name: error.name,
            message: error.message
        });

        // Most browser errors (SecurityError, NotAllowedError, etc.) mean we should just use simulation
        // especially when testing via local IP on mobile without HTTPS.
        console.warn("Falling back to Simulation Mode due to environment limitations.");
        return simulateBluetoothScan(onDeviceFound);
    }
};

const simulateBluetoothScan = async (onDeviceFound) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    onDeviceFound({
        id: 'sample-bt-1',
        name: 'Bose SoundLink (Sample)',
        type: 'speaker',
        connected: false,
        isSimulated: true
    });
};

export const connectToDevice = async (device) => {
    console.log("Connecting to:", device.name);
    return true;
};
