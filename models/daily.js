import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';
import { WORDS } from './words.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usedWordsPath = path.join(__dirname, 'usedDailyWords.json');

export async function generateDailyWord(modelName) {
	let usedRecords = [];
	try {
		const raw = await readFile(usedWordsPath, 'utf-8');
		usedRecords = JSON.parse(raw);
	} catch {
		usedRecords = [];
	}

	const usedWords = usedRecords
		.filter(record => record.model === modelName)
		.map(record => record.word.toLowerCase());

	const availableWords = WORDS.filter(word => !usedWords.includes(word.toLowerCase()));

	if (availableWords.length === 0) {
		throw new Error(`No available words left for model: ${modelName}`);
	}

	const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];

	usedRecords.push({
		word: selectedWord,
		timestamp: new Date().toISOString(),
		model: modelName,
	});

	await writeFile(usedWordsPath, JSON.stringify(usedRecords, null, 2));
	return selectedWord;
}