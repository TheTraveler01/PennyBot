const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Display the current queue',
    async execute(message, args, client) {
        const player = client.player;

        const queue = player.getQueue(message.guild.id); // <-- Use message.guild.id instead of message.guild

        if (!queue) {
            return message.channel.send('There is no queue currently.');
        }

        const embed = new MessageEmbed()
            .setTitle('Music Queue')
            .setDescription(queue.tracks.map((track, i) => `${i + 1}. ${track.title}`).join('\n'))
            .setFooter(`Now playing: ${queue.playing.title}`);

        return message.channel.send({ embeds: [embed] });
    },
};
