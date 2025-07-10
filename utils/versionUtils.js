import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export function getPackageVersion(pkgPath = 'package.json') {
	const fullPath = path.resolve(pkgPath);
	const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
	return pkg.version;
}

export function isValidSemver(version) {
	return /^\d+\.\d+\.\d+$/.test(version);
}

export function syncEnvVersion(envPath = '.env') {
	const version = getPackageVersion();
	let env = '';

	try {
		env = fs.readFileSync(envPath, 'utf8');
		if (env.includes('VERSION=')) {
			env = env.replace(/VERSION=.*/g, `VERSION=${version}`);
		} else {
			env += `\nVERSION=${version}`;
		}
		fs.writeFileSync(envPath, env);
		console.log(`Synced .env VERSION to ${version}`);
	} catch (err) {
		console.error(`Failed to update .env version:`, err);
	}
}

export function updateReadmeBadge(readmePath = 'README.md') {
	const version = getPackageVersion();
	let readme = '';

	try {
		readme = fs.readFileSync(readmePath, 'utf8');

		if (readme.match(/!\[version.*?\]\(.*?\)/i)) {
			readme = readme.replace(
				/!\[version.*?\]\(.*?\)/i,
				`![version](https://img.shields.io/badge/version-${version}-blue)`
			);
			console.log('Updated existing version badge');
		} else {
			readme = `![version](https://img.shields.io/badge/version-${version}-blue)\n\n` + readme;
			console.log('Added new version badge to top of README');
		}

		fs.writeFileSync(readmePath, readme);
		console.log(`README updated to version ${version}`);
	} catch (err) {
		console.error('Failed to update README badge:', err);
	}
}

export function appendToChangelog(version, logPath = 'CHANGELOG.md') {
	const today = new Date().toISOString().split('T')[0];
	const entry = `\n## [${version}] - ${today}\n- Updated version to ${version}\n`;

	try {
		fs.appendFileSync(logPath, entry);
		console.log(`Appended ${version} to CHANGELOG.md`);
	} catch (err) {
		console.error(`Failed to update CHANGELOG.md:`, err);
	}
}

export function bumpVersionFlow() {
	const version = getPackageVersion();

	if (!isValidSemver(version)) {
		console.error(`Invalid version format: ${version}`);
		return;
	}

	console.log(`Bumping to version ${version}...`);
	syncEnvVersion();
	updateReadmeBadge();
	appendToChangelog(version);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	bumpVersionFlow();
}