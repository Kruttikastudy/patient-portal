const { GoogleGenerativeAI } = require("@google/generative-ai");

const getConditionAdvice = async (req, res) => {
    try {
        const { condition } = req.body;

        if (!condition) {
            return res.status(400).json({ success: false, message: "Condition is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: "Server API key not configured" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Try the latest stable model name format
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
            }
        });

        const prompt = `You are a medical AI assistant.
A patient has condition: "${condition}".

Provide specific advice in exactly this structure (no intro/outro text):

1. **Dietary Suggestions**
[Bullet points on what to eat/avoid]

2. **Lifestyle & Exercise**
[Bullet points on habits/exercises]

3. **Precautions**
[Bullet points on what to match]

Keep it concise and practical. Do not say "Here is advice" avoid any conversational filler. Start directly with "1. **Dietary Suggestions**".`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ success: true, advice: text });

    } catch (error) {
        console.error("Error generating advice DETAILS:", error);
        console.error("Error status:", error.status);
        console.error("Error message:", error.message);
        res.status(500).json({ success: false, message: "Failed to generate advice: " + error.message });
    }
};

module.exports = { getConditionAdvice };
