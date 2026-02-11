const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { deployTeam } = require('../lib/deployer');
const { validateConfig } = require('../lib/validator');

/**
 * Deploy command - Deploy a new multi-agent team
 */
async function deploy(options) {
  console.log(chalk.blue('\n📦 Deploying new multi-agent team...\n'));

  // Validate options
  const validation = validateConfig(options);
  if (!validation.valid) {
    console.error(chalk.red('✖ Validation failed:'), validation.errors.join(', '));
    process.exit(1);
  }

  // Show deployment plan
  console.log(chalk.yellow('📋 Deployment Plan:'));
  console.log(`  Team Name: ${chalk.cyan(options.name)}`);
  console.log(`  Workers: ${chalk.cyan(options.count)}`);
  console.log(`  Region: ${chalk.cyan(options.region)}`);
  console.log(`  Tier: ${chalk.cyan(options.tier)}`);
  console.log(`  SSH Key: ${chalk.cyan(options.key)}`);
  
  if (options.dryRun) {
    console.log(chalk.yellow('\n⚠️  DRY RUN - No actual deployment\n'));
    return;
  }

  // Confirm deployment
  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Proceed with deployment?',
    default: true
  }]);

  if (!confirm) {
    console.log(chalk.yellow('Deployment cancelled'));
    return;
  }

  // Deploy
  const spinner = ora('Deploying workers...').start();
  
  try {
    const result = await deployTeam({
      name: options.name,
      count: parseInt(options.count),
      region: options.region,
      tier: options.tier,
      keyName: options.key,
      claudeKey: options.claudeKey,
      openaiKey: options.openaiKey
    });

    spinner.succeed('Deployment complete!');
    
    console.log(chalk.green('\n✅ Team deployed successfully!\n'));
    console.log(chalk.white('Workers:'));
    result.workers.forEach((worker, i) => {
      console.log(`  ${i + 1}. ${worker.name} (${worker.role}) - ${worker.ip}`);
    });
    
    console.log(chalk.gray(`\n💡 Run 'layla team list' to see all workers`));
    console.log(chalk.gray(`💡 Run 'layla backup' to backup your team`));
    
  } catch (error) {
    spinner.fail('Deployment failed');
    console.error(chalk.red('✖ Error:'), error.message);
    process.exit(1);
  }
}

module.exports = deploy;
