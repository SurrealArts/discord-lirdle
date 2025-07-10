import { readdirSync } from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

function getInteractionFiles(dir) {
	const entries = readdirSync(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const subFiles = getInteractionFiles(fullPath);
			files.push(...subFiles);
		} else if (entry.isFile() && entry.name.endsWith('.js')) {
			files.push(fullPath);
		}
	}

	return files;
}

const interactionFiles = getInteractionFiles('./interactions');

export default async (client, interaction) => {
	try {
		let fileMatch;

		if (interaction.isChatInputCommand()) {
			fileMatch = interactionFiles.find(file => 
				path.basename(file) === `${interaction.commandName}.js`
			);
		} else if (interaction.isButton() || interaction.isModalSubmit()) {
			const [prefix, action] = interaction.customId.split('_');
			fileMatch = interactionFiles.find(file => 
				path.basename(file) === `${prefix}_${action}.js`
			);
		} else {
			// For other types of interactions (TBA);
			return;
		}

		if (!fileMatch) {
			console.error(`[InteractionCreate] The interaction file was not found for interaction: ${interaction.customId || interaction.commandName}`);
			return;
		}

		const moduleURL = pathToFileURL(fileMatch);
		const { run } = await import(moduleURL.href);
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
