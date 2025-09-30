#!/usr/bin/env node
import { readFileSync } from 'fs';

function isTargetFile(path) {
  return /\.(ts|tsx|vue|js|jsx)$/.test(path);
}

function checkFile(path) {
  const text = readFileSync(path, 'utf8');
  const errors = [];
  // Match JSDoc blocks /** ... */ including newlines (non-greedy)
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  let match;
  let offset = 0;
  while ((match = jsdocRegex.exec(text)) !== null) {
    const block = match[1];
    const blockStartIndex = match.index;
    const before = text.slice(0, blockStartIndex);
    const line = before.split(/\r?\n/).length;
    // If block contains @zh_CN, ensure it also contains @en_US
    if (/@zh_CN/.test(block) && !/@en_US/.test(block)) {
      errors.push({ line, message: 'Found @zh_CN without matching @en_US in JSDoc block' });
    }
  }
  return errors.map((e) => `${path}:${e.line} ${e.message}`);
}

function main() {
  const args = process.argv.slice(2);
  const files = args.filter(isTargetFile);
  let violations = [];
  for (const f of files) {
    try {
      violations = violations.concat(checkFile(f));
    } catch (e) {
      // Ignore unreadable files
    }
  }
  if (violations.length) {
    console.error('\u001b[31mBilingual comment check failed:\u001b[0m');
    for (const v of violations) console.error('  -', v);
    console.error('\nAdd a matching @en_US line next to each @zh_CN inside the same JSDoc block.');
    process.exit(1);
  } else {
    console.log('Bilingual comment check passed.');
  }
}

main();
