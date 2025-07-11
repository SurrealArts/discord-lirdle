import { readJson, writeJson } from '../utils/fileUtils.js';
import { getTodayISO, isSameDay } from '../utils/timestamp.js';

const STATS_PATH = './models/stats.json';

export function recordDailyWin(userId, gameType, word) {
	const stats = readJson(STATS_PATH);
	const today = getTodayISO();

	const alreadyRecorded = stats.some(
		entry =>
			entry.userId === userId &&
			entry.gameType === gameType &&
			isSameDay(entry.date, today)
	);

	if (!alreadyRecorded) {
		stats.push({ userId, gameType, word, date: today });
		writeJson(STATS_PATH, stats);
	}
}


export function hasSolvedToday(userId, gameType) {
	const stats = readJson(STATS_PATH);
	const today = getTodayISO();

	return stats.some(
		entry =>
			entry.userId === userId &&
			entry.gameType === gameType &&
			isSameDay(entry.date, today)
	);
}

export function getUserStats(userId, gameType) {
	const stats = readJson(STATS_PATH)
		.filter(entry => entry.userId === userId && entry.gameType === gameType)
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	let winCount = stats.length;
	let streak = 1;

	for (let i = winCount - 2; i >= 0; i--) {
		const dateA = new Date(stats[i].date);
		const dateB = new Date(stats[i + 1].date);
		const diff = Math.round((dateB - dateA) / 86400000);

		if (diff === 1) {
			streak++;
		} else {
			break;
		}
	}

	return { winCount, streak };
}