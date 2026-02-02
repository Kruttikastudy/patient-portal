const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!apiKey);
    console.log("API Key starts with:", apiKey?.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try to list available models
    try {
        console.log("\nAttempting to generate content with gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log("SUCCESS! Response:", response.text());
    } catch (error) {
        console.error("ERROR:", error.message);
        console.error("Status:", error.status);
        console.error("Full error:", error);
    }
}

testGemini();
