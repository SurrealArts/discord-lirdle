import { 
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
} from 'discord.js';
import { startLirdleGame, activeGames } from '../models/lirdle/model.js';

export const run = async (client, interaction) => {
	try {
		const useRandom = interaction.options.getBoolean('random') ?? false;
		const userId = interaction.user.id;

		const game = await startLirdleGame(interaction.user.id, useRandom);

		if (game.alreadyCleared) {
			const embed = new EmbedBuilder()
				.setTitle('Lirdle (Daily)')
				.setDescription(
					`Today's word has already been solved by **<@${game.winnerId}>**!\n\n**Word:** \`${game.word}\``)
				.setColor(0x2F3136);

			await interaction.reply({
				embeds: [embed],
				// flags: MessageFlags.Ephemeral,
			});

			return;
		}

		// const attachment = game.image;
		const embed = new EmbedBuilder()
			.setTitle(useRandom ? 'Lirdle (Random)' : 'Lirdle (Daily)')
			.setDescription(`Start guessing by clicking the button below!`)
			// .setImage(`attachment://${attachment.name}`)
			.setColor(0x5865F2);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId(`lirdle_guess_${userId}`)
				.setLabel('Guess')
				.setStyle(ButtonStyle.Primary),
		);

		await interaction.reply({
			embeds: [embed],
			// files: [attachment],
			components: [row],
		});
		const reply = await interaction.fetchReply();

		const active = activeGames.get(userId);
		if (active) {
			active.messageIds.push(reply.id);
		}

	} catch (error) {
		console.error('[Lirdle] Error starting Lirdle:', error);
		await interaction.reply({
			content: 'There was an error starting the Lirdle game.',
			flags: MessageFlags.Ephemeral,
		});
	}
}