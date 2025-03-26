const axios = require('axios');

async function getRecommendationForTask(content) {
    const apiKey = process.env.OPENAI_KEY;

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an assistant" },
                { role: "user", content: `Provide helpful recommendations for the following task: "${content}"` }
            ],
            max_tokens: 250,
        }, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        throw error;  
    }
}

module.exports = { getRecommendationForTask };
