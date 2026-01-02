# Use Claude Code in VS Code

English

# Use Claude Code in VS Code

Install and configure the Claude Code extension for VS Code. Get AI coding assistance with inline diffs, @-mentions, plan review, and keyboard shortcuts.

## Prerequisites

- VS Code 1.98.0 or higher
- An Anthropic account (you’ll sign in when you first open the extension). If you’re using a third-party provider like Amazon Bedrock or Google Vertex AI, see [Use third-party providers](#use-third-party-providers) instead.

## Install the extension

- [Install for VS Code](vscode:extension/anthropic.claude-code)
- [Install for Cursor](cursor:extension/anthropic.claude-code)

> You may need to restart VS Code or run “Developer: Reload Window” from the Command Palette after installation.

## Get started

Open the Claude Code panel

- **Command Palette**: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux), type “Claude Code”, and select an option like “Open in New Tab”
- **Status Bar**: Click **✱ Claude Code** in the bottom-right corner of the window. This works even when no file is open.

Send a prompt

> Select text in the editor and press `Alt+K` to insert an @-mention with the file path and line numbers directly into your prompt.

Review changes

## Customize your workflow

### Change the layout

- **Secondary sidebar** (default): The right side of the window
- **Primary sidebar**: The left sidebar with icons for Explorer, Search, etc.
- **Editor area**: Opens Claude as a tab alongside your files

> The Spark icon only appears in the Activity Bar (left sidebar icons) when the Claude panel is docked to the left. Since Claude defaults to the right side, use the Editor Toolbar icon to open Claude.

### Switch to terminal mode

## VS Code commands and shortcuts

> These are VS Code commands for controlling the extension. For Claude Code slash commands (like `/help` or `/compact`), not all CLI commands are available in the extension yet. See [VS Code extension vs. Claude Code CLI](#vs-code-extension-vs-claude-code-cli) for details.

## Configure settings

- **Extension settings**: Open with `Cmd+,` (Mac) or `Ctrl+,` (Windows/Linux), then go to Extensions → Claude Code.
SettingDescriptionSelected ModelDefault model for new conversations. Change per-session with `/model`.Use TerminalLaunch Claude in terminal mode instead of graphical panelInitial Permission ModeControls approval prompts for file edits and commands. Defaults to `default` (ask before each action).Preferred LocationDefault location: sidebar (right) or panel (new tab)AutosaveAuto-save files before Claude reads or writes themUse Ctrl+Enter to SendUse Ctrl/Cmd+Enter instead of Enter to send promptsEnable New Conversation ShortcutEnable Cmd/Ctrl+N to start a new conversationRespect Git IgnoreExclude .gitignore patterns from file searchesEnvironment VariablesSet environment variables for the Claude process. **Not recommended**—use [Claude Code settings](/docs/en/settings) instead so configuration is shared between extension and CLI.Disable Login PromptSkip authentication prompts (for third-party provider setups)Allow Dangerously Skip PermissionsBypass all permission prompts. **Use with extreme caution**—recommended only for isolated sandboxes with no internet access.Claude Process WrapperExecutable path used to launch the Claude process
- **Claude Code settings** (`~/.claude/settings.json`): These settings are shared between the VS Code extension and the CLI. Use this file for allowed commands and directories, environment variables, hooks, and MCP servers. See the [settings documentation](/docs/en/settings) for details.

## Use third-party providers

Disable login prompt

Configure your provider

- [Claude Code on Amazon Bedrock](/docs/en/amazon-bedrock)
- [Claude Code on Google Vertex AI](/docs/en/google-vertex-ai)
- [Claude Code on Microsoft Foundry](/docs/en/microsoft-foundry)

## VS Code extension vs. Claude Code CLI

### Run CLI in VS Code

### Switch between extension and CLI

## Security considerations

- Enable [VS Code Restricted Mode](https://code.visualstudio.com/docs/editor/workspace-trust#_restricted-mode) for untrusted workspaces
- Use manual approval mode instead of auto-accept for edits
- Review changes carefully before accepting them

## Fix common issues

### Extension won’t install

- Ensure you have a compatible version of VS Code (1.98.0 or later)
- Check that VS Code has permission to install extensions
- Try installing directly from the Marketplace website

### Spark icon not visible

- **Open a file**: The icon requires a file to be open—having just a folder open isn’t enough
- **Check VS Code version**: Requires 1.98.0 or higher (Help → About)
- **Restart VS Code**: Run “Developer: Reload Window” from the Command Palette
- **Disable conflicting extensions**: Temporarily disable other AI extensions (Cline, Continue, etc.)
- **Check workspace trust**: The extension doesn’t work in Restricted Mode

### Claude Code never responds

- **Check your internet connection**: Ensure you have a stable internet connection
- **Start a new conversation**: Try starting a fresh conversation to see if the issue persists
- **Try the CLI**: Run `claude` from the terminal to see if you get more detailed error messages
- **File a bug report**: If the problem continues, [file an issue on GitHub](https://github.com/anthropics/claude-code/issues) with details about the error

### Standalone CLI not connecting to IDE

- Ensure you’re running Claude Code from VS Code’s integrated terminal (not an external terminal)
- Ensure the CLI for your IDE variant is installed:

VS Code: `code` command should be available
Cursor: `cursor` command should be available
Windsurf: `windsurf` command should be available
VSCodium: `codium` command should be available
- VS Code: `code` command should be available
- Cursor: `cursor` command should be available
- Windsurf: `windsurf` command should be available
- VSCodium: `codium` command should be available
- If the command isn’t available, install it from the Command Palette → “Shell Command: Install ‘code’ command in PATH”

## Uninstall the extension

- Open the Extensions view (`Cmd+Shift+X` on Mac or `Ctrl+Shift+X` on Windows/Linux)
- Search for “Claude Code”
- Click **Uninstall**

```
rm -rf ~/.vscode/globalStorage/anthropic.claude-code
```

## Next steps

- [Explore common workflows](/docs/en/common-workflows) to get the most out of Claude Code
- [Set up MCP servers](/docs/en/mcp) to extend Claude’s capabilities with external tools. Configure servers using the CLI, then use them in the extension.
- [Configure Claude Code settings](/docs/en/settings) to customize allowed commands, hooks, and more. These settings are shared between the extension and CLI.

Was this page helpful?
