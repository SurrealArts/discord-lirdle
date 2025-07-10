import fs from 'fs';
import path from 'path';

export function getPackageVersion() {
	const pkgPath = path.resolve('package.json');
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	return pkg.version;
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
		console.log(`✅ Synced .env VERSION to ${version}`);
	} catch (err) {
		console.error(`❌ Failed to update .env version:`, err);
	}
}

export function updateReadmeBadge(readmePath = 'README.md') {
	const version = getPackageVersion();
	let readme = '';

	try {
		readme = fs.readFileSync(readmePath, 'utf8');
		readme = readme.replace(
			/\[!\[version.*\]\(.*\)\]/i,
			`![version](https://img.shields.io/badge/version-${version}-blue)`
		);
		fs.writeFileSync(readmePath, readme);
		console.log(`✅ Updated README version badge to ${version}`);
	} catch (err) {
		console.error(`❌ Failed to update README badge:`, err);
	}
}

export function isValidSemver(version) {
	return /^\d+\.\d+\.\d+$/.test(version);
}

export function appendToChangelog(version, logPath = 'CHANGELOG.md') {
	const today = new Date().toISOString().split('T')[0];
	const entry = `\n## [${version}] - ${today}\n- Updated version to ${version}\n`;

	try {
		fs.appendFileSync(logPath, entry);
		console.log(`✅ Appended ${version} to CHANGELOG.md`);
	} catch (err) {
		console.error(`❌ Failed to update CHANGELOG.md:`, err);
	}
}