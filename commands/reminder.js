const ms = require('ms');

module.exports = {
    name: 'reminder',
    description: 'Sets a reminder with a specified message and time. Time should be provided in a format like 1h30m (1 hour and 30 minutes), 2h (2 hours), or 45s (45 seconds).',
    guildOnly: true,
    usage: '<time> <message>',
    execute(message, args) {
        if (args.length < 2) {
            return message.reply(`Incorrect usage! Use the format: \`${this.usage}\``);
        }

        const timeArg = args.shift();
        const reminderMessage = args.join(' ');

        const timeInMs = ms(timeArg);
        if (!timeInMs) {
            return message.reply('Invalid time format. Please provide a valid time (e.g., 1h30m, 2h, 45s).');
        }

        if (timeInMs < 1000) {
            return message.reply('The minimum reminder time is 1 second.');
        }

        setTimeout(() => {
            message.reply(`Here's your reminder: ${reminderMessage}`);
        }, timeInMs);

        message.reply(`I will remind you in ${timeArg}: ${reminderMessage}`);
    },
};
