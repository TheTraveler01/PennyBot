module.exports = {
    name: 'boo!',
    description: 'Scares Penny',
    execute(message) {
        message.channel.send('Eep!');
        message.channel.send({ files: ["\spook.gif"] });
    },
};