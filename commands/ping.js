module.exports = {
    name: 'ping',
    description: 'Ping!',
    execute(message, args) {
        message.channel.send('Pong!');
        message.channel.send(Date.now() - message.createdTimestamp + "ms")
    },
};