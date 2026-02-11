const chalk = require('chalk');
const ora = require('ora');
const { setupWorker } = require('../lib/setup');

/**
 * Setup command - Setup OpenClaw and 9Router on workers
 */
async function setup(instances, options) {
  console.log(chalk.blue('\n🔧 Setting up workers...\n'));

  if (!instances || instances.length === 0) {
    console.error(chalk.red('✖ Please provide at least one instance IP or ID'));
    console.log(chalk.gray('Usage: layla setup <ip1> <ip2> ...'));
    process.exit(1);
  }

  console.log(chalk.yellow('📋 Setup Configuration:'));
  console.log(`  Instances: ${chalk.cyan(instances.join(', '))}`);
  console.log(`  User: ${chalk.cyan(options.user)}`);
  console.log(`  SSH Key: ${chalk.cyan(options.identity)}`);
  console.log(`  Setup OpenClaw: ${chalk.cyan(options.setupOpenclaw ? 'Yes' : 'No')}`);
  console.log(`  Setup 9Router: ${chalk.cyan(options.setup9router ? 'Yes' : 'No')}`);

  const results = [];

  for (const instance of instances) {
    const spinner = ora(`Setting up ${instance}...`).start();
    
    try {
      const result = await setupWorker({
        host: instance,
        username: options.user,
        privateKey: options.identity,
        setupOpenclaw: options.setupOpenclaw,
        setup9router: options.setup9router
      });
      
      spinner.succeed(`${instance} - Setup complete`);
      results.push({ instance, success: true, result });
    } catch (error) {
      spinner.fail(`${instance} - Setup failed`);
      results.push({ instance, success: false, error: error.message });
    }
  }

  console.log(chalk.green('\n✅ Setup complete!\n'));
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`  Success: ${chalk.green(successCount)}`);
  console.log(`  Failed: ${chalk.red(failCount)}`);
  
  if (failCount > 0) {
    console.log(chalk.yellow('\nFailed instances:'));
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.instance}: ${r.error}`);
    });
  }
}

module.exports = setup;
