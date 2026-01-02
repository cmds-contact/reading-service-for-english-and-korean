# JetBrains IDEs

English

# JetBrains IDEs

Use Claude Code with JetBrains IDEs including IntelliJ, PyCharm, WebStorm, and more

## Supported IDEs

- IntelliJ IDEA
- PyCharm
- Android Studio
- WebStorm
- PhpStorm
- GoLand

## Features

- **Quick launch**: Use `Cmd+Esc` (Mac) or `Ctrl+Esc` (Windows/Linux) to open Claude Code directly from your editor, or click the Claude Code button in the UI
- **Diff viewing**: Code changes can be displayed directly in the IDE diff viewer instead of the terminal
- **Selection context**: The current selection/tab in the IDE is automatically shared with Claude Code
- **File reference shortcuts**: Use `Cmd+Option+K` (Mac) or `Alt+Ctrl+K` (Linux/Windows) to insert file references (for example, @File#L1-99)
- **Diagnostic sharing**: Diagnostic errors (lint, syntax, etc.) from the IDE are automatically shared with Claude as you work

## Installation

### Marketplace Installation

> After installing the plugin, you may need to restart your IDE completely for it to take effect.

## Usage

### From Your IDE

### From External Terminals

```
claude
> /ide
```

## Configuration

### Claude Code Settings

- Run `claude`
- Enter the `/config` command
- Set the diff tool to `auto` for automatic IDE detection

### Plugin Settings

#### General Settings

- **Claude command**: Specify a custom command to run Claude (for example, `claude`, `/usr/local/bin/claude`, or `npx @anthropic/claude`)
- **Suppress notification for Claude command not found**: Skip notifications about not finding the Claude command
- **Enable using Option+Enter for multi-line prompts** (macOS only): When enabled, Option+Enter inserts new lines in Claude Code prompts. Disable if experiencing issues with the Option key being captured unexpectedly (requires terminal restart)
- **Enable automatic updates**: Automatically check for and install plugin updates (applied on restart)

> For WSL users: Set `wsl -d Ubuntu -- bash -lic "claude"` as your Claude command (replace `Ubuntu` with your WSL distribution name)

#### ESC Key Configuration

- Go to **Settings → Tools → Terminal**
- Either:

Uncheck “Move focus to the editor with Escape”, or
Click “Configure terminal keybindings” and delete the “Switch focus to Editor” shortcut
- Uncheck “Move focus to the editor with Escape”, or
- Click “Configure terminal keybindings” and delete the “Switch focus to Editor” shortcut
- Apply the changes

## Special Configurations

### Remote Development

> When using JetBrains Remote Development, you must install the plugin in the remote host via **Settings → Plugin (Host)**.

### WSL Configuration

> WSL users may need additional configuration for IDE detection to work properly. See our [WSL troubleshooting guide](/docs/en/troubleshooting#jetbrains-ide-not-detected-on-wsl2) for detailed setup instructions.

- Proper terminal configuration
- Networking mode adjustments
- Firewall settings updates

## Troubleshooting

### Plugin Not Working

- Ensure you’re running Claude Code from the project root directory
- Check that the JetBrains plugin is enabled in the IDE settings
- Completely restart the IDE (you may need to do this multiple times)
- For Remote Development, ensure the plugin is installed in the remote host

### IDE Not Detected

- Verify the plugin is installed and enabled
- Restart the IDE completely
- Check that you’re running Claude Code from the integrated terminal
- For WSL users, see the [WSL troubleshooting guide](/docs/en/troubleshooting#jetbrains-ide-not-detected-on-wsl2)

### Command Not Found

- Verify Claude Code is installed: `npm list -g @anthropic-ai/claude-code`
- Configure the Claude command path in plugin settings
- For WSL users, use the WSL command format mentioned in the configuration section

## Security Considerations

- Using manual approval mode for edits
- Taking extra care to ensure Claude is only used with trusted prompts
- Being aware of which files Claude Code has access to modify

Was this page helpful?
