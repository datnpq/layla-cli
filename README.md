# layla-cli

Switch Claude Code model/endpoint profiles from the terminal.

Manage multiple AI providers (Anthropic API, third-party proxies, Google Vertex AI) and switch between them with a single command.

## Install

```bash
npm install -g layla-cli
```

## Usage

```bash
layla                 # Interactive profile selector
layla <name>          # Switch to profile by name
layla list            # List profiles (non-interactive)
layla status          # Show active profile details
layla add <name>      # Create new profile
layla rm <name>       # Remove a profile
```

### Example

```
$ layla
  Claude Code Profiles
  ────────────────────────────────────────────────────────
  ● 1) claudible       claudible.io             opus:claude-opus-4-6
    2) vertex-ai       [vertex] vertex:global/…  opus:claude-opus-4-6
    3) wokushop        llm.wokushop.com          opus:claude-opus-4-6
  ────────────────────────────────────────────────────────

  Select [1-3] or q to cancel:
```

## Profile types

### API Key (Anthropic-compatible proxies)

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

### Google Vertex AI

```json
{
  "description": "Vertex AI",
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

## How it works

Profiles are stored as JSON files in `~/.claude/profiles/`. When you switch, layla merges the profile's `env` keys into `~/.claude/settings.json`, preserving your other settings (statusLine, model, etc.).

A backup is created at `~/.claude/settings.json.bak` before each switch.

## Requirements

- bash
- python3 (for JSON handling, pre-installed on macOS/most Linux)

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `LAYLA_PROFILES_DIR` | `~/.claude/profiles` | Profile directory |
| `LAYLA_SETTINGS_FILE` | `~/.claude/settings.json` | Settings file path |

## License

MIT
