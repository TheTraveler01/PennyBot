module.exports = {
    name: 'kill',
    description: 'Kills someone',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to tag a user in order to have me kill them!');
        }

        message.mentions.users.map(user => {
            message.channel.send(`No.`);
        });
    },
};