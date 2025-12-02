#!/usr/bin/env node
// Comprehensive patch to fix ALL remaining missing closing braces
// This script automatically finds and fixes all catch blocks missing closing }

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Fixing ALL remaining missing closing braces...\n');

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
      
      // Check if we're inside a catch block by looking backwards
      let inCatchBlock = false;
      for (let j = i - 1; j >= 0 && j > i - 30; j--) {
        if (lines[j].trim().includes('} catch')) {
          inCatchBlock = true;
          break;
        }
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

