class EmbeddedMemory {
	constructor(embedding, message, username, userId) {
		this.Embedding = embedding;
		this.Memory = new Memorable(message, username, userId);
	}
	toJSON() {
		return {
			Embedding: {
				Object: this.Embedding.Object,
				Data: this.Embedding.Data,
				Model: this.Embedding.Model,
				Usage: this.Embedding.Usage
			},
			Memory: {
				Message: this.Memory.Message,
				Username: this.Memory.Username,
				UserId: this.Memory.UserId
			}
		};
	}
}

class GptEmbedding {
	constructor(object, data, model = 'text-embedding-ada-002-v2', usage) {
		this.Object = object;
		this.Data = data;
		this.Model = model;
		this.Usage = usage;
	}
}

class Memorable {
	constructor(message, username, userId) {
		this.Message = message;
		this.Username = username;
		this.UserId = userId;
	}

	toString() {
		return `${this.Username}: ${this.Message}`;
	}
}

class MemoryComparison {

	static VectorSimilarity(x, y) {
		return x.reduce((sum, xi, i) => sum + xi * y[i], 0);
	}

	OrderMemorySectionsByQuerySimilarity(query, contexts) {
		const vectorArray = query.Embedding.Data;
		const memorySimilarities = Object.entries(contexts).map(([k, v]) => ({
			sim: MemoryComparison.VectorSimilarity(vectorArray, v),
			key: parseInt(k), // Convert the key back to an integer
		})).sort((a, b) => b.sim - a.sim);
		return memorySimilarities;
	}

	static GetContextualMemory(memories) {
		const contextEmbeddings = {};
		for (let i = 0; i < memories.length; i++) { // Using a loop with index
			const memory = memories[i];
			if (memory.Embedding && memory.Embedding.Data) {
				contextEmbeddings[i] = memory.Embedding.Data; // Use index as key
			}
		}
		return contextEmbeddings;
	}
}


module.exports = { Memorable, EmbeddedMemory, GptEmbedding, MemoryComparison };
