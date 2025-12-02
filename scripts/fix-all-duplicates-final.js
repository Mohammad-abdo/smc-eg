#!/usr/bin/env node
// Final script to remove ALL duplicate closing braces and catch blocks

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Removing ALL duplicate closing braces and catch blocks...\n');

let fixed = 0;
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i].trim();
  const prevLine = i > 0 ? lines[i - 1].trim() : '';
  const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
  const afterNext = i < lines.length - 2 ? lines[i + 2].trim() : '';
  
  // Skip duplicate }); that appears after });
  if (currentLine === '});' && prevLine === '});') {
    if (nextLine.match(/^app\.(get|post|put|delete)\(/) || nextLine.match(/^\/\/ =+/) || nextLine === '') {
      console.log(`Removing duplicate }); at line ${i + 1}`);
      fixed++;
      continue;
    }
  }
  
  // Skip standalone } before });
  if (currentLine === '}' && nextLine === '});') {
    if (afterNext.match(/^app\.(get|post|put|delete)\(/) || afterNext.match(/^\/\/ =+/) || afterNext === '') {
      console.log(`Removing standalone } at line ${i + 1}`);
      fixed++;
      continue;
    }
  }
  
  // Skip duplicate catch blocks
  if (currentLine === '} catch (error) {' && prevLine === '});') {
    if (nextLine.includes('res.status(500)')) {
      console.log(`Removing duplicate catch block at line ${i + 1}`);
      // Skip until we find the matching });
      let j = i + 1;
      while (j < lines.length && !lines[j].trim().match(/^\}\);$/)) {
        j++;
      }
      if (j < lines.length) {
        i = j; // Skip the entire catch block
        fixed++;
        continue;
      }
    }
  }
  
  newLines.push(lines[i]);
}

content = newLines.join('\n');

// Additional cleanup patterns
content = content.replace(/\n\}\);\n\n\}\);\n\n(?=app\.|\/\/ =+)/g, '\n});\n\n');
content = content.replace(/\n\}\n\}\);\n\n(?=app\.|\/\/ =+)/g, '\n});\n\n');

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`\n✅ Fixed ${fixed} syntax errors!`);

