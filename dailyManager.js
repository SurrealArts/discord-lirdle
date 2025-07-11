import { readdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateDailyWord } from './models/daily.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsPath = path.join(__dirname, './models');
const dailyWordsPath = path.join(modelsPath, 'dailyWords.js');

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

	const folders = await readdir(modelsPath, { withFileTypes: true });
	const modelFolders = folders.filter(dirent =>
		dirent.isDirectory() &&
		dirent.name !== 'stats' &&
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