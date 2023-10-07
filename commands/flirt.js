module.exports = {
    name: 'flirt',
    description: 'Penny flirts ',
    execute(message) {
        message.channel.send('Are you a magnet? Because I\'m attracted to you ;)');
        message.channel.send({ files: ["\pennywink.gif"] });
    },
};