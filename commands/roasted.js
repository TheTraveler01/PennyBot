module.exports = {
    name: 'roasted',
    description: 'For when someone needs a burn heal',
    execute(message) {
        message.channel.send({ files: ["\ouch1.gif"] });

    },
};