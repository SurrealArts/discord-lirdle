import { SlashCommandBuilder } from '@discordjs/builders';

export const data = new SlashCommandBuilder()
	.setName('wordle')
	.setDescription('Play Wordle (daily or random)')
	.addBooleanOption((option) =>
		option
			.setName('random')
			.setDescription('Play a random word instead of today\'s daily word')
			.setRequired(false)
	);