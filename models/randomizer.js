import { WORDS } from './words.js';

export function getRandomWord() {
	const index = Math.floor(Math.random() * WORDS.length);
	console.log(WORDS[index]);
	return WORDS[index]; // toggleDevCheats = true;
}