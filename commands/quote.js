const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'quote',
    description: 'Quotes a message by message ID and sends it to the quotes channel.',
    guildOnly: true,
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide the message ID to quote.');
        }

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.reply('You do not have permission to use this command.');
        }

        const messageId = args[0];
        const quotesChannelName = 'quotes';
        const quotesChannel = message.guild.channels.cache.find(channel => channel.name === quotesChannelName);

        if (!quotesChannel) {
            return message.reply(`I couldn't find a channel named "${quotesChannelName}".`);
        }

        try {
            const targetMessage = await message.channel.messages.fetch(messageId);
            const quoteContent = targetMessage.content;
            const quoteAuthor = targetMessage.author.username;
            const quoteTimestamp = targetMessage.createdAt.toLocaleString();
            const customTitle = args[1] ? args.slice(1).join(' ') : `Quote by ${quoteAuthor}`;

            const quoteEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(customTitle)
                .setDescription(quoteContent)
                .setFooter({ text: `Sent by: ${quoteAuthor} | ${quoteTimestamp}` });


            quotesChannel.send({ embeds: [quoteEmbed] });
            message.channel.send('Quote added to the quotes channel.');
        } catch (error) {
            console.error(error);
            message.reply(`There was an error trying to quote that message. Make sure the message ID is valid.`);
        }
    },
};
