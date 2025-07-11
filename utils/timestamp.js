export function getTodayISO() {
	return new Date().toISOString().slice(0, 10); // e.g. "2025-07-11"
}

export function isSameDay(dateA, dateB) {
	return dateA.slice(0, 10) === dateB.slice(0, 10);
}