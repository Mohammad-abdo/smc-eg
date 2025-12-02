#!/usr/bin/env node
// Ultimate comprehensive patch to fix ALL missing closing braces
// This script finds all catch blocks ending with }); and adds missing }

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
  const prevLine = i > 0 ? lines[i - 1] : '';
  
  // Check if current line is }); 
  if (currentLine.trim() === '});') {
    const prevTrimmed = prevLine.trim();
    
    // Check if previous line has res.status(...).json(...); or res.json(...);
    if ((prevTrimmed.includes('res.status') || prevTrimmed.includes('res.json')) && 
        prevTrimmed.includes('json') && 
        prevTrimmed.endsWith(');')) {
      
      // Check if we're inside a catch block
      let inCatchBlock = false;
      let braceCount = 0;
      for (let j = i - 1; j >= 0 && j > i - 50; j--) {
        const line = lines[j].trim();
        if (line.includes('} catch')) {
          inCatchBlock = true;
          break;
        }
        if (line === '}') braceCount++;
        if (line === '{') braceCount--;
      }
      
      if (inCatchBlock) {
        // Check if we need to add closing brace
        const lineBeforePrev = i > 1 ? lines[i - 2].trim() : '';
        if (!lineBeforePrev.endsWith('}') && !prevTrimmed.endsWith('}')) {
          console.log(`Adding missing closing brace before }); at line ${i + 1}`);
          newLines.push('  }');
          fixed++;
        }
      }
    }
  }
  
  newLines.push(currentLine);
}

content = newLines.join('\n');

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`✅ Fixed ${fixed} missing closing braces!`);

