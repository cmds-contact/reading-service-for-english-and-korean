# Troubleshooting

English

# Troubleshooting

Discover solutions to common issues with Claude Code installation and usage.

## Common installation issues

### Windows installation issues: errors in WSL

- Run `npm config set os linux` before installation
- Install with `npm install -g @anthropic-ai/claude-code --force --no-os-check` (Do NOT use `sudo`)
- Running `which npm` and `which node` - if they point to Windows paths (starting with `/mnt/c/`), Windows versions are being used
- Experiencing broken functionality after switching Node versions with nvm in WSL

```
# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

```
source ~/.nvm/nvm.sh
```

```
export PATH="$HOME/.nvm/versions/node/$(node -v)/bin:$PATH"
```

> Avoid disabling Windows PATH importing (`appendWindowsPath = false`) as this breaks the ability to call Windows executables from WSL. Similarly, avoid uninstalling Node.js from Windows if you use it for Windows development.

### Linux and Mac installation issues: permission or command not found errors

#### Recommended solution: Native Claude Code installation

```
# Install stable version (default)
curl -fsSL https://claude.ai/install.sh | bash

# Install latest version
curl -fsSL https://claude.ai/install.sh | bash -s latest

# Install specific version number
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

```
# Install stable version (default)
irm https://claude.ai/install.ps1 | iex

# Install latest version
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# Install specific version number
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

> Make sure that you have the installation directory in your system PATH.

```
claude doctor # Check installation health
```

## Permissions and authentication

### Repeated permission prompts

### Authentication issues

- Run `/logout` to sign out completely
- Close Claude Code
- Restart with `claude` and complete the authentication process again

```
rm -rf ~/.config/claude-code/auth.json
claude
```

## Configuration file locations

- macOS: `/Library/Application Support/ClaudeCode/`
- Linux/WSL: `/etc/claude-code/`
- Windows: `C:\ProgramData\ClaudeCode\`

### Resetting configuration

```
# Reset all user settings and state
rm ~/.claude.json
rm -rf ~/.claude/

# Reset project-specific settings
rm -rf .claude/
rm .mcp.json
```

> This will remove all your settings, allowed tools, MCP server configurations, and session history.

## Performance and stability

### High CPU or memory usage

- Use `/compact` regularly to reduce context size
- Close and restart Claude Code between major tasks
- Consider adding large build directories to your `.gitignore` file

### Command hangs or freezes

- Press Ctrl+C to attempt to cancel the current operation
- If unresponsive, you may need to close the terminal and restart

### Search and discovery issues

```
# macOS (Homebrew)  
brew install ripgrep

# Windows (winget)
winget install BurntSushi.ripgrep.MSVC

# Ubuntu/Debian
sudo apt install ripgrep

# Alpine Linux
apk add ripgrep

# Arch Linux
pacman -S ripgrep
```

### Slow or incomplete search results on WSL

> `/doctor` will show Search as OK in this case.

- **Submit more specific searches**: Reduce the number of files searched by specifying directories or file types: “Search for JWT validation logic in the auth-service package” or “Find use of md5 hash in JS files”.
- **Move project to Linux filesystem**: If possible, ensure your project is located on the Linux filesystem (`/home/`) rather than the Windows filesystem (`/mnt/c/`).
- **Use native Windows instead**: Consider running Claude Code natively on Windows instead of through WSL, for better file system performance.

## IDE integration issues

### JetBrains IDE not detected on WSL2

#### WSL2 networking modes

- Find your WSL2 IP address:
CopyAsk AIwsl hostname -I
# Example output: 172.21.123.456

```
wsl hostname -I
# Example output: 172.21.123.456
```

- Open PowerShell as Administrator and create a firewall rule:
CopyAsk AINew-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16

(Adjust the IP range based on your WSL2 subnet from step 1)

```
New-NetFirewallRule -DisplayName "Allow WSL2 Internal Traffic" -Direction Inbound -Protocol TCP -Action Allow -RemoteAddress 172.21.0.0/16 -LocalAddress 172.21.0.0/16
```

- Restart both your IDE and Claude Code

```
[wsl2]
networkingMode=mirrored
```

> These networking issues only affect WSL2. WSL1 uses the host’s network directly and doesn’t require these configurations.

### Reporting Windows IDE integration issues (both native and WSL)

- Environment type: native Windows (Git Bash) or WSL1/WSL2
- WSL networking mode (if applicable): NAT or mirrored
- IDE name and version
- Claude Code extension/plugin version
- Shell type: Bash, Zsh, PowerShell, etc.

### Escape key not working in JetBrains (IntelliJ, PyCharm, etc.) terminals

- Go to Settings → Tools → Terminal
- Either:

Uncheck “Move focus to the editor with Escape”, or
Click “Configure terminal keybindings” and delete the “Switch focus to Editor” shortcut
- Uncheck “Move focus to the editor with Escape”, or
- Click “Configure terminal keybindings” and delete the “Switch focus to Editor” shortcut
- Apply the changes

## Markdown formatting issues

### Missing language tags in code blocks

```
```
function example() {
  return "hello";
}
```
```

```
```javascript
function example() {
  return "hello";
}
```
```

- **Ask Claude to add language tags**: Request “Add appropriate language tags to all code blocks in this markdown file.”
- **Use post-processing hooks**: Set up automatic formatting hooks to detect and add missing language tags. See the [markdown formatting hook example](/docs/en/hooks-guide#markdown-formatting-hook) for implementation details.
- **Manual verification**: After generating markdown files, review them for proper code block formatting and request corrections if needed.

### Inconsistent spacing and formatting

- **Request formatting corrections**: Ask Claude to “Fix spacing and formatting issues in this markdown file.”
- **Use formatting tools**: Set up hooks to run markdown formatters like `prettier` or custom formatting scripts on generated markdown files.
- **Specify formatting preferences**: Include formatting requirements in your prompts or project [memory](/docs/en/memory) files.

### Best practices for markdown generation

- **Be explicit in requests**: Ask for “properly formatted markdown with language-tagged code blocks”
- **Use project conventions**: Document your preferred markdown style in `CLAUDE.md`
- **Set up validation hooks**: Use post-processing hooks to automatically verify and fix common formatting issues

## Getting more help

- Use the `/bug` command within Claude Code to report problems directly to Anthropic
- Check the [GitHub repository](https://github.com/anthropics/claude-code) for known issues
- Run `/doctor` to check the health of your Claude Code installation
- Ask Claude directly about its capabilities and features - Claude has built-in access to its documentation

Was this page helpful?
