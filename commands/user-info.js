module.exports = {
    name: 'user-info',
    description: 'Gives user-info',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Hello, ${message.author.username}!\nYour ID number is ${message.author.id}.`);
        }
        const taggedUser = message.mentions.users.first();
        var taggedUserID = message.member.id;
           message.channel.send(`${taggedUser}'s User ID is ${taggedUserID}`);
       
      
    },
};