module.exports = {
    name: 'status',
    description: 'Penny\'s status',
    execute(message, args) {
        message.channel.send('I\'m combat ready.');
        message.channel.send({ files: ["\combatready.gif"] });
    }
}