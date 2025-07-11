export function createWordSets(words, otherWords) {
	const mainSet = new Set(words.map(w => w.toUpperCase()));
	const extraSet = new Set(otherWords.map(w => w.toUpperCase()));
	return { mainSet, extraSet };
}

export function validateGuess(word, mainSet, extraSet) {
	const guess = word.toUpperCase();

	if (!mainSet.has(guess) && !extraSet.has(guess)) {
		return { status: 'invalid' };
	}

	if (extraSet.has(guess)) {
		return { status: 'extra', needsConfirmation: true };
	}

	return { status: 'valid' };
}