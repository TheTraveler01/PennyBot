const axios = require('axios');
const _apiKey = process.env.OPENAI_API_KEY || require('./config.json').OPENAI_API_KEY;

class OpenAiHandler {
    constructor() {
        this.client = axios.create({
            headers: { 'Authorization': 'Bearer ' + _apiKey },
        });
    }

    async GetEmbedding(currentUserMessage) {
        const data = {
            model: 'text-embedding-ada-002',
            input: currentUserMessage.toString(),
        };

        console.log('Creating embedding for:', currentUserMessage.toString());

        try {
            const response = await this.client.post('https://api.openai.com/v1/embeddings', data);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

class OpenAiChat extends OpenAiHandler {
    constructor() {
        super();
        this.SYSTEM_MESSAGE = {
            "role": "system",
            "content": "You will be playing the role of the character from the RWBY universe, Penny. Remember to follow their background, behaviors, mannerisms, and relationships. Do not break character unless a user tells you to do so.`"
        };
    }

    postProcessResponse(response) {
        // Split the response into sentences.
        let sentences = response.split('. ');

        // Check if the last sentence ends with a period.
        if (!sentences[sentences.length - 1].endsWith('.')) {
            sentences.pop();
        }

        // Join the remaining sentences to get the revised response.
        let revisedResponse = sentences.join('. ');

        // If you stripped everything, then revert to the original (though this is a rare case).
        if (revisedResponse.trim() === "") {
            revisedResponse = response;
        }

        return revisedResponse;
    }

async chatWithAi(messages, model = "gpt-3.5-turbo") {
    const endpoint = `https://api.openai.com/v1/chat/completions`;
    
    // Add the SYSTEM_MESSAGE at the start
    messages.unshift(this.SYSTEM_MESSAGE);

    const data = {
        model: model,
        messages: messages,
        temperature: .3,
        max_tokens: 500,
        top_p: .5,
        frequency_penalty: 0,
        presence_penalty: 0
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + _apiKey,
    };

    try {
        console.log("Sending data to OpenAI:" + JSON.stringify(messages));
            const response = await axios.post(endpoint, data, { headers: headers });
            let processedResponse = this.postProcessResponse(response.data.choices[0].message.content.trim());
            return processedResponse;
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }
            return 'Sorry, there was an error while chatting.';
        }
    }
}

module.exports = { OpenAiHandler, OpenAiChat };
