import { createContext, useContext, useState, useEffect } from 'react';
import { speak } from '../services/VoiceService';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { user } = useAuth();
    const [wallpaper, setWallpaper] = useState(() => {
        return localStorage.getItem('smarthome_wallpaper') || 'default';
    });

    const [hasWelcomed, setHasWelcomed] = useState(false);
    const [devices, setDevices] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [aiMessages, setAiMessages] = useState([
        { id: 1, type: 'ai', text: 'Hello! I\'m your Smart Home AI assistant. How can I help you today?' }
    ]);

    // sync Wallpaper to localStorage (local preference)
    useEffect(() => {
        localStorage.setItem('smarthome_wallpaper', wallpaper);
        document.documentElement.setAttribute('data-wallpaper', wallpaper);
    }, [wallpaper]);

    // Firestore Sync: Devices
    useEffect(() => {
        if (!user) {
            setDevices([]);
            return;
        }

        const q = query(collection(db, 'devices'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const deviceList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDevices(deviceList);
        });

        return () => unsubscribe();
    }, [user]);

    // Firestore Sync: Tasks
    useEffect(() => {
        if (!user) {
            setTasks([]);
            return;
        }

        const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const taskList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(taskList);
        });

        return () => unsubscribe();
    }, [user]);

    // Welcome Home Sound Greeting
    const welcomeHome = () => {
        if (!hasWelcomed) {
            speak("Welcome home! System online.");
            setHasWelcomed(true);
        }
    };

    // Device Management
    const addDevice = async (device) => {
        if (!user) return;

        const newDevice = {
            ...device,
            userId: user.uid,
            isOnline: true,
            createdAt: serverTimestamp(),
            state: device.type === 'tv' ? { power: false, volume: 50, channel: 1 } :
                device.type === 'speaker' ? { power: false, volume: 60, playing: null } :
                    device.type === 'lights' ? { power: false, brightness: 100, color: '#ffffff' } :
                        device.type === 'laptop' ? { power: false, batteryLevel: 85 } : {}
        };

        try {
            await addDoc(collection(db, 'devices'), newDevice);
        } catch (error) {
            console.error("Error adding device to Firestore:", error);
        }
    };

    const removeDevice = async (deviceId) => {
        try {
            await deleteDoc(doc(db, 'devices', deviceId));
        } catch (error) {
            console.error("Error removing device:", error);
        }
    };

    const updateDevice = async (deviceId, updates) => {
        try {
            await updateDoc(doc(db, 'devices', deviceId), updates);
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    const toggleDevicePower = async (deviceId) => {
        const device = devices.find(d => d.id === deviceId);
        if (device) {
            await updateDevice(deviceId, {
                state: { ...device.state, power: !device.state.power }
            });
        }
    };

    // Task Management
    const addTask = async (task) => {
        if (!user) return;

        const newTask = {
            ...task,
            userId: user.uid,
            completed: false,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, 'tasks'), newTask);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const removeTask = async (taskId) => {
        try {
            await deleteDoc(doc(db, 'tasks', taskId));
        } catch (error) {
            console.error("Error removing task:", error);
        }
    };

    const toggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            await updateDevice(taskId, { completed: !task.completed });
        }
    };

    const updateTask = (taskId, updates) => {
        setTasks(tasks.map(t =>
            t.id === taskId ? { ...t, ...updates } : t
        ));
    };

    // AI Assistant
    const sendAIMessage = (message) => {
        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: message
        };
        setAiMessages(prev => [...prev, userMsg]);

        // Process command
        setTimeout(() => {
            const response = processAICommand(message);
            const aiMsg = {
                id: Date.now() + 1,
                type: 'ai',
                text: response
            };
            setAiMessages(prev => [...prev, aiMsg]);
            speak(response); // Voice Response
        }, 500);
    };

    const processAICommand = (command) => {
        const lower = command.toLowerCase();

        // Turn on/off devices
        if (lower.includes('turn on') || lower.includes('switch on')) {
            const device = devices.find(d =>
                lower.includes(d.name.toLowerCase()) ||
                lower.includes(d.type)
            );
            if (device) {
                updateDevice(device.id, { state: { ...device.state, power: true } });
                return `Turning on ${device.name}...`;
            }
            return 'Sorry, I couldn\'t find that device.';
        }

        if (lower.includes('turn off') || lower.includes('switch off')) {
            const device = devices.find(d =>
                lower.includes(d.name.toLowerCase()) ||
                lower.includes(d.type)
            );
            if (device) {
                updateDevice(device.id, { state: { ...device.state, power: false } });
                return `Turning off ${device.name}...`;
            }
            return 'Sorry, I couldn\'t find that device.';
        }

        // Play music
        if (lower.includes('play')) {
            const speaker = devices.find(d => d.type === 'speaker');
            if (speaker) {
                const song = lower.includes('music') ? 'your playlist' :
                    lower.split('play')[1]?.trim() || 'music';
                updateDevice(speaker.id, {
                    state: { ...speaker.state, power: true, playing: song }
                });
                return `Playing ${song} on ${speaker.name}...`;
            }
            return 'No speaker found. Please add a speaker device.';
        }

        // Default responses
        if (lower.includes('hello') || lower.includes('hi')) {
            return 'Hello! How can I assist with your smart home today?';
        }

        if (lower.includes('help')) {
            return 'I can help you control your devices! Try saying "Turn on the lights" or "Play music".';
        }

        return 'I\'m not sure how to help with that. Try "turn on [device]", "play music", or ask for help.';
    };

    const value = {
        devices,
        addDevice,
        removeDevice,
        updateDevice,
        toggleDevicePower,
        tasks,
        addTask,
        removeTask,
        toggleTask,
        updateTask,
        aiMessages,
        sendAIMessage,
        wallpaper,
        setWallpaper,
        welcomeHome
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
