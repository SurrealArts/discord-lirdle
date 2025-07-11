import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from 'discord.js';
import { readJson } from '../../utils/fileUtils.js';
import { getUserStats } from '../../models/stats.js';

export const run = async (client, interaction) => {
	const gameType = interaction.options.getString('game');
	const metric = interaction.options.getString('metric');

	const allStats = readJson('./models/stats.json').filter(
		entry => entry.gameType === gameType
	);

	const userIds = [...new Set(allStats.map(entry => entry.userId))];

	const leaderboard = userIds.map(userId => {
		const stats = getUserStats(userId, gameType);
		return {
			userId,
			value: metric === 'count' ? stats.winCount : stats.streak,
		};
	})
		.sort((a, b) => b.value - a.value);

	const page = 0;
	const embed = await createLeaderboardEmbed(client, leaderboard, gameType, metric, page);
	const row = createPaginationButtons(gameType, metric, page, leaderboard.length);

	await interaction.reply({ embeds: [embed], components: [row] });
};

export function createPaginationButtons(gameType, metric, page, totalEntries) {
	const totalPages = Math.ceil(totalEntries / 10);

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(`lb_prev_${gameType}_${metric}_${page}`)
			.setLabel('⬅️')
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page === 0),
		new ButtonBuilder()
			.setCustomId(`lb_next_${gameType}_${metric}_${page}`)
			.setLabel('➡️')
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page + 1 >= totalPages)
	);
}

export async function createLeaderboardEmbed(client, leaderboard, gameType, metric, page) {
	const start = page * 10;
	const slice = leaderboard.slice(start, start + 10);

	const lines = await Promise.all(
		slice.map(async (entry, i) => {
			const user = await client.users.fetch(entry.userId).catch(() => null);
			const name = user ? user.username : `User ${entry.userId}`;
			const label = metric === 'count' ? 'wins' : 'day streak';
			return `**${start + i + 1}.** ${name} — ${entry.value} ${label}`;
		})
	);

	return new EmbedBuilder()
		.setTitle(`🏆 ${gameType[0].toUpperCase() + gameType.slice(1)} Leaderboard`)
		.setDescription(lines.join('\n') || '*No data yet.*')
		.setFooter({ text: `Page ${page + 1} of ${Math.ceil(leaderboard.length / 10)}` })
		.setColor(0xFFD700);
}