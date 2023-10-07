const { Player } = require('discord-player');

module.exports = {
    name: 'play',
    description: 'Play a song',
    args: true,
    usage: '<query>',
    async execute(message, args) {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('You are not connected to a voice channel!');

        const query = args.join(' ');

        try {
            const player = new Player(message.client);
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: message
                }
            });

            return message.channel.send(`**${track.title}** enqueued!`);
        } catch (e) {
            console.error(e);
            return message.channel.send(`Something went wrong: ${e}`);
        }
    },
};
