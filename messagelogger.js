const fs = require('fs');

async function logMessage(message) {
    if (message.author.bot) {
        console.log(`${message.author.username} sent a message`);
        return;
    }

    const serverName = message.guild ? message.guild.name : 'DM';
    const channelName = message.channel.type !== 'DM' ? message.channel.name : 'DM';
    const userDisName = message.author.username;
    const dateTime = new Date().toLocaleString();

    const chalkModule = await import('chalk');
    const chalk = chalkModule.default;
    const logMessageWithIds = `${message.content} | Server: ${serverName} (${message.guild ? message.guild.id : 'N/A'}) | Channel: ${channelName} (${message.channel.id}) | Username: ${userDisName} (${message.author.id})| DateTime: ${dateTime}\n`;
    const logMessageWithoutIds = `${message.content} | Server: ${chalk.green(serverName)} | Channel: ${chalk.green(channelName)} | Username: ${chalk.green(userDisName)}| DateTime: ${dateTime}\n`;

    console.log(logMessageWithoutIds);

    fs.appendFile('messageLog.txt', logMessageWithIds, (err) => {
        if (err) {
            console.error(`Error writing message log: ${err}`);
        }
    });
}

module.exports = logMessage;
