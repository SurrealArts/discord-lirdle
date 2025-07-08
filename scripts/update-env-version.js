import fs from 'fs';

const envPath = '.env';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = pkg.version;

let env = fs.readFileSync(envPath, 'utf8');

if (env.includes('VERSION=')) {
	env = env.replace(/VERSION=.*/g, `VERSION=${version}`);
} else {
	env += `\nVERSION=${version}`;
}

fs.writeFileSync(envPath, env);
console.log(`✅ Updated .env VERSION to ${version}`);