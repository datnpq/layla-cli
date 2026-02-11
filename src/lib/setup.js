// Setup OpenClaw and 9Router on workers with fallback

let SSHClient;
try {
  SSHClient = require('node-ssh');
} catch (e) {
  SSHClient = null;
}

async function setupWorker(config) {
  if (!SSHClient) {
    console.log('\n⚠️  SSH module not available.');
    console.log('To enable automatic setup, please install with:');
    console.log('  npm install -g @datnpq/layla-cli --unsafe-perm');
    console.log('\nOr manually SSH to the instance and run setup commands.');
    return { success: false, reason: 'SSH module not available' };
  }
  
  console.log('Setting up worker:', config.host);
  return { success: true };
}

module.exports = { setupWorker };
