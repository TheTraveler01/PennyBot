const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Play a song',
    args: true,
    usage: '<song title>',
    async execute(message, args) {
        // Get the player instance from the client object
        const player = message.client.player;

        // Join the voice channel
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send('You need to be in a voice channel to play music!');
        }

        const songTitle = args.join(' ');

        // Try playing the song
        try {
            const song = await player.play(message, songTitle, {
                firstResult: true
            });

            if (song) {
                const embed = new MessageEmbed()
                    .setTitle(`Playing: ${song.name}`)
                    .setURL(song.url)
                    .setThumbnail(song.thumbnail)
                    .setDescription(`Duration: ${song.duration}`);

                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.send('No songs were found with that query. Please try again.');
            }
        } catch (error) {
            console.error(error);
            message.channel.send('There was an error playing the song.');
        }
    },
};
