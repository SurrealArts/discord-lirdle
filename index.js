import { clientid, token } from './config.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readdirSync, readdir } from 'fs';
import {
	Client, 
	GatewayIntentBits, 
	// Collection, 
	// MessageFlags 
} from 'discord.js';
import dailyManager from './dailyManager.js';
const cmds = [];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
	],
});

client.once('ready', async () => {
	console.log(`[INDEX] Logged in as ${client.user.tag}!`);

	const commands = [];
	const commandFiles = readdirSync('./commands')
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = await import(`./commands/${file}`);
		commands.push(command.data.toJSON());
	}

	// client.interactions = new Collection();
	// const interactionFiles = readdirSync('./interactions')
	// 	.filter((file) => file.endsWith('.js'));
	// for (const file of interactionFiles) {
	// 	const interaction = await import(`./interactions/${file}`);
	// 	client.interactions.set(file.split('.')[0], interaction.run);
	// }

	// client.on('interactionCreate', async (interaction) => {
	// 	if (!interaction.isCommand()) return;

	// 	const handler = client.interactions.get(interaction.commandName);
	// 	if (!handler) return;

	// 	try {
	// 		await handler(client, interaction);
	// 	} catch (error) {
	// 		console.error(error);
	// 		await interaction.reply({
	// 			content: 'There was an error while executing this command!',
	// 			flags: MessageFlags.Ephemeral,
	// 		});
	// 	}
	// });

	const rest = new REST({
		version: '10'
	}).setToken(token);

	(async () => {
		try {
			console.log('[INDEX] Started refreshing application (/) commands.');

			// UNCOMMENT TO DELETE
			/* await rest.get(Routes.applicationCommands(clientid)).then((data) => {
				const promises = [];
				for (const command of data) {
					const deleteUrl = `${Routes.applicationCommands(clientid)}/${command.id
						}`;
					cmds.push(command);
					promises.push(rest.delete(deleteUrl));
				}
				return Promise.all(promises);
			}); */

			await rest.get(Routes.applicationCommands(clientid)).then((data) => {
				for (const command of data) {
					cmds.push(command);
				}
			});

			await rest.put(Routes.applicationCommands(clientid), {
				body: commands
			});

			console.log('[INDEX] Successfully reloaded application (/) commands.');
		} catch (error) {
			console.error(error);
		}
	})();
	client.user.setPresence({
		activities: [{
			name: 'lirdle',
			type: 'PLAYING',
			url: 'https://google.com',
		}, ],
		status: 'online',
	});
});

client.once('reconnecting', () => {
	console.log('[INDEX] Bot Reconnecting...');
});

client.once('disconnect', () => {
	console.log('[INDEX] Bot Disconnected.');
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.mentions.has(client.user, {
		ignoreEveryone: true
	})) return;
});

readdir('./events/', (err, files) => {
	if (err) return console.error;
	files.forEach(async (file) => {
		if (!file.endsWith('.js')) return;
		const evt = await import(`./events/${file}`);
		let evtName = file.split('.')[0];
		console.log(`[Events] Loaded event '${evtName}'`);
		client.on(evtName, evt.default.bind(null, client));
	});
});

dailyManager(client);

client.login(token);

export default {
	cmds,
};