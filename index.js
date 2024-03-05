const { Client, Intents, MessageEmbed } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const os = require('os');
const si = require('systeminformation');
const moment = require('moment');
const axios = require('axios').default;
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const rest = new REST({ version: '9' }).setToken("MTA1MTMzMTA5Mjk5MDQwMjYyNA.G1bLQG.-r1brFYETLqRwB1pyjB1IZ5j2o_MG1zSNAewCY");

client.once('ready', async () => {
    console.log('Bot is ready');

    // Reset all existing global slash commands
    try {
        const commands = await rest.get(
            Routes.applicationCommands(client.user.id),
        );
        await Promise.all(commands.map(command => rest.delete(
            Routes.applicationCommand(client.user.id, command.id),
        )));
        console.log('All existing global slash commands have been deleted.');
    } catch (error) {
        console.error('Error deleting global slash commands:', error);
    }

    // Register global slash commands
    const commandsData = [
        {
            name: 'setprofilepic',
            description: 'Change your bot profile picture',
            options: [
                {
                    name: 'token',
                    type: 3, // String type
                    description: 'Bot token',
                    required: true,
                },
                {
                    name: 'image_url',
                    type: 3, // String type
                    description: 'Image URL',
                    required: true,
                },
            ],
        },
        {
            name: 'ping',
            description: 'Check the bot\'s ping',
        },
        {
            name: 'stats',
            description: 'View bot statistics',
        },
        {
            name: 'links',
            description: 'Send important links',
        },
        {
            name: 'help',
            description: 'Display bot commands and usage',
        },
        {
            name: 'tuto',
            description: 'Learn how to use setprofilepic command',
        },

        };

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsData },
        );

        console.log('Successfully registered global slash commands!');
    } catch (error) {
        console.error('Error registering global slash commands:', error);
    }
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
    } else if (commandName === 'stats') {
        // Handle stats command as before
        try {
            const embed = new MessageEmbed()
                .setColor(`#2B2D31`)
                .setTitle(`${client.user.username} stats`)
                .setThumbnail(client.user.displayAvatarURL())
                .addField(`🏘 Servers:`, `${client.guilds.cache.size}`, false)
                .addField(`👥 Members:`, `${client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)}`, false)
                .addField(`🍁 Channels:`, `${client.channels.cache.size}`, false)
                .addField(`⌛️ Ping:`, `${Math.round(client.ws.ping)} ms`, false)
                .addField(`🗓 Creation date:`, `${client.user.createdAt.toDateString()}`, false)
                .addField(`📡 Built with:`, `Node.js V13`, false)
                .addField(`:tools: Bot Developer:`, `[Felosi](https://discord.com/users/779716357872680970)`, false)
                .setTimestamp(); // Sets current timestamp
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`An error occurred while handling stats command: ${error.message}`);
            await interaction.reply(`An error occurred while handling stats command: ${error.message}`);
        }
    } else if (commandName === 'links') {
        // Handle links command as before
        try {
            const embed = new MessageEmbed()
                .setTitle("Important Links:")
                .setColor('#2B2D31')
                .addField("🎋 Invite to a Discord server", "[Invite bot here](https://discord.com/api/oauth2/authorize?client_id=1051331092990402624&permissions=8&scope=bot)")
                .addField("🔗 GitHub", `[Click here](https://github.com/FelosiDev)`)
                .addField("🌐 App Directory", `[Click here](https://discord.com/application-directory/1051331092990402624)`)
                .addField("📮 Support Server", `[Click here](https://discord.gg/JQxWGQnRCG)`)
                .addField("🎊 Vote", `[Void Bot](https://voidbots.net/bot/1051331092990402624/)\n[Top.gg](https://top.gg/bot/1051331092990402624/)\n[Bots.gg](https://discord.bots.gg/bots/1051331092990402624)`)
                .setFooter("Bot created by Felosi")
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`An error occurred while handling links command: ${error.message}`);
            await interaction.reply(`An error occurred while handling links command: ${error.message}`);
        }
    } else if (commandName === 'help') {
        // Handle help command as before
        try {
            const embed = new MessageEmbed()
                .setTitle('Bot Commands')
                .setColor('#2B2D31')
                .setDescription('Here are the available bot commands:')
                .addFields(
                    { name: '/help', value: 'Send this message', inline: false },
                    { name: '/setprofilepic', value: 'Change your bot profile picture', inline: false },
                    { name: '/ping', value: 'Check the bot\'s ping', inline: false },
                    { name: '/stats', value: 'View bot statistics', inline: false },
                    { name: '/tuto', value: 'Learn how to use setprofilepic command', inline: false },
                    
                    // Add more commands as necessary
                );

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`An error occurred while handling help command: ${error.message}`);
            await interaction.reply(`An error occurred while handling help command: ${error.message}`);
        }
    } else if (commandName === 'tuto') {
        // Handle tuto command
        try {
            const embed = new MessageEmbed()
                .setTitle('How to Use setprofilepic Command')
                .setColor('#2B2D31')
                .setDescription('To change the bot\'s profile picture, use the following command:\n\n`/setprofilepic --token YOUR_BOT_TOKEN --image_url IMAGE_URL`\n\nReplace `YOUR_BOT_TOKEN` with your bot token and `IMAGE_URL` with the URL of the new image you want to set as the profile picture.')
                .setFooter('Bot created by Felosi @2024')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`An error occurred while handling tuto command: ${error.message}`);
            await interaction.reply(`An error occurred while handling tuto command: ${error.message}`);
        }
    }
          });


client.login("MTA1MTMzMTA5Mjk5MDQwMjYyNA.G1bLQG.-r1brFYETLqRwB1pyjB1IZ5j2o_MG1zSNAewCY");
//Made by Felosi @2024
