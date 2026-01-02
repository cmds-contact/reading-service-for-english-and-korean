# Set up Claude Code

English

# Set up Claude Code

Install, authenticate, and start using Claude Code on your development machine.

## System requirements

- **Operating Systems**: macOS 10.15+, Ubuntu 20.04+/Debian 10+, or Windows 10+ (with WSL 1, WSL 2, or Git for Windows)
- **Hardware**: 4 GB+ RAM
- **Software**: [Node.js 18+](https://nodejs.org/en/download) (only required for npm installation)
- **Network**: Internet connection required for authentication and AI processing
- **Shell**: Works best in Bash, Zsh or Fish
- **Location**: [Anthropic supported countries](https://www.anthropic.com/supported-countries)

### Additional dependencies

- **ripgrep**: Usually included with Claude Code. If search fails, see [search troubleshooting](/docs/en/troubleshooting#search-and-discovery-issues).

## Standard installation

- Native Install (Recommended)
- Homebrew
- NPM

```
curl -fsSL https://claude.ai/install.sh | bash
```

```
irm https://claude.ai/install.ps1 | iex
```

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```
brew install --cask claude-code
```

```
npm install -g @anthropic-ai/claude-code
```

> Some users may be automatically migrated to an improved installation method.

```
cd your-awesome-project
claude
```

- **Claude Console**: The default option. Connect through the Claude Console and complete the OAuth process. Requires active billing in the [Anthropic console](https://console.anthropic.com). A “Claude Code” workspace is automatically created for usage tracking and cost management. You can’t create API keys for the Claude Code workspace; it’s dedicated exclusively for Claude Code usage.
- **Claude App (with Pro or Max plan)**: Subscribe to Claude’s [Pro or Max plan](https://claude.com/pricing) for a unified subscription that includes both Claude Code and the web interface. Get more value at the same price point while managing your account in one place. Log in with your Claude.ai account. During launch, choose the option that matches your subscription type.
- **Enterprise platforms**: Configure Claude Code to use [Amazon Bedrock, Google Vertex AI, or Microsoft Foundry](/docs/en/third-party-integrations) for enterprise deployments with your existing cloud infrastructure.

> Claude Code securely stores your credentials. See [Credential Management](/docs/en/iam#credential-management) for details.

## Windows setup

- Both WSL 1 and WSL 2 are supported
- Requires [Git for Windows](https://git-scm.com/downloads/win)
- For portable Git installations, specify the path to your `bash.exe`:
CopyAsk AI$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"

```
$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
```

## Alternative installation methods

> Run `claude doctor` after installation to check your installation type and version.

### Native installation options

- One self-contained executable
- No Node.js dependency
- Improved auto-updater stability

```
# Install stable version (default)
curl -fsSL https://claude.ai/install.sh | bash

# Install latest version
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Install specific version number
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

> **Alpine Linux and other musl/uClibc-based distributions**: The native build requires `libgcc`, `libstdc++`, and `ripgrep`. For Alpine: `apk add libgcc libstdc++ ripgrep`. Set `USE_BUILTIN_RIPGREP=0`.

```
# Install stable version (default)
irm https://claude.ai/install.ps1 | iex

# Install latest version
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# Install specific version number
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

```
REM Install stable version (default)
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

REM Install latest version
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd latest && del install.cmd

REM Install specific version number
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd 1.0.58 && del install.cmd
```

> Make sure that you remove any outdated aliases or symlinks before installing.

- SHA256 checksums for all platforms are published in the release manifests, currently located at `https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/{VERSION}/manifest.json` (example: replace `{VERSION}` with `2.0.30`)
- Signed binaries are distributed for the following platforms:

macOS: Signed by “Anthropic PBC” and notarized by Apple
Windows: Signed by “Anthropic, PBC”
- macOS: Signed by “Anthropic PBC” and notarized by Apple
- Windows: Signed by “Anthropic, PBC”

### NPM installation

> Do NOT use `sudo npm install -g` as this can lead to permission issues and security risks.
> If you encounter permission errors, see [configure Claude Code](/docs/en/troubleshooting#linux-permission-issues) for recommended solutions.

## Running on AWS or GCP

## Update Claude Code

### Auto updates

- **Update checks**: Performed on startup and periodically while running
- **Update process**: Downloads and installs automatically in the background
- **Notifications**: You’ll see a notification when updates are installed
- **Applying updates**: Updates take effect the next time you start Claude Code

```
export DISABLE_AUTOUPDATER=1
```

### Update manually

```
claude update
```

## Uninstall Claude Code

### Native installation

```
rm -f ~/.local/bin/claude
rm -rf ~/.claude-code
```

```
Remove-Item -Path "$env:LOCALAPPDATA\Programs\claude-code" -Recurse -Force
Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\WindowsApps\claude.exe" -Force
```

```
rmdir /s /q "%LOCALAPPDATA%\Programs\claude-code"
del "%LOCALAPPDATA%\Microsoft\WindowsApps\claude.exe"
```

### Homebrew installation

```
brew uninstall --cask claude-code
```

```
npm uninstall -g @anthropic-ai/claude-code
```

### Clean up configuration files (optional)

> Removing configuration files will delete all your settings, allowed tools, MCP server configurations, and session history.

```
# Remove user settings and state
rm -rf ~/.claude
rm ~/.claude.json

# Remove project-specific settings (run from your project directory)
rm -rf .claude
rm -f .mcp.json
```

```
# Remove user settings and state
Remove-Item -Path "$env:USERPROFILE\.claude" -Recurse -Force
Remove-Item -Path "$env:USERPROFILE\.claude.json" -Force

# Remove project-specific settings (run from your project directory)
Remove-Item -Path ".claude" -Recurse -Force
Remove-Item -Path ".mcp.json" -Force
```

```
REM Remove user settings and state
rmdir /s /q "%USERPROFILE%\.claude"
del "%USERPROFILE%\.claude.json"

REM Remove project-specific settings (run from your project directory)
rmdir /s /q ".claude"
del ".mcp.json"
```

Was this page helpful?
