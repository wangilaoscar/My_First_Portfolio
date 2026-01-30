/**
 * WiFi Connectivity Service (Simulated Discovery & Validation)
 * 
 * NOTE: Real local network discovery is restricted in modern browsers for security.
 * These functions provide samples to demonstrate UI and manual setup logic.
 */

export const getSampleWiFiDevices = async () => {
    // Simulate network delay for discovery feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    // These are sample devices to demonstrate the dashboard
    return [
        { id: 'sample-wifi-1', name: 'Living Room TV (Sample)', type: 'tv', ip: '192.168.1.45', isSimulated: true },
        { id: 'sample-wifi-2', name: 'Kitchen Speaker (Sample)', type: 'speaker', ip: '192.168.1.12', isSimulated: true },
        { id: 'sample-wifi-3', name: 'Bedroom Light (Sample)', type: 'lights', ip: '192.168.1.88', isSimulated: true },
    ];
};

export const validateIPAddress = (ip) => {
    const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};

export const connectToWiFiDevice = async (ip) => {
    console.log("Attempting to handshake with:", ip);
    // In a real app, this would use fetch/auth-headers
    return true;
};
