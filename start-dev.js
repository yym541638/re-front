const { execSync } = require('child_process');

try {
  console.log('Starting development server...');
  const output = execSync('node node_modules/@vue/cli-service/bin/vue-cli-service.js serve', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  console.log(output);
} catch (error) {
  console.error('Error starting development server:', error.message);
  console.error('Exit code:', error.status);
  console.error('Stderr:', error.stderr ? error.stderr.toString() : 'No stderr');
}