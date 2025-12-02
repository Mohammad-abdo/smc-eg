#!/usr/bin/env node
// Final comprehensive patch to fix ALL missing closing braces
// This script automatically finds and fixes all catch blocks missing closing }

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
  const prevPrevLine = i > 1 ? lines[i - 2] : '';
  
  // Check if current line is }); 
  if (currentLine.trim() === '});') {
    const prevTrimmed = prevLine.trim();
    
    // Check if previous line ends with res.status(...).json(...); or res.json(...);
    if ((prevTrimmed.includes('res.status') || prevTrimmed.includes('res.json')) && 
        prevTrimmed.includes('json') && 
        prevTrimmed.endsWith(');')) {
      
      // Check if we need to add closing brace
      // Look at the line before prevLine to see if it ends with }
      const prevPrevTrimmed = prevPrevLine.trim();
      
      // If the line before doesn't end with }, we need to add it
      if (!prevPrevTrimmed.endsWith('}') && !prevTrimmed.endsWith('}')) {
        // Check if this is inside a catch block (look for } catch above)
        let foundCatch = false;
        for (let j = i - 1; j >= 0 && j > i - 20; j--) {
          if (lines[j].trim().includes('} catch')) {
            foundCatch = true;
            break;
          }
        }
        
        if (foundCatch) {
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

