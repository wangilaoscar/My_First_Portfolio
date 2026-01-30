import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB2GY8xaNRyuhWiOGLnGA0sAO-TdPkr0TM",
    authDomain: "smarthomeapp-51.firebaseapp.com",
    projectId: "smarthomeapp-51",
    storageBucket: "smarthomeapp-51.firebasestorage.app",
    messagingSenderId: "1038491842493",
    appId: "1:1038491842493:web:24e09443173af799fac4d4",
    measurementId: "G-S02XL3YMPQ"
};

// Simple check to see if placeholders are still present
export const isFirebaseConfigured =
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.authDomain !== "YOUR_AUTH_DOMAIN";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
