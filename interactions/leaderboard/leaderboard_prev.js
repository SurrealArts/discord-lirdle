import { createLeaderboardEmbed, createPaginationButtons } from './leaderboard.js';
import { readJson } from '../../utils/fileUtils.js';
import { getUserStats } from '../../models/stats.js';

export const run = async (client, interaction) => {
	const [gameType, metric, currentPageStr] = interaction.customId.split('_').slice(2);
	const currentPage = parseInt(currentPageStr);
	const newPage = currentPage - 1;

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
	}).sort((a, b) => b.value - a.value);

	const embed = await createLeaderboardEmbed(client, leaderboard, gameType, metric, newPage);
	const row = createPaginationButtons(gameType, metric, newPage, leaderboard.length);

	await interaction.update({ embeds: [embed], components: [row] });
};