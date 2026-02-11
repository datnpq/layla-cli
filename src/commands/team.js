const chalk = require('chalk');

/**
 * Team management commands
 */

async function list(options) {
  console.log(chalk.blue('\n👥 Worker Team:\n'));
  console.log('Use \"layla deploy\" to create a team first.');
  console.log(chalk.gray('\n💡 Tip: Run layla status to check worker status'));
}

async function add(count, options) {
  console.log(chalk.blue(`\n➕ Adding ${count} workers...`));
  console.log(chalk.yellow('Role:'), options.role || 'worker');
  console.log(chalk.yellow('Tier:'), options.tier);
  console.log(chalk.gray('\n💡 Use layla deploy for initial setup'));
}

async function remove(ids, options) {
  console.log(chalk.blue('\n➖ Removing workers:'), ids.join(', '));
  if (!options.force) {
    console.log(chalk.yellow('Use --force to confirm removal'));
  }
}

async function ssh(workerId) {
  console.log(chalk.blue(`\n🔌 SSH to ${workerId}...`));
  console.log(chalk.gray('Use: ssh -i <key> ubuntu@<ip>'));
}

module.exports = {
  list,
  add,
  remove,
  ssh
};
