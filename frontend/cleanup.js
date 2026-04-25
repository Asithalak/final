const fs = require('fs');
const path = require('path');

// Remove node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('Removing node_modules...');
  fs.rmSync(nodeModulesPath, { recursive: true, force: true });
  console.log('✓ node_modules removed');
} else {
  console.log('node_modules not found');
}

// Remove package-lock.json to ensure fresh install
const lockPath = path.join(__dirname, 'package-lock.json');
if (fs.existsSync(lockPath)) {
  console.log('Removing package-lock.json...');
  fs.unlinkSync(lockPath);
  console.log('✓ package-lock.json removed');
}

console.log('\nCleanup complete. Now run: npm install');
