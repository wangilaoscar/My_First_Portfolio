
const API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

/**
 * Generates a response from Hugging Face Inference API.
 */
export const getHuggingFaceResponse = async (prompt, devices, tasks) => {
    if (!API_KEY) {
        console.error("Hugging Face Error: VITE_HUGGINGFACE_API_KEY is not defined!");
        return "Hubert: Critical Error. Access Token Missing. Please configure VITE_HUGGINGFACE_API_KEY.";
    }

    const deviceSummaries = devices.map(d => `${d.name} (${d.type}) is ${d.state?.power ? 'ON' : 'OFF'}`).join(', ');
    const taskCount = tasks.filter(t => !t.completed).length;

    const systemContext = `
You are Hubert, a smart home assistant.
Current Home State:
- Devices: ${deviceSummaries || "None"}
- Pending Tasks: ${taskCount}

User Input: ${prompt}

Respond as Hubert. Be concise, friendly, and helpful. If the user asks to control a device, confirm the action.
    `.trim();

    // Using Gemma 2 2B which is very stable on the free serverless API
    const MODEL = "google/gemma-2-2b-it";

    try {
        console.log("Hubert: Querying Hugging Face...");
        const response = await fetch(
            `/api/hf/models/${MODEL}`,
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: systemContext,
                    parameters: {
                        max_new_tokens: 150,
                        return_full_text: false,
                        temperature: 0.7
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("HF Error Details:", errorData);
            if (response.status === 503) return "Hubert: My brain is loading (Model Loading). Please try again in a moment.";
            throw new Error(`HF API Error: ${response.status}`);
        }

        const result = await response.json();

        if (Array.isArray(result) && result[0]?.generated_text) {
            return result[0].generated_text.trim();
        }

        return "Hubert: I heard you, but I couldn't think of a response.";

    } catch (error) {
        console.error("Hugging Face Service Failed:", error);
        return `Hubert: Connection error: ${error.message}`;
    }
};
