const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testWithDifferentEndpoint() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Testing with API key:", apiKey.substring(0, 20) + "...\n");

    // Try with explicit endpoint configuration
    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to try in order
    const modelsToTry = [
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting: ${modelName}...`);
            const model = genAI.getGenerativeModel({
                model: modelName
            });

            const result = await model.generateContent("Say 'Hello World' in one word");
            const response = await result.response;
            const text = response.text();

            console.log(`\n✅ SUCCESS with model: ${modelName}`);
            console.log(`Response: ${text}\n`);
            return modelName; // Return the working model name

        } catch (error) {
            console.log(`❌ ${modelName} failed: ${error.message}`);
            if (error.status) console.log(`   Status: ${error.status}`);
        }
    }

    console.log("\n❌ All models failed. This might be a regional restriction or API access issue.");
}

testWithDifferentEndpoint();
