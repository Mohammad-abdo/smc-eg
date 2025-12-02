#!/usr/bin/env node
// Comprehensive patch to fix ALL missing closing braces in catch blocks
// This script finds all catch blocks that end with }); and adds missing }

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Fixing ALL missing closing braces in catch blocks...\n');

let fixed = 0;

// Pattern 1: res.status(...).json(...); followed by }); without closing }
// This should be: res.status(...).json(...); } });
content = content.replace(
  /(\s+res\.status\([^)]+\)\.json\([^)]+\);\s*)\}\);(\s*(?:\/\/|app\.|module\.|if\s*\(|})))/g,
  (match, p1, p2) => {
    // Check if there's already a closing brace
    if (!p1.trim().endsWith('}')) {
      fixed++;
      return p1 + '  }\n});' + p2;
    }
    return match;
  }
);

// Pattern 2: console.error(...); res.status(...).json(...); }); without closing }
content = content.replace(
  /(\s+console\.error\([^)]+\);\s+res\.status\([^)]+\)\.json\([^)]+\);\s*)\}\);(\s*(?:\/\/|app\.|module\.|if\s*\(|})))/g,
  (match, p1, p2) => {
    if (!p1.trim().endsWith('}')) {
      fixed++;
      return p1 + '  }\n});' + p2;
    }
    return match;
  }
);

// Pattern 3: Any line ending with .json(...); followed by }); on next line
content = content.replace(
  /(\s+[^}]+\.json\([^)]+\);\s*)\n\}\);(\s*(?:\/\/|app\.|module\.|if\s*\(|})))/g,
  (match, p1, p2) => {
    const prevLine = p1.trim();
    if (prevLine.includes('res.status') || prevLine.includes('res.json')) {
      if (!prevLine.endsWith('}')) {
        fixed++;
        return p1 + '\n  }\n});' + p2;
      }
    }
    return match;
  }
);

fs.writeFileSync(serverPath, content, 'utf8');
console.log(`✅ Fixed ${fixed} missing closing braces!`);

