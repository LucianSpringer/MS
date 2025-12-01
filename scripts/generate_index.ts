
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/core/data');
const INDEX_FILE = path.join(DATA_DIR, 'index.ts');

const files = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.ts') && file !== 'index.ts');

const exports = files.map(file => {
    const moduleName = file.replace('.ts', '');
    return `export * from './${moduleName}';`;
}).join('\n');

fs.writeFileSync(INDEX_FILE, exports);
console.log(`Generated index.ts with ${files.length} exports.`);
