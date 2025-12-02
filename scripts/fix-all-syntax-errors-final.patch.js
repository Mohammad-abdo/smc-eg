#!/usr/bin/env node
// Final comprehensive patch to fix ALL syntax errors
// Adds missing closing braces in catch blocks

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Fixing ALL missing closing braces in catch blocks...\n');

let fixed = 0;
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i];
  const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
  const prevLine = i > 0 ? lines[i - 1] : '';
  
  // Check if current line is }); and previous line is res.status(...).json(...);
  if (currentLine.trim() === '});' && prevLine.trim().includes('res.status') && prevLine.trim().includes('json')) {
    // Check if we need to add closing brace
    if (!prevLine.trim().endsWith('}')) {
      // Check if the line before prevLine doesn't end with }
      const lineBeforePrev = i > 1 ? lines[i - 2] : '';
      if (!lineBeforePrev.trim().endsWith('}')) {
        console.log(`Adding missing closing brace before }); at line ${i + 1}`);
        newLines.push('  }');
        fixed++;
      }
    }
  }
  
  newLines.push(currentLine);
}

content = newLines.join('\n');

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`✅ Fixed ${fixed} missing closing braces!`);

