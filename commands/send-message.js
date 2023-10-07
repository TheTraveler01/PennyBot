const Discord = require('discord.js');

module.exports = {
    name: 'send-message',
    description: 'Sends a message to a specific server and channel or the current channel if server and channel identifiers are not provided. Add server name or ID, channel name or ID (optional), and message after command, separated by commas',
    guildOnly: true,
    execute(message, args) {
        const allowedUserId = '';
        const allowedRoles = [''];

        const hasAllowedRole = message.member.roles.cache.some(role => allowedRoles.includes(role.name));

        if (message.author.id === allowedUserId || hasAllowedRole) {
            const target = args.join(' ');

            const [serverIdentifier, channelIdentifier, ...messageContent] = target.split(',');

            if (!messageContent.length) {
                const targetMessage = args.join(' ');
                message.channel.send(targetMessage);
                message.delete({ timeout: 0 })
                    .then(msg => console.log(`Deleted message from ${msg.author.username}`))
                    .catch(err => console.error(`Error deleting message: ${err}`));
            } else {
                const targetServer = message.client.guilds.cache.find(
                    guild => guild.name === serverIdentifier.trim() || guild.id === serverIdentifier.trim()
                );
                const targetChannel = targetServer?.channels.cache.find(
                    channel => channel.name === channelIdentifier.trim() || channel.id === channelIdentifier.trim()
                );

                if (!targetChannel) {
                    return message.channel.send(`I couldn't find a text channel named or with the ID "${channelIdentifier.trim()}" in the server "${serverIdentifier.trim()}".`);
                }

                const targetMessage = messageContent.join(',').trim();

                targetChannel.send(targetMessage).then(() => {
                    message.channel.send(`Message sent successfully to ${targetServer.name}, ${targetChannel.name}.`);
                });
            }
        } else {
            message.reply(`I'm sorry, friend, but I don't think you have permission to do that.`);
        }
    },
};
