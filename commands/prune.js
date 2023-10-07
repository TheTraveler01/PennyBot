module.exports = {
	name: 'prune',
	description: 'Prune up to 99 messages.',
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;
		if (message.member.permissions.has('MANAGE_MESSAGES')) {
			if (isNaN(amount)) {
				return message.reply('Hmm... that doesn\'t seem to be a valid number.');
			}
			else if (amount <= 1 || amount > 100) {
				return message.reply('I\'m sorry, but I can only delete up to 99 messages at a time.');
			}

			message.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				message.channel.send('Hmm... it seems something went wrong in the deletion process.');
			});
		}

		else{
			message.reply('I\'m sorry, friend, but I don\'t think you have permission to do that.');
		}
	},
};