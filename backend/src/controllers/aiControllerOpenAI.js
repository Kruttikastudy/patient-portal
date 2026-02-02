const OpenAI = require("openai");

const getConditionAdviceOpenAI = async (req, res) => {
    try {
        const { condition } = req.body;

        if (!condition) {
            return res.status(400).json({ success: false, message: "Condition is required" });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ success: false, message: "OpenAI API key not configured" });
        }

        const openai = new OpenAI({ apiKey });

        const prompt = `You are a highly experienced and cautious medical AI assistant.
A patient has been diagnosed with: "${condition}".
Provide specific, medically accurate, and practical advice to help manage or reduce the effects of this condition.

Please structure your response with the following sections:
1. **Dietary Suggestions**: What to eat and what to avoid.
2. **Lifestyle & Exercise**: Specific exercises or daily habits that help.
3. **Precautions**: Things to be careful about.

Keep the advice concise, practical, and easy to understand. 
IMPORTANT: End with a disclaimer that this is AI-generated advice and they should consult a doctor for a professional treatment plan.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 800
        });

        const advice = completion.choices[0].message.content;
        res.status(200).json({ success: true, advice });

    } catch (error) {
        console.error("Error generating advice DETAILS:", error);
        res.status(500).json({ success: false, message: "Failed to generate advice: " + error.message });
    }
};

module.exports = { getConditionAdvice: getConditionAdviceOpenAI };
