// import { AttachmentBuilder } from 'discord.js';
import { WORDS, OTHERWORDS } from '../words.js';
import { DAILY_LIRDLE } from '../dailyWords.js';
import { getRandomWord } from '../randomizer.js';
// import { createFeedbackImage } from '../canvas.js';
// import path from 'path';

let dailyCleared = false;
let dailyWinnerId = null;

const WORDS_SET = new Set(WORDS.map(w => w.toUpperCase()));
const OTHERWORDS_SET = new Set(OTHERWORDS.map(w => w.toUpperCase()));

export const activeGames = new Map();

export async function startLirdleGame(userId, useRandom) {
	if (!useRandom && dailyCleared) {
		return {
			alreadyCleared: true,
			winnerId: dailyWinnerId,
			word: DAILY_LIRDLE,
		};
	}

	const answer = useRandom ? getRandomWord() : DAILY_LIRDLE;

	// const blankGuesses = Array.from({ length: 6 }, () => ({
	// 	word: '',
	// 	colors: Array(5).fill('#3a3a3c'),
	// }));

	// const buffer = await createFeedbackImage(blankGuesses);
	// const attachment = new AttachmentBuilder(buffer, { name: 'lirdle-board.png' });

	activeGames.set(userId, {
		answer,
		guesses: [],
		isRandom: useRandom,
		messageIds: [],
		isComplete: false,
	});

	if (!useRandom) {
		dailyCleared = true;
		dailyWinnerId = userId;
	}

	return {
		alreadyCleared: false,
		// image: attachment,
		image: null, // placeholder
	};
}

export function submitGuess(userId, guess, force = false) {
	const game = activeGames.get(userId);
	if (!game) return { error: 'No active game found.' };

	if (game.isComplete) {
		return { error: 'This game is already finished!' };
	}

	const word = guess.toUpperCase();

	// words.js is lowercase; Model fixes everything to uppercase; lmao;
	if (!WORDS_SET.has(word) && !OTHERWORDS_SET.has(word)) {
		return { error: 'Invalid word.' };
	}

	if (game.guesses.some(g => g.word === word)) {
		return { error: 'You have already guessed that word.' };
	}

	if (OTHERWORDS_SET.has(word) && !force) {
		return { needsConfirmation: true, word };
	}

	const feedback = getFeedback(word, game.answer.toUpperCase());
	game.guesses.push({ word, feedback });

	const isCorrect = word === game.answer.toUpperCase();
	const totalGuesses = game.guesses.length;
	const page = Math.floor((totalGuesses - 1) / 6);
	const pageGuesses = game.guesses.slice(page * 6, page * 6 + 6);
	const lines = pageGuesses
		.map(g => `\`${g.word}\` ${g.feedback}`)
		.join('\n');

	if (isCorrect) {
		game.isComplete = true;
		return {
			isCorrect: true,
			page,
			description: `${lines}\n\n**Solved in ${totalGuesses} guess${totalGuesses > 1 ? 'es' : ''}!**`,
		};
	}
	
	return {
		isCorrect: false,
		page,
		description: lines,
	};
}

function getFeedback(guess, answer) {
	const result = Array(5).fill('⬛');
	const answerArr = answer.split('');
	const guessArr = guess.split('');
	const used = Array(5).fill(false);

	for (let i = 0; i < 5; i++) {
		if (guessArr[i] === answerArr[i]) {
			result[i] = '🟩';
			used[i] = true;
			guessArr[i] = null;
		}
	}

	for (let i = 0; i < 5; i++) {
		if (result[i] === '🟩' || guessArr[i] === null) continue;

		const index = answerArr.findIndex((char, j) => char === guessArr[i] && !used[j]);
		if (index !== -1) {
			result[i] = '🟨';
			used[index] = true;
		}
	}

	return result.join('');
}