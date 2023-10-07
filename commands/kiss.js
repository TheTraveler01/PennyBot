module.exports = {
    name: 'kiss',
    description: 'Kisses a user on the cheek',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to have me kiss them!');
        }

        message.mentions.users.map(user => {
            message.channel.send(`*kisses ${user.username} on the cheek*`);
    });
    },
};