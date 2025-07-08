import { activeGames, submitGuess } from '../models/lirdle/model.js';
import { 
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
} from 'discord.js';

export const run = async (client, interaction) => {
	// eslint-disable-next-line no-unused-vars
	const [_, action, userId] = interaction.customId.split('_');
	if (interaction.user.id !== userId) {
		await interaction.reply({
			content: 'This is not your game!',
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const originalMessage = interaction.message;
	const match = originalMessage.content.match(/`([A-Z]{5})`/);
	const guess = match?.[1];

	if (!guess) {
		await interaction.reply({
			content: '⚠️ Could not retrieve the guess word.',
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const result = submitGuess(userId, guess, true);
	const game = activeGames.get(userId);

	if (!game) {
		await interaction.update({
			content: '⚠️ Game not found.',
			components: [],
		});
		return;
	}

	const { isCorrect, page, description } = result;

	if (page > 0 && game.messageIds[page - 1]) {
		const prevMessage = await interaction.channel.messages.fetch(game.messageIds[page - 1]);
		await prevMessage.edit({ components: [] });
	}

	if (isCorrect) {
		const lastMessageId = game.messageIds.at(-1);
		if (lastMessageId) {
			const lastMessage = await interaction.channel.messages.fetch(lastMessageId);
			await lastMessage.edit({ components: [] });
		}

		const embed = new EmbedBuilder()
			.setColor(0x57F287)
			.setTitle('🎉 You solved it!')
			.setDescription(`\`${game.guesses.at(-1).word}\` 🟩🟩🟩🟩🟩\n\n**You solved it in ${game.guesses.length} guess${game.guesses.length > 1 ? 'es' : ''}!**`)
			.setFooter({ text: 'Game Complete' });
		
		const message = await interaction.channel.send({ embeds: [embed] });
		game.messageIds.push(message.id);
	} else if (game.messageIds[page]) {
		const message = await interaction.channel.messages.fetch(game.messageIds[page]);
		const original = message.embeds[0];
		const embed = new EmbedBuilder(original)
			.setDescription(description)
			.setTitle(original.title ?? null);
		await message.edit({ embeds: [embed] });
	} else {
		const embed = new EmbedBuilder()
			.setDescription(description)
			.setColor(0x5865F2);
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId(`lirdle_guess_${userId}`)
				.setLabel('Guess')
				.setStyle(ButtonStyle.Primary)
		);
		const newMessage = await interaction.channel.send({
			embeds: [embed],
			components: [row],
		});
		game.messageIds.push(newMessage.id);
	}

	await interaction.update({
		content: `✅ \`${guess}\` confirmed and submitted.`,
		components: [],
	});
}