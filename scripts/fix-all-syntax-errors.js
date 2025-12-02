#!/usr/bin/env node
// Fix ALL syntax errors - remove duplicate closing braces

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Fixing ALL syntax errors...\n');

let fixed = 0;
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i];
  const prevLine = i > 0 ? lines[i - 1] : '';
  const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
  
  // Skip duplicate }); that appears after });
  if (currentLine.trim() === '});' && prevLine.trim() === '});') {
    // Check if next line is app.get/post/put/delete
    if (nextLine.trim().match(/^app\.(get|post|put|delete)\(/)) {
      console.log(`Removing duplicate }); at line ${i + 1}`);
      fixed++;
      continue; // Skip this line
    }
  }
  
  // Skip duplicate }); that appears after }
  if (currentLine.trim() === '});' && prevLine.trim() === '}') {
    // Check if next line is app.get/post/put/delete
    if (nextLine.trim().match(/^app\.(get|post|put|delete)\(/)) {
      console.log(`Removing duplicate }); at line ${i + 1}`);
      fixed++;
      continue; // Skip this line
    }
  }
  
  // Skip standalone } before });
  if (currentLine.trim() === '}' && nextLine.trim() === '});') {
    const afterNext = i < lines.length - 2 ? lines[i + 2] : '';
    if (afterNext.trim().match(/^app\.(get|post|put|delete)\(/)) {
      console.log(`Removing standalone } at line ${i + 1}`);
      fixed++;
      continue; // Skip this line
    }
  }
  
  newLines.push(currentLine);
}

content = newLines.join('\n');

// Additional cleanup: remove any remaining patterns
content = content.replace(/\n\}\);\n\n\}\);\n\napp\./g, '\n});\n\napp.');
content = content.replace(/\n\}\n\}\);\n\napp\./g, '\n});\n\napp.');

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`\n✅ Fixed ${fixed} syntax errors!`);

