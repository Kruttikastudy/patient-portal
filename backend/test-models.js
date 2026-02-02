const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing API Key...\n");

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try different model names
    const modelsToTry = [
        "gemini-pro",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.0-pro",
        "models/gemini-pro",
        "models/gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Trying model: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS with ${modelName}!`);
            console.log(`Response: ${response.text()}\n`);
            break; // Stop after first success
        } catch (error) {
            console.log(`❌ Failed: ${error.message}\n`);
        }
    }
}

listModels();
