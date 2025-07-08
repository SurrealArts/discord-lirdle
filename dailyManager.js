import { readdir, stat, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDailyWord } from './models/daily.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsPath = path.join(__dirname, './models');
const dailyWordsPath = path.join(modelsPath, 'dailyWords.js');
const usedWordsPath = path.join(modelsPath, 'usedDailyWords.js');

let lastDate = new Date().toDateString();

export default async (client) => {
	console.log('[DailyManager] Initialized');
	client.once('ready', async () => {
		console.log('[DailyManager] Checking Daily Words...');
		await refreshDailyWordsIfNeeded();
		setInterval(refreshDailyWordsIfNeeded, 5 * 1000);
	});
};

async function refreshDailyWordsIfNeeded() {
	const currentDate = new Date().toDateString();
	if (currentDate === lastDate) return;

	lastDate = currentDate;

	let oldWords = [];
	try {
		const content = await readFile(dailyWordsPath, 'utf-8');
		const match = content.match(/export const DAILY_WORDS = (\[.*\]);/s);

		if (match) {
			oldWords = JSON.parse(match[1]);
		}
	} catch {
		oldWords = [];
	}

	if (oldWords.length > 0) {
		const usedPath = usedWordsPath;
		const usedContent = await readFile(usedPath, 'utf-8').catch(() => 'export const USED_DAILY_WORDS = [];\n');
		const usedMatch = usedContent.match(/export const USED_DAILY_WORDS = (\[.*\]);/s);

		let usedWords = usedMatch ? JSON.parse(usedMatch[1]) : [];
		usedWords.push(...oldWords);
		await writeFile(usedPath, `export const USED_DAILY_WORDS = ${JSON.stringify(usedWords, null, 2)};\n`);
	}

	const folders = await readdir(modelsPath, { withFileTypes: true });
	const modelFolders = folders.filter(dirent =>
		dirent.isDirectory() &&
		dirent.name !== 'usedDailyWords' &&
		dirent.name !== 'dailyWords'
	);

	const validModels = [];
	for (const folder of modelFolders) {
		const modelPath = path.join(modelsPath, folder.name, 'model.js');
		try {
			const stats = await stat(modelPath);
			if (stats.isFile()) {
				validModels.push(folder.name);
			}
		} catch {
			continue;
		}
	}

	const lines = [];
	for (const modelName of validModels) {
		const word = await generateDailyWord(modelName);
		const constName = `DAILY_${modelName.toUpperCase()}`;
		lines.push(`export const ${constName} = '${word}';`);
	}

	await writeFile(dailyWordsPath, lines.join('\n') + '\n');
	console.log(`[DailyManager] Refreshed daily words for ${currentDate}`);
}