import fs from 'fs';

export function readJson(path) {
	try {
		return JSON.parse(fs.readFileSync(path, 'utf8'));
	} catch {
		return [];
	}
}

export function writeJson(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}