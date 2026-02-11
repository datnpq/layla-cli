// Worker deployment logic with graceful fallback

let SSHClient;
try {
  SSHClient = require('node-ssh');
} catch (e) {
  SSHClient = null;
}

async function deployTeam(config) {
  console.log('Deploying team:', config.name);
  
  if (!SSHClient) {
    console.log('\n📋 Manual Deployment Instructions:');
    console.log('Since native SSH module is not available, please:');
    console.log('1. Create AWS instances manually or use AWS CLI');
    console.log('2. Run: layla setup <instance-ips...>');
    console.log('\nOr install with native modules:');
    console.log('  npm install -g @datnpq/layla-cli --unsafe-perm');
  }
  
  return {
    workers: [],
    sshAvailable: !!SSHClient
  };
}

module.exports = { deployTeam };
