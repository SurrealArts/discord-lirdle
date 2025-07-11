export function formatGuessLine(word, feedback) {
	return `\`${word.toUpperCase()}\` ${feedback}`;
}

export function formatGuessBlock(guesses, pageSize) {
	const totalGuesses = guesses.length;
	const page = Math.floor((totalGuesses - 1) / pageSize);
	const pageGuesses = guesses.slice(page * pageSize, page * pageSize + pageSize);
	const lines = pageGuesses
		.map(g => `\`${g.word.toUpperCase()}\` ${g.feedback}`)
		.join('\n');

	return { lines, page, totalGuesses };
}