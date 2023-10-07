module.exports = {
    name: 'pats',
    description: 'pats Penny',
    execute(message) {

        message.channel.send({ files: ["\eager.gif"] });
    },
};
