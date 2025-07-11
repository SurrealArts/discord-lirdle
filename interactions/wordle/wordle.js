import { 
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageFlags,
} from 'discord.js';
import { startWordleGame, activeGames } from '../../models/wordle/model.js';
import { hasSolvedToday, getUserStats } from '../../models/stats.js';
import { DAILY_WORDLE } from '../../models/dailyWords.js';
import { getTodayISO, isSameDay } from '../../utils/timestamp.js';
import { readJson } from '../../utils/fileUtils.js';

export const run = async (client, interaction) => {
	try {
		const useRandom = interaction.options.getBoolean('random') ?? false;
		const userId = interaction.user.id;

		if (!useRandom) {
			const today = getTodayISO();
			const allEntries = readJson('./models/stats.json').filter(
				entry => entry.gameType === 'wordle' && isSameDay(entry.date, today)
			);

			const youSolved = hasSolvedToday(userId, 'wordle');

			if (youSolved) {
				const { winCount, streak } = getUserStats(userId, 'wordle');

				const embed = new EmbedBuilder()
					.setTitle('Wordle (Daily)')
					.setDescription(
						`✅ You've already solved today's Wordle!\n\n🧠 Word: \`${DAILY_WORDLE}\`\n🏆 Wins: ${winCount}\n🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}`
					)
					.setColor(0x2F3136);

				await interaction.reply({ embeds: [embed] });
				return;
			}

			if (allEntries.length > 0) {
				const { userId: winnerId, word } = allEntries[0];
				const { winCount, streak } = getUserStats(winnerId, 'wordle');

				const embed = new EmbedBuilder()
					.setTitle('Wordle (Daily)')
					.setDescription(
						`🟢 Today's Wordle has already been solved!\n\n👤 Solver: <@${winnerId}>\n🧠 Word: \`${word}\`\n🏆 Total Wins: ${winCount}\n🔥 Streak: ${streak} day${streak > 1 ? 's' : ''}`
					)
					.setColor(0x2F3136);

				await interaction.reply({ embeds: [embed] });
				return;
			}
		}

		// eslint-disable-next-line no-unused-vars
		const game = await startWordleGame(userId, useRandom);

		// const attachment = game.image;
		const embed = new EmbedBuilder()
			.setTitle(useRandom ? 'Wordle (Random)' : 'Wordle (Daily)')
			.setDescription(`Start guessing by clicking the button below!`)
			// .setImage(`attachment://${attachment.name}`)
			.setColor(0x5865F2);

		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId(`wordle_guess_${userId}`)
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
		console.error('[Wordle] Error starting Lirdle:', error);
		await interaction.reply({
			content: 'There was an error starting the Lirdle game.',
			flags: MessageFlags.Ephemeral,
		});
	}
}