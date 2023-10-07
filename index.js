const fs = require('fs');
const Discord = require('discord.js');
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { prefix, token } = require('./config.json');
const { DateTime } = require('luxon');
let chalk;
const { Player } = require('discord-player');

(async () => {
    chalk = (await import('chalk')).default;
})();


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ]
});

client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log('Ready');
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setPresence({ activities: [{ name: 'Minecraft' }], status: 'online' });

});
const player = Player.singleton(client, {

    deafenOnJoin: true,
    lagMonitor: 1000,
    ytdlOptions: {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }

});




player.events.on('playerStart', (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
});
player.events.on('error', (queue, error) => console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`));



client.on('messageCreate', async message => {
    logMessage(message);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === 'DM') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    const { cooldowns } = client;

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(message, args, player);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

async function logMessage(message) {
    if (message.author.bot) {
        console.log(`${message.author.username} sent a message`);
        return;
    }

    const dateTime = DateTime.local().toFormat('yyyy-LL-dd HH:mm:ss');
    const userDisName = `${message.author.username}#${message.author.discriminator}`;
    const serverName = message.guild ? message.guild.name : 'DM';
    const serverId = message.guild ? message.guild.id : 'DM';
    const channelName = message.channel.name || 'DM';
    const channelId = message.channel.id || 'DM';

    const logMessageConsole = `Message: ${message.content} | Server: ${chalk.green(serverName)} | Channel: ${chalk.green(channelName)} | Username: ${chalk.green(userDisName)} | ${dateTime}\n`;
    const logMessageFile = `${dateTime} | Server: ${serverName} (${serverId}) | Channel: ${channelName} (${channelId}) | Username: ${userDisName} (${message.author.id}) | Message: ${message.content}\n`;

    console.log(logMessageConsole);
    fs.appendFile('messageLog.txt', logMessageFile, (err) => {
        if (err) console.error(err);
    });
}



client.login(token);

