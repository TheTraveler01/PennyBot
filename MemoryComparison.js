class MemoryComparison {
    static VectorSimilarity(x, y) {
        return x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    }

    OrderMemorySectionsByQuerySimilarity(query, contexts) {
        let vectorArray = query.Embedding.embedding; // Corrected access to embedding array
        let memorySimilarities = Object.entries(contexts).map(([k, v]) => ({
            sim: MemoryComparison.VectorSimilarity(vectorArray, v),
            key: k
        })).sort((a, b) => b.sim - a.sim);
        return memorySimilarities;
    }

    static GetContextualMemory(memories) {
        let contextEmbeddings = {};
        for (let memory of memories) {
            contextEmbeddings[memory.Memory.toString()] = memory.Embedding.embedding; // Corrected access to embedding array
        }
        return contextEmbeddings;
    }
}

module.exports = { MemoryComparison };
