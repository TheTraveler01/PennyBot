module.exports = {
    name: 'av',
    aliases: ['icon', 'pfp', 'avatar'],
    description: 'Gives avatar link',
    execute(message, args) {
    if (!message.mentions.users.size) {
            return message.channel.send(`Here, I found your avatar for you! <${message.author.displayAvatarURL}>`);
    }

    const avatarList = message.mentions.users.map(user => {
            return `This is ${user.username}'s avatar ${user.displayAvatarURL}`;
    });

    message.channel.send(avatarList);
    },
};