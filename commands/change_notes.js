module.exports = {
    name: 'change_notes',
    description: 'Change Notes',
    execute(message) {
        message.channel.send('Changes since previous version:\n');
        message.channel.send('Penny now no longer requires case sensitivity for talking to her.\n'
            + 'Added Lacenty to Ping command'
            );

        
    },
};