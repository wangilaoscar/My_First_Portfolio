import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Gemini Error: VITE_GEMINI_API_KEY is not defined in environment variables!");
} else {
    console.log(`Gemini Key Check: Found key starting with ${API_KEY.substring(0, 4)}...`);
}
const genAI = new GoogleGenerativeAI(API_KEY || "");

/**
 * Raw REST diagnostic to see the EXACT error from Google
 */
const runRawDiagnostic = async (key) => {
    try {
        console.log("Hubert: Running model discovery...");
        const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const listResponse = await fetch(listUrl);
        const listData = await listResponse.json();
        console.log("Gemini Available Models:", listData);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        const data = await response.json();
        console.log("Gemini Test Generation:", data);
        return { listData, data };
    } catch (e) {
        console.error("Gemini Diagnostic Failed:", e);
        return null;
    }
};

/**
 * Generates a response from Gemini while maintaining the context of the smart home hub.
 */
export const getGeminiResponse = async (prompt, devices, tasks) => {
    console.warn("Hubert: STARTING AI HUB... CHECKING CONNECTIVITY.");
    if (API_KEY) {
        runRawDiagnostic(API_KEY).catch(() => { });
    }

    // Comprehensive list including 2.0 and the discovered 2.5 names
    const modelsToTry = [
        "gemini-2.0-flash-exp",
        "models/gemini-2.0-flash",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "models/gemini-2.5-flash",
        "gemini-1.5-flash",
        "models/gemini-1.5-flash",
        "gemini-pro"
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Hubert: Attempting connection via ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const systemInstruction = `
                You are "Hubert", the AI for a Smart Home Hub.
                HOME STATE: Devices: ${devices.length}, Tasks: ${tasks.length}.
                Keep responses concise.
            `;

            const result = await model.generateContent([systemInstruction, prompt]);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.warn(`Hubert: ${modelName} fallback.`, error.message);
            lastError = error;
            if (error.message?.includes('not found')) continue;
            break;
        }
    }

    // If we get here, all models failed
    console.error("Gemini Critical Failure:", lastError);
    const errorMsg = lastError?.message || "Unknown error";
    const errorType = lastError?.name || "Error";

    if (errorType === "TypeError" && errorMsg.includes("fetch")) {
        return "Hubert: My connection is blocked. Please disable VPN or Ad-blocker.";
    }

    if (errorMsg.includes('403') || errorMsg.toLowerCase().includes('permission')) {
        return "Hubert: Access Denied (403). Please check your API permissions.";
    }

    return `Hubert: Neural link error (${errorType}: ${errorMsg.substring(0, 50)}...).`;
};


