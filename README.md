<p align="center">
  <strong>layla</strong><br>
  <em>The lightweight Claude Code profile manager.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/layla-cli"><img src="https://img.shields.io/npm/v/layla-cli?color=blue&label=npm" alt="npm version"></a>
  <a href="https://github.com/datnpq/layla-cli/blob/main/LICENSE"><img src="https://img.shields.io/github/license/datnpq/layla-cli" alt="license"></a>
  <img src="https://img.shields.io/badge/shell-bash-green" alt="bash">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Linux-lightgrey" alt="platform">
</p>

---

Switch between multiple Claude Code providers and API keys with a single command. No Node.js runtime, no daemons, no complexity — just one bash script.

## Why Layla?

| | Layla | Other tools |
|---|---|---|
| **Install size** | ~15 KB | 50+ MB |
| **Dependencies** | bash + python3 | Node.js, TypeScript, React |
| **Startup time** | Instant | 1-3 seconds |
| **Architecture** | Single bash script | Multi-process daemon |

Layla does one thing well: **switch Claude Code profiles**. It edits `~/.claude/settings.json` and gets out of your way.

---

## Quick Start

### 1. Install

```bash
npm install -g layla-cli
```

### 2. Create a profile

```bash
layla add my-proxy
# Follow the interactive prompts
```

### 3. Switch

```bash
layla
# Pick a number, done.
```

```
  Claude Code Profiles
  ────────────────────────────────────────────────────────
  ● 1) claudible       claudible.io             opus:claude-opus-4-6
    2) vertex-ai       [vertex] vertex:global/…  opus:claude-opus-4-6
    3) wokushop        llm.wokushop.com          opus:claude-opus-4-6
    4) yescale         api.yescale.io            opus:claude-opus-4-6
  ────────────────────────────────────────────────────────

  Select [1-4] or q to cancel:
```

Restart Claude Code after switching. That's it.

---

## Supported Providers

| Provider | Type | Example |
|---|---|---|
| **Anthropic API** | API Key | Direct Anthropic access |
| **Claudible** | API Key | Third-party proxy |
| **WokuShop** | API Key | Vietnamese proxy |
| **YeScale** | API Key | Third-party proxy |
| **OpenRouter** | API Key | 300+ models |
| **Google Vertex AI** | OAuth | GCP with `gcloud` auth |
| **AWS Bedrock** | API Key | Via LiteLLM gateway |
| **Any proxy** | API Key | Any Anthropic-compatible endpoint |

---

## Commands

### Core

```bash
layla                    # Interactive profile selector
layla <name>             # Switch to profile by name
layla list               # List profiles (non-interactive, pipe-friendly)
layla status             # Show active profile details
layla add <name>         # Create new profile (interactive wizard)
layla rm <name>          # Remove a profile
```

### Health & Diagnostics

```bash
layla doctor             # Check configuration health
layla doctor --fix       # Auto-repair issues
layla test               # API health check (all profiles)
layla test wokushop      # Test a specific profile
```

`layla doctor` verifies:
- python3 availability
- profiles directory & JSON validity
- settings.json integrity
- gcloud credentials (for Vertex AI profiles)
- backup status
- active profile detection

`layla test` sends a minimal API request to each endpoint and reports status:

```
  API Health Check
  ────────────────────────────────────────

  Testing claudible       ... OK (claudible.io)
  Testing vertex-ai       ... OK (credentials valid, project: my-project)
  Testing wokushop        ... OK (llm.wokushop.com)
  Testing yescale         ... FAIL (auth error 403 — check API key)
```

### Backup & Restore

```bash
layla backup             # Save timestamped backup
layla restore            # Interactive restore from backup list
layla restore <file>     # Restore from specific file
```

Layla automatically keeps the last 10 backups in `~/.claude/.layla-backups/`. A quick backup is also created on every profile switch.

### Export & Import

```bash
layla export profiles.json    # Export all profiles to file
layla export                  # Export to stdout (pipe-friendly)
layla import profiles.json    # Import profiles (skips existing)
```

Share profiles between machines:

```bash
# Machine A
layla export > ~/Dropbox/claude-profiles.json

# Machine B
layla import ~/Dropbox/claude-profiles.json
```

### Shell Completions

```bash
# Zsh (add to ~/.zshrc)
eval "$(layla completions zsh)"

# Bash (add to ~/.bashrc)
eval "$(layla completions bash)"

# Fish
layla completions fish | source
```

### Misc

```bash
layla version            # Show version
layla help               # Full command reference
```

---

## Profile Format

Profiles are JSON files in `~/.claude/profiles/`.

### API Key Profile

```json
{
  "description": "My proxy",
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.example.com",
    "ANTHROPIC_AUTH_TOKEN": "sk-...",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5"
  }
}
```

### Vertex AI Profile

```json
{
  "description": "Google Cloud",
  "env": {
    "CLAUDE_CODE_USE_VERTEX": "1",
    "CLOUD_ML_REGION": "global",
    "ANTHROPIC_VERTEX_PROJECT_ID": "my-gcp-project",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-6",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-sonnet-4-6",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5@20251001"
  }
}
```

---

## How It Works

```
~/.claude/
  profiles/             # Profile JSON files
    claudible.json
    vertex-ai.json
    wokushop.json
  settings.json         # Claude Code reads this
  .layla-backups/       # Timestamped backups
```

When you run `layla <name>`:

1. Backs up current `settings.json`
2. Removes all managed env keys from settings
3. Applies the profile's env keys
4. Preserves your other settings (model, statusLine, etc.)

Layla never touches anything outside `settings.json`. Your profiles, commands, skills, and other Claude Code config stay untouched.

---

## Features

| Feature | Description |
|---|---|
| Interactive selector | Run `layla` with no args, pick a number |
| Fuzzy match | Typo? Layla suggests the closest profile name |
| Doctor | `layla doctor --fix` diagnoses and auto-repairs config |
| API health check | `layla test` verifies connectivity to all endpoints |
| Auto-recovery | Corrupted settings.json? Automatically restored from backup |
| Timestamped backups | Last 10 backups kept, plus one on every switch |
| Export/Import | Share profiles between machines via JSON |
| Shell completions | Tab completion for zsh, bash, and fish |
| Update notifications | Non-blocking daily check for new npm versions |
| NO_COLOR support | Respects `NO_COLOR` env var and non-TTY pipes |
| Zero dependencies | Just bash + python3 (pre-installed on macOS/Linux) |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `LAYLA_PROFILES_DIR` | `~/.claude/profiles` | Profile directory |
| `LAYLA_SETTINGS_FILE` | `~/.claude/settings.json` | Settings file path |
| `NO_COLOR` | _(unset)_ | Disable colored output |

---

## Uninstall

```bash
npm uninstall -g layla-cli
```

Profiles and backups remain in `~/.claude/profiles/` and `~/.claude/.layla-backups/`.

---

## License

MIT

---

<p align="center">
  <a href="https://github.com/datnpq/layla-cli">GitHub</a> · <a href="https://www.npmjs.com/package/layla-cli">npm</a> · <a href="https://github.com/datnpq/layla-cli/issues">Report Issues</a>
</p>
