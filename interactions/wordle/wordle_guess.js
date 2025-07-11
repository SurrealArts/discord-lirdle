import {
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle, 
	ActionRowBuilder,
	MessageFlags,
} from 'discord.js';

export const run = async (client, interaction) => {
	// eslint-disable-next-line no-unused-vars
	const [_, __, userId] = interaction.customId.split('_');
	if (interaction.user.id !== userId) {
		await interaction.reply({
			content: 'This is not your game!',
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const modal = new ModalBuilder()
		.setCustomId(`wordle_submit_${userId}`)
		.setTitle('Enter Your Guess');

	const input = new TextInputBuilder()
		.setCustomId('guess')
		.setLabel('Your 5-Letter word')
		.setStyle(TextInputStyle.Short)
		.setRequired(true)
		.setMaxLength(5)
		.setMinLength(5)
		.setPlaceholder('e.g. CRANE');

	modal.addComponents(new ActionRowBuilder().addComponents(input));

	await interaction.showModal(modal);
}