#!/usr/bin/env node
// Fix all syntax errors in server.js - remove duplicate closing braces

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Fixing syntax errors...\n');

// Remove duplicate closing braces pattern: } followed by });
// This pattern appears when script created duplicate code
const patterns = [
  // Pattern 1: } followed by }); on separate lines
  /\n\}\n\}\);\n\napp\./g,
  // Pattern 2: }); followed by }); on separate lines  
  /\n\}\);\n\n\}\n\}\);\n\napp\./g,
];

// Replace all patterns
patterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches) {
    console.log(`Found ${matches.length} matches for pattern ${index + 1}`);
    content = content.replace(pattern, '\n});\n\napp.');
  }
});

// More specific fixes
// Fix: } followed by }); before app.get/app.post/etc
content = content.replace(/\n\}\n\}\);\n\napp\.(get|post|put|delete)/g, '\n});\n\napp.$1');

// Fix: }); followed by } followed by }); before app.get/app.post/etc
content = content.replace(/\n\}\);\n\n\}\n\}\);\n\napp\.(get|post|put|delete)/g, '\n});\n\napp.$1');

// Remove any standalone } followed by }); that are not part of a function
content = content.replace(/\n\}\n\}\);\n\n(?=app\.)/g, '\n\n');

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Syntax errors fixed!');

