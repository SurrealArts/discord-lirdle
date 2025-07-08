import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { WORDS } from './words.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usedWordsPath = path.join(__dirname, 'usedDailyWords.js');

export async function generateDailyWord(modelName) {
	let usedWords = [];
	try {
		const content = await readFile(usedWordsPath, 'utf-8');
		const match = content.match(/export const USED_DAILY_WORDS = (\[.*\]);/s);

		if (match) {
			usedWords = JSON.parse(match[1]);
		}
	} catch {
		usedWords = [];
	}

	const availableWords = WORDS.filter(word => !usedWords.includes(word));

	if (availableWords.length === 0) {
		throw new Error(`No available words left for model: ${modelName}`);
	}

	const randomIndex = Math.floor(Math.random() * availableWords.length);
	return availableWords[randomIndex];
}