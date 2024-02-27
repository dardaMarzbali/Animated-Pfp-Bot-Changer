const { Client, Intents, MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const axios = require('axios').default;
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

client.once('ready', () => {
    console.log('Bot is ready');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'setprofilepic') {
        try {
            const token = options.getString('token');
            const imageURL = options.getString('image_url');

            const response = await axios.get(imageURL, { responseType: 'arraybuffer' });

            const encodedImage = Buffer.from(response.data, 'binary').toString('base64');

            const headers = {
                "Authorization": `Bot ${token}`,
                "Content-Type": "application/json"
            };

            const data = {
                "avatar": `data:image/png;base64,${encodedImage}`
            };

            const url = "https://discord.com/api/v9/users/@me";
            const patchResponse = await axios.patch(url, data, {
                headers: headers
            });

            if (patchResponse.status !== 200) {
                console.error(`An error occurred: ${patchResponse.data.message}`);
                await interaction.reply(`An error occurred: ${patchResponse.data.message}`);
                return;
            }

            console.log('Success! Profile Picture Added!');

            const embed = new MessageEmbed()
                .setTitle('Profile Picture Updated')
                .setColor('#00ff00')
                .setDescription('The bot\'s profile picture has been successfully updated.')
                .setImage(imageURL)
                .setFooter('Made by Felosi @2024');
          
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`An error occurred while handling setprofilepic command: ${error.message}`);
            await interaction.reply(`An error occurred while handling setprofilepic command: ${error.message}`);
        }
    } else if (commandName === 'ping') {
        const pingTimestamp = interaction.createdTimestamp;
        const pongTimestamp = Date.now();
        const pingTime = pongTimestamp - pingTimestamp;
        await interaction.reply(`Pong! Bot's ping is ${pingTime}ms`);
    }
});

client.login(process.env.BOT_TOKEN);
//Made by Felosi @2024