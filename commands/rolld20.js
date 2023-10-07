module.exports = {
    name: 'rolld20',
    description: 'Roll a 20-sided die (d20) and get a random result between 1 and 20.',
    execute(message) {
        const roll = Math.floor(Math.random() * 20) + 1;
        message.reply(`You rolled a d20, and the result is ${roll}!`);
    },
};
