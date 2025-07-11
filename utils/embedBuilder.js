import { EmbedBuilder } from 'discord.js';

export function createResultEmbed(title, content, color = 0x00ff99) {
	const embed = new EmbedBuilder().setTitle(title).setColor(color);

	if (content?.trim().length > 0) {
		embed.setDescription(content);
	} else {
		embed.setDescription('No result content.');
	}

	return embed;
}

export function createErrorEmbed(errorMessage = 'Something went wrong.') {
	return new EmbedBuilder()
		.setTitle('❌ Error')
		.setDescription(errorMessage)
		.setColor(0xff4444);
}

// to be used soon yaaa
// export function createConfirmationEmbed(prompt, color = 0xffff00) {
// 	return new EmbedBuilder()
// 		.setTitle('⚠️ Confirmation Required')
// 		.setDescription(prompt)
// 		.setColor(color);
// }