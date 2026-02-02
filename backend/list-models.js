const fetch = require('node-fetch');
require("dotenv").config();

async function testDirectAPI() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    console.log("Fetching available models...\n");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Available models:");
            data.models.forEach(model => {
                console.log(`  - ${model.name}`);
                if (model.supportedGenerationMethods) {
                    console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
                }
            });
        } else {
            console.log("❌ Error:", data);
        }
    } catch (error) {
        console.error("❌ Failed to fetch:", error.message);
    }
}

testDirectAPI();
