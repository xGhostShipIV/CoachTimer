const fs = require('fs');
const path = require('path');

const soundsDir = path.join(__dirname, '../assets/sounds');
const outputFile = path.join(__dirname, '../constants/asset-constants.tsx');
const allowedExtensions = new Set(['.mp3', '.wav', '.aac', '.m4a', '.flac', '.ogg']);

if (!fs.existsSync(soundsDir)) {
  throw new Error(`Sounds directory not found: ${soundsDir}`);
}

const soundFiles = fs.readdirSync(soundsDir)
  .filter((fileName) => {
    const filePath = path.join(soundsDir, fileName);
    return fs.statSync(filePath).isFile() && allowedExtensions.has(path.extname(fileName).toLowerCase());
  })
  .sort();

if (soundFiles.length === 0) {
  throw new Error(`No sound files found in ${soundsDir}`);
}

const sfxNames = soundFiles.map((fileName) => path.basename(fileName, path.extname(fileName)));
const requireEntries = soundFiles.map((fileName) => `require("../assets/sounds/${fileName.replace(/\\/g, '/')}")`);

const fileContent = `// GENERATED FILE - DO NOT EDIT.
// This file is created by scripts/generate-sfx-name-constants.js

export const sfxNames: string[] = [
${sfxNames.map((name) => `  '${name}',`).join('\n')}
];

export const NOTIFICATION_URLS = [
${requireEntries.map((entry) => `  ${entry},`).join('\n')}
];
`;

fs.writeFileSync(outputFile, fileContent, 'utf8');
console.log(`Wrote ${soundFiles.length} sound entries to ${outputFile}`);
