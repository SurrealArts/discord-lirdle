import { MessageFlags } from 'discord.js';
import { createErrorEmbed } from '../../utils/embedBuilder.js';

export const run = async (client, interaction) => {
	// eslint-disable-next-line no-unused-vars
	const [_, action, userId] = interaction.customId.split('_');
	if (interaction.user.id !== userId) {
		await interaction.reply({
			embeds: [createErrorEmbed('This is not your game!')],
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	await interaction.update({
			embeds: [createErrorEmbed('Guess cancelled.')],
		components: [],
	});
}