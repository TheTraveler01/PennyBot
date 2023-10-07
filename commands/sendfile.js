const axios = require('axios');
const { MessageAttachment } = require('discord.js');

module.exports = {
    name: 'sendfile',
    description: 'Reads an attached text file and sends its contents.',
    async execute(message) {
        // Check if there are attachments
        if (message.attachments.size === 0) {
            return message.channel.send('Please attach a file to your message.');
        }

        // Get the first attachment
        const attachment = message.attachments.first();

        // Check if the attachment is a text file
        if (!attachment.name.endsWith('.txt')) {
            return message.channel.send('Please attach a .txt file.');
        }

        try {
            // Fetch the text file content using its URL
            const response = await axios.get(attachment.url);
            const fileContent = response.data;

            // Check if the file content is empty or contains only spaces
            if (!fileContent.trim()) {
                return message.channel.send('The text file is empty or contains only spaces.');
            }

            // Split fileContent into words
            const words = fileContent.split(' ');

            // Initialize empty chunks array
            let chunks = [];

            // Iterate through words to create chunks
            let chunk = '';
            for (const word of words) {
                // Check if adding a new word would exceed the Discord character limit
                if ((chunk.length + word.length + 1) > 2000) {
                    chunks.push(chunk);
                    chunk = word;
                } else {
                    // Add the word to the current chunk
                    chunk += (chunk.length === 0 ? '' : ' ') + word;
                }
            }

            // Push the last chunk into chunks
            chunks.push(chunk);

            // Send each chunk as a separate message
            for (const chunk of chunks) {
                // Skip if the chunk is empty or contains only spaces
                if (chunk.trim() !== '') {
                    message.channel.send(chunk);
                }
            }
        } catch (error) {
            console.error(error);
            message.channel.send('Error reading the text file.');
        }
    },
};
