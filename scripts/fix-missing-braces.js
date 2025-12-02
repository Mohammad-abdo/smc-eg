#!/usr/bin/env node
// Fix missing closing braces after catch blocks

const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '../server.js');
let content = fs.readFileSync(serverPath, 'utf8');

console.log('🔧 Fixing missing closing braces...\n');

// Fix pattern: } catch (error) { ... }); without closing }
content = content.replace(/  \} catch \(error\) \{[\s\S]*?res\.status\(500\)\.json\(\{ error: error\.message \}\);[\s\S]*?\}\);[\s\n]*/g, (match) => {
  // Check if there's a closing } before });
  if (!match.includes('  }\n});')) {
    // Add missing closing brace
    return match.replace(/res\.status\(500\)\.json\(\{ error: error\.message \}\);[\s\n]*\}\);/g, 'res.status(500).json({ error: error.message });\n  }\n});');
  }
  return match;
});

// More specific fix: } catch (error) { ... }); -> } catch (error) { ... } }
content = content.replace(/  \} catch \(error\) \{[\s\S]*?res\.status\(500\)\.json\(\{ error: error\.message \}\);[\s\n]*\}\);/g, (match) => {
  if (!match.match(/  \}\n\}\);/)) {
    return match.replace(/res\.status\(500\)\.json\(\{ error: error\.message \}\);[\s\n]*\}\);/g, 'res.status(500).json({ error: error.message });\n  }\n});');
  }
  return match;
});

fs.writeFileSync(serverPath, content, 'utf8');
console.log('✅ Fixed missing closing braces!');

