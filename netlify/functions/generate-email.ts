import { Context } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";

export default async (req: Request, context: Context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is not set in environment variables");
        return new Response(JSON.stringify({ error: "Server configuration error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { prompt } = await req.json();
        
        if (!prompt) {
             return new Response(JSON.stringify({ error: "Prompt is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const ai = new GoogleGenAI({ apiKey });
        // Updated model to gemini-3-flash-preview for better reasoning and latest features
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        // SDK access .text property directly
        return new Response(JSON.stringify({ text: response.text }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to generate content" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};