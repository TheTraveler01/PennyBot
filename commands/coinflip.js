module.exports = {
    name: 'coinflip',
    description: 'Flip a coin and get either heads or tails.',
    aliases: ['flipacoin', 'coin'],
    execute(message) {
        const outcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
        message.channel.send(`You flipped a coin, and it landed on ${outcome}!`);
    },
};
