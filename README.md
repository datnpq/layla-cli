# 🤖 Layla CLI

> Automated Multi-Agent Team Deployment CLI - Setup OpenClaw, 9Router, and manage intelligent worker teams

[![npm version](https://badge.fury.io/js/layla-cli.svg)](https://www.npmjs.com/package/layla-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **One-command deployment** of multi-agent teams
- 🧠 **Intelligent routing** with 9Router (3-tier AI model routing)
- 👥 **Role-based workers** (Strategist, Engineer, Operator, etc.)
- 💰 **Cost optimization** with auto-scaling
- 💾 **Backup/Restore** entire teams to Google Drive
- 🔒 **Secure** - API keys never stored in backups
- 📊 **Monitoring** - Track usage and costs

## 📦 Installation

```bash
# Install globally
npm install -g layla-cli

# Or use npx
npx layla-cli --help
```

## 🚀 Quick Start

### 1. Initialize configuration
```bash
layla config --init
```

### 2. Deploy your team
```bash
# Deploy 10 workers with mixed tiers
layla deploy --name my-team --count 10 --region ap-southeast-2

# Deploy with API keys
layla deploy \
  --name production-team \
  --count 5 \
  --claude-key sk-ant-... \
  --openai-key sk-...
```

### 3. Check status
```bash
layla status
```

### 4. Backup your team
```bash
layla backup --upload
```

## 📚 Commands

### `layla deploy [options]`
Deploy a new multi-agent team

**Options:**
- `-n, --name <name>` - Team name (default: layla-team)
- `-c, --count <count>` - Number of workers (default: 10)
- `-r, --region <region>` - AWS region (default: ap-southeast-2)
- `-t, --tier <tier>` - Instance tier: micro/small/medium (default: small)
- `-k, --key <key>` - SSH key name (default: macair)
- `--claude-key <key>` - Claude API key
- `--openai-key <key>` - OpenAI API key
- `--dry-run` - Show deployment plan without deploying

**Example:**
```bash
layla deploy -n my-team -c 10 -r us-east-1 -t medium
```

---

### `layla setup <instances...>`
Setup OpenClaw and 9Router on existing instances

**Example:**
```bash
layla setup 3.25.111.149 3.106.206.127 --user ubuntu -i ~/.ssh/mykey.pem
```

---

### `layla team <subcommand>`
Manage your worker team

**Subcommands:**
- `list` - List all workers
- `add <count>` - Add workers
- `remove <ids...>` - Remove workers
- `ssh <worker-id>` - SSH into worker

**Example:**
```bash
layla team list
layla team add 3 --role engineer --tier 2
layla team ssh worker-02
```

---

### `layla backup [options]`
Backup entire team to Google Drive

**Options:**
- `-o, --output <path>` - Backup directory (default: ~/layla-backups)
- `-u, --upload` - Upload to Google Drive (default: true)
- `-c, --compress` - Compress backup (default: true)

**Example:**
```bash
layla backup --upload
```

---

### `layla restore <backup-file>`
Restore team from backup

**Options:**
- `-n, --new-instances` - Create new AWS instances
- `--from-gdrive <fileId>` - Restore from Google Drive

**Example:**
```bash
layla restore ~/backups/layla-backup-20260211.tar.gz
layla restore --from-gdrive 1ABC123XYZ
```

---

### `layla scale [options]`
Auto-scale team based on usage or cost

**Options:**
- `-m, --mode <mode>` - Scale mode: up/down/auto (default: auto)
- `-t, --target <target>` - Target monthly cost in USD
- `--economy` - Scale to economy mode (all micro)
- `--performance` - Scale to performance mode (all medium)

**Example:**
```bash
layla scale --target 100
layla scale --economy
```

---

### `layla status [options]`
Check status of all workers

**Options:**
- `-w, --watch` - Watch mode (continuous)
- `--cost` - Show cost breakdown

**Example:**
```bash
layla status
layla status --watch
```

---

### `layla config [options]`
Manage configuration

**Options:**
- `--init` - Initialize configuration interactively
- `-s, --set <key=value>` - Set config value
- `-g, --get <key>` - Get config value

**Example:**
```bash
layla config --init
layla config --set aws.region=ap-southeast-2
```

## 🏗️ Architecture

```
Layla CLI (Governor)
    │
    ├──► 9Router (Intelligent Routing)
    │       ├── Tier 1: Claude/OpenAI/Google ($$$)
    │       ├── Tier 2: GLM/MiniMax/Kimi ($)
    │       └── Tier 3: iFlow/Qwen/Kiro (FREE)
    │
    └──► Worker Team (10 workers)
            ├── Tier 1: Strategist, Architect, Red Team
            ├── Tier 2: Engineer, Researcher, DevOps, Prompt, Critic
            └── Tier 3: Operator, Synthesizer
```

## 💰 Cost Optimization

| Mode | Workers | Cost/Month | Use Case |
|------|---------|------------|----------|
| Economy | All micro | ~$80 | Development, testing |
| Balanced | Mixed | ~$160 | Production |
| Performance | All medium | ~$330 | High-load tasks |

## 🔐 Security

- API keys stored in `~/.layla/config.json` (chmod 600)
- Keys never included in backups
- SSH keys used for worker authentication
- Support for AWS IAM roles

## 📁 Backup Structure

```
layla-backup-20260211/
├── layla-workspace-20260211.tar.gz    # Local workspace
├── worker-01-20260211.tar.gz           # Worker configs
├── worker-02-20260211.tar.gz
├── ...
└── worker-10-20260211.tar.gz
```

## 🔄 Restore Process

1. **From backup file:**
```bash
layla restore backup-file.tar.gz
```

2. **From Google Drive:**
```bash
layla restore --from-gdrive <file-id>
```

3. **With new instances:**
```bash
layla restore backup.tar.gz --new-instances
```

## 🛠️ Installation Troubleshooting

### Issue: Native module compilation fails

If you encounter errors during installation related to `ssh2` or native modules:

**Option 1: Install without native SSH (Recommended)**
```bash
npm install -g @datnpq/layla-cli
```
The CLI will work with manual SSH commands as fallback.

**Option 2: Install with native modules**
```bash
npm install -g @datnpq/layla-cli --unsafe-perm
```

**Option 3: Use npx (no installation)**
```bash
npx @datnpq/layla-cli --help
```

### Issue: Permission denied

```bash
sudo npm install -g @datnpq/layla-cli
# or
npm install -g @datnpq/layla-cli --prefix ~/.local
```

## 🔄 Version History

- **v1.0.1** - Fixed native module dependencies, made SSH optional
- **v1.0.0** - Initial release with multi-agent deployment

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/datnpq/layla-cli.git
cd layla-cli

# Install dependencies
npm install

# Run in development
npm link
layla --help

# Run tests
npm test

# Build binary
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT © [datnpq](https://github.com/datnpq)

## 🙏 Acknowledgments

- Inspired by OpenClaw multi-agent architecture
- 9Router for intelligent model routing
- AWS for cloud infrastructure

---

<div align="center">
  <sub>Built with ❤️ by Layla Team</sub>
</div>
