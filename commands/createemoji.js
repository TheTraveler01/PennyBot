module.exports = {
    name: "createemoji",
    description: "Create an emoji from an image sent by the user.",
    usage: "<emoji name(s)>",
    async execute(message, args) {
        if (!args.length) {
            return message.reply("You need to provide a name for the emoji.");
        }

        if (!message.attachments.size) {
            return message.reply("You need to attach an image to create an emoji.");
        }

        const imageNames = args.join(" ").split(",");

        if (message.attachments.size !== imageNames.length) {
            return message.reply(
                "The number of emoji names must match the number of images."
            );
        }

        const images = Array.from(message.attachments.values());

        try {
            let createdEmojis = [];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const imageName = imageNames[i].trim();

                if (![".jpg", ".jpeg", ".png", ".gif"].some((ext) => image.url.endsWith(ext))) {
                    return message.reply(
                        "You must attach a valid image format: JPG, JPEG, PNG, or GIF."
                    );
                }

                const emoji = await message.guild.emojis.create(image.url, imageName);
                createdEmojis.push(`<:${emoji.name}:${emoji.id}>`);
            }

            message.reply(`Emoji(s) created: ${createdEmojis.join(", ")}`);
        } catch (error) {
            console.error(error);
            message.reply("There was an error trying to create the emoji(s).");
        }
    },
};
