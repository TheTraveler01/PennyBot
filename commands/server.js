const { Channel } = require("discord.js");


module.exports = {
    name: 'server',
    description: 'Server Name + Member number',
    execute(message) {
    let guild = message.guild;
        message.channel.send(
            `Server infomation on ${guild.name}\n` +


            `Members: ${guild.memberCount}\n` +
            `Region: + ${guild.region}\n` +
            `Owner: + ${guild.owner}\n` +
            `Creation: + ${ guild.createdAt }`
)
     
    
    
        
    },
};