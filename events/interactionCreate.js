import { readdirSync } from 'fs';

const interactionFiles = readdirSync('./interactions')
	.filter((file) => file.endsWith('.js'));

export default async (client, interaction) => {
	try {
		let fileName;

		if (interaction.isChatInputCommand()) {
			fileName = `${interaction.commandName}.js`;
		} else if (interaction.isButton() || interaction.isModalSubmit()) {
			const [prefix, action] = interaction.customId.split('_');
			fileName = `${prefix}_${action}.js`;
		} else {
			// For other types of interactions (TBA);
			return;
		}

		if (!interactionFiles.includes(fileName)) {
			console.error(`[InteractionCreate] The interaction file ${fileName} was not found.`);
			return;
		}

		const { run } = await import(`../interactions/${fileName}`);
		await run(client, interaction);
	} catch (err) {
		console.error('[InteractionCreate] Error handling interaction:', err);
	}
	// if (interaction.isCommand()) {
	// 	if (
	// 		interactionFiles.find(
	// 			(filename) => filename === `${interaction.commandName}.js`
	// 		)
	// 	) {
	// 		const { run } = await import(`../interactions/${interaction.commandName}.js`);
	// 		await run(client, interaction);
	// 		return;
	// 	} else {
	// 		console.error('[InteractionCreate] The interaction file was not found.');
	// 		return;
	// 	}
	// } else if (interaction.isButton()) {
	// 	if (
	// 		interactionFiles.find(
	// 			(filename) => filename === `${interaction.customId}.js`
	// 		)
	// 	) {
	// 		const { run } = await import(`../interactions/${interaction.customId}.js`);
	// 		await run(client, interaction);
	// 		return;
	// 	} else {
	// 		console.error('[InteractionCreate] The interaction file was not found.');
	// 		return;
	// 	}
	// } else {
	// 	return;
	// }
};
