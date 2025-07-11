import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
	.setName('lb')
	.setDescription('View the leaderboard for a game variant.')
	.addStringOption(option =>
		option
			.setName('game')
			.setDescription('Which game variant?')
			.setRequired(true)
			.addChoices(
				{ name: 'Lirdle', value: 'lirdle' },
				{ name: 'Wordle', value: 'wordle' },
			)
	)
	.addStringOption(option =>
		option
			.setName('metric')
			.setDescription('Choose the leaderboard metric')
			.setRequired(true)
			.addChoices(
				{ name: 'Win Count', value: 'count' },
				{ name: 'Win Streak', value: 'streak' },
			)
	);