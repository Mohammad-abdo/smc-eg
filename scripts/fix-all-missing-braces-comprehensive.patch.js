#!/usr/bin/env node
// Comprehensive patch to fix ALL missing closing braces
// Finds all catch blocks ending with }); and adds missing }

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Fixing ALL missing closing braces...\n');

let fixed = 0;
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i];
  const prevLine = i > 0 ? lines[i - 1] : '';
  const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
  
  // Pattern: line ending with }); and previous line has res.status or res.json
  if (currentLine.trim() === '});') {
    const prevTrimmed = prevLine.trim();
    
    // Check if previous line is res.status(...).json(...); or similar
    if ((prevTrimmed.includes('res.status') || prevTrimmed.includes('res.json')) && 
        prevTrimmed.includes('json') && 
        !prevTrimmed.endsWith('}')) {
      
      // Check line before that
      const lineBeforePrev = i > 1 ? lines[i - 2].trim() : '';
      
      // Only add if we don't already have a closing brace
      if (!lineBeforePrev.endsWith('}') && !prevTrimmed.endsWith('}')) {
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

