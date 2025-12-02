#!/usr/bin/env node
// Patch to fix syntax error at line 250 in server.js
// This script adds the missing closing brace before });

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');
const lines = content.split('\n');

console.log('🔧 Fixing syntax error at line 250...\n');

// Check line 250 (index 249)
if (lines[249] && lines[249].trim() === '});') {
  const prevLine = lines[248] ? lines[248].trim() : '';
  
  // If previous line is res.status(...) and we have }); without }, add it
  if (prevLine.includes('res.status') && prevLine.includes('json')) {
    // Check if we need to add closing brace
    if (!prevLine.endsWith('}')) {
      console.log('Adding missing closing brace before }); at line 250');
      lines.splice(249, 0, '  }');
      fixed = true;
    }
  }
}

// Also fix the specific pattern: res.status(...).json(...); followed by });
content = content.replace(
  /(\s+res\.status\(statusCode\)\.json\(errorResponse\);\s*)\}\);(\s*app\.)/g,
  '$1  }\n});$2'
);

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Syntax error at line 250 fixed!');

