const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'restart-bot',
    description: 'Restarts the bot',
    async execute(message) {
        if (message.author.id !== '') {
            return message.reply("You don't have permission to use this command.");
        }

        await message.channel.send('Restarting!');

        process.exit();
    }
};
