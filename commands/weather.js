module.exports = {
    name: 'weather',
    description: 'Get the current weather for a specified location.',
    aliases: ['forecast'],
    usage: '<city>',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a city name.');
        }

        const city = args.join(' ');
        const apiKey = '';
        const units = 'imperial';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

        const fetch = await import('node-fetch');
        const response = await fetch.default(url);
        const data = await response.json();

        if (data.cod !== 200) {
            return message.reply(`Error fetching weather data: ${data.message}`);
        }

        const weather = data.weather[0].description;
        const temperature = data.main.temp;
        const cityName = data.name;

        message.channel.send(`The current weather in ${cityName} is ${weather} with a temperature of ${temperature}°F.`);
    },
};
