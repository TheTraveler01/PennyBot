module.exports = {
    name: 'phrases',
    description: 'Lists all the phraes Penny responds to',
    execute(message) {
        message.channel.send('``I respond to:\n' +
            'I\'m not cute\n' + 'Im not cute\n' + 'I am not cute\n' + 'I ain\'t cute\n' +
            'Hello Penny\n' + 'Hi Penny\n' + 'Good morning Penny\n' + 'Good afternoon Penny\n' + 'Good night Penny\n'
            + 'I don\'t ship nuts and dolts\n' + 'I do not ship nuts and dolts\n' +
            'Fuck nuts and dolts\n' + 'I did it!\n' + 'I ship nuts and dolts\n' + 'Bad Penny\n``');


    },
};
