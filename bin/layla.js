#!/usr/bin/env node

/**
 * Layla CLI - Automated Multi-Agent Team Deployment
 * 
 * Features:
 * - Deploy OpenClaw instances
 * - Setup 9Router with intelligent routing
 * - Create and manage worker teams
 * - Backup/restore entire teams
 * - Auto-scaling and cost optimization
 * 
 * @author datnpq
 * @version 1.0.0
 */

const { Command } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');

// Import commands
const deployCmd = require('../src/commands/deploy');
const setupCmd = require('../src/commands/setup');
const teamCmd = require('../src/commands/team');
const backupCmd = require('../src/commands/backup');
const restoreCmd = require('../src/commands/restore');
const statusCmd = require('../src/commands/status');
const scaleCmd = require('../src/commands/scale');
const configCmd = require('../src/commands/config');

const program = new Command();

// Header
console.log(chalk.cyan.bold(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ${chalk.white('LAYLA CLI')} - Multi-Agent Team Deployment              ║
║   ${chalk.gray('Version:')} ${pkg.version}                                       ║
║   ${chalk.gray('Author:')} ${pkg.author}                                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`));

program
  .name('layla')
  .description('Automated deployment and management of multi-agent AI teams')
  .version(pkg.version, '-v, --version', 'Display version number')
  .helpOption('-h, --help', 'Display help for command')
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str))
  });

// Deploy command
program
  .command('deploy')
  .description('Deploy a new multi-agent team')
  .option('-n, --name <name>', 'Team name', 'layla-team')
  .option('-c, --count <count>', 'Number of workers', '10')
  .option('-r, --region <region>', 'AWS region', 'ap-southeast-2')
  .option('-t, --tier <tier>', 'Instance tier (micro/small/medium)', 'small')
  .option('-k, --key <key>', 'SSH key name', 'macair')
  .option('--claude-key <key>', 'Claude API key')
  .option('--openai-key <key>', 'OpenAI API key')
  .option('--dry-run', 'Show what would be deployed without actually deploying')
  .action(deployCmd);

// Setup command
program
  .command('setup')
  .description('Setup OpenClaw and 9Router on existing instances')
  .argument('<instances...', 'Instance IPs or IDs')
  .option('-u, --user <user>', 'SSH user', 'ubuntu')
  .option('-i, --identity <path>', 'SSH private key path', '~/.ssh/id_rsa')
  .option('--setup-openclaw', 'Setup OpenClaw workspace', true)
  .option('--setup-9router', 'Setup 9Router with intelligent routing', true)
  .action(setupCmd);

// Team management
const team = program
  .command('team')
  .description('Manage your worker team');

team
  .command('list')
  .alias('ls')
  .description('List all workers in the team')
  .option('-a, --all', 'Show all details including costs')
  .action(teamCmd.list);

team
  .command('add <count>')
  .description('Add workers to the team')
  .option('-r, --role <role>', 'Worker role (strategist/engineer/operator/etc)')
  .option('-t, --tier <tier>', 'AI model tier (1/2/3)', '2')
  .action(teamCmd.add);

team
  .command('remove <ids...>')
  .alias('rm')
  .description('Remove workers from the team')
  .option('-f, --force', 'Force removal without confirmation')
  .action(teamCmd.remove);

team
  .command('ssh <worker-id>')
  .description('SSH into a specific worker')
  .action(teamCmd.ssh);

// Backup commands
program
  .command('backup')
  .description('Backup entire team to Google Drive')
  .option('-o, --output <path>', 'Local backup directory', '~/layla-backups')
  .option('-u, --upload', 'Upload to Google Drive after backup', true)
  .option('-c, --compress', 'Compress backup', true)
  .action(backupCmd);

program
  .command('restore <backup-file>')
  .description('Restore team from backup')
  .option('-n, --new-instances', 'Create new AWS instances', false)
  .option('--from-gdrive <fileId>', 'Restore from Google Drive file ID')
  .action(restoreCmd);

// Scale command
program
  .command('scale')
  .description('Auto-scale team based on usage or cost')
  .option('-m, --mode <mode>', 'Scale mode (up/down/auto)', 'auto')
  .option('-t, --target <target>', 'Target cost per month in USD')
  .option('--economy', 'Scale to economy mode (all micro)')
  .option('--performance', 'Scale to performance mode (all medium)')
  .action(scaleCmd);

// Status command
program
  .command('status')
  .alias('st')
  .description('Check status of all workers')
  .option('-w, --watch', 'Watch mode - continuous monitoring')
  .option('--cost', 'Show cost breakdown')
  .action(statusCmd);

// Config command
program
  .command('config')
  .description('Manage layla-cli configuration')
  .option('-s, --set <key=value>', 'Set configuration value')
  .option('-g, --get <key>', 'Get configuration value')
  .option('--init', 'Initialize configuration interactively')
  .action(configCmd);

// Global error handling
program.exitOverride();

try {
  program.parse();
} catch (err) {
  if (err.code === 'commander.help') {
    process.exit(0);
  }
  if (err.code === 'commander.version') {
    process.exit(0);
  }
  console.error(chalk.red('✖ Error:'), err.message);
  process.exit(1);
}

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
