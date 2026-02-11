const chalk = require('chalk');
const ora = require('ora');
const { backupTeam } = require('../lib/backup');

/**
 * Backup command - Backup entire team
 */
async function backup(options) {
  console.log(chalk.blue('\n💾 Backing up team...\n'));

  const timestamp = new Date().toISOString().split('T')[0];
  const backupPath = `${options.output}/layla-backup-${timestamp}`;

  console.log(chalk.yellow('📋 Backup Configuration:'));
  console.log(`  Output: ${chalk.cyan(backupPath)}`);
  console.log(`  Compress: ${chalk.cyan(options.compress ? 'Yes' : 'No')}`);
  console.log(`  Upload to Drive: ${chalk.cyan(options.upload ? 'Yes' : 'No')}`);

  const spinner = ora('Backing up workers...').start();

  try {
    const result = await backupTeam({
      outputPath: backupPath,
      compress: options.compress,
      uploadToDrive: options.upload
    });

    spinner.succeed('Backup complete!');

    console.log(chalk.green('\n✅ Backup successful!\n'));
    console.log(`  Archive: ${chalk.cyan(result.archivePath)}`);
    console.log(`  Size: ${chalk.cyan(result.size)}`);
    
    if (result.driveUrl) {
      console.log(`  Drive URL: ${chalk.cyan(result.driveUrl)}`);
    }

    console.log(chalk.gray('\n💡 To restore: layla restore <backup-file>'));

  } catch (error) {
    spinner.fail('Backup failed');
    console.error(chalk.red('✖ Error:'), error.message);
    process.exit(1);
  }
}

module.exports = backup;
