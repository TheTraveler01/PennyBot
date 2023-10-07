const { prefix } = require('../config.json');
const { EmbeddedMemory, Memorable, GptEmbedding, MemoryComparison } = require('../embeddingAndComparison.js');
const fs = require('fs');
const path = require('path');
const { OpenAiHandler, OpenAiChat } = require('../apiHandler.js');
const chatHandler = new OpenAiChat();

let listOfUserMemories;

// Load user memories from UserMemories.json
if (fs.existsSync(path.join(__dirname, '..', 'UserMemories.json'))) {
	try {
		const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'UserMemories.json'), 'utf-8'));
		listOfUserMemories = data.map(item => new EmbeddedMemory(
			new GptEmbedding(item.Embedding.Object, item.Embedding.Data, item.Embedding.Model, item.Embedding.Usage),
			item.Memory.Message,
			item.Memory.Username,
			item.Memory.UserId
		));
	} catch (err) {
		listOfUserMemories = [];
		console.error('Error loading UserMemories.json:', err);
	}
} else {
	listOfUserMemories = [];
}


const openAiHandler = new OpenAiHandler();

module.exports = {
	name: 'chat',
	description: 'Chat with the bot!',
	async execute(message) {
		const chatInput = message.content.slice(prefix.length).trim().split(/ +/).slice(1).join(' ');
		const userId = message.author.id;
		const currentUserMessage = new Memorable(chatInput, message.author.username, userId);

		try {
			const embeddingResponse = await openAiHandler.GetEmbedding(currentUserMessage);
			const embedding = new GptEmbedding(embeddingResponse.data[0].object, embeddingResponse.data[0].embedding);
			const embeddedMemory = new EmbeddedMemory(embedding, chatInput, message.author.username, userId);

			const comparison = new MemoryComparison();
			const context = MemoryComparison.GetContextualMemory(listOfUserMemories);
			const relevantMemories = comparison.OrderMemorySectionsByQuerySimilarity(embeddedMemory, context);
			const topMemories = relevantMemories.slice(0, 5);

			const messagesForApi = topMemories.map(memory => {
				const mem = listOfUserMemories[memory.key];
				return {
					role: 'user',
					content: mem.Memory.toString() // This uses the Memorable's toString() to create "Username: Message"
				};
			});
			messagesForApi.push({ role: 'user', content: currentUserMessage.toString() });

			const response = await chatHandler.chatWithAi(messagesForApi);

			const chatResponse = response.choices ? response.choices[0].message.content : response;
			const assistantMemory = new EmbeddedMemory(new GptEmbedding(null, null), chatResponse, 'Assistant', '-1');

			listOfUserMemories.push(embeddedMemory, assistantMemory);
			fs.writeFileSync(path.join(__dirname, '..', 'UserMemories.json'), JSON.stringify(listOfUserMemories));

			sendResponse(message.channel, chatResponse);
		}
		catch (error) {
			console.error('Error processing chat command:', error);
			message.channel.send('Sorry, there was an error while chatting.');
		}
	},
};

async function sendResponse(channel, response) {
	try {
		const chunks = response.match(/[\s\S]{1,2000}/g);
		for (const chunk of chunks) {
			await channel.send(chunk);
		}
	}
	catch (error) {
		console.error('Failed to send response:', error);
		channel.send('An error occurred while sending the response.');
	}
}