# Interactive mode

English

# Interactive mode

Complete reference for keyboard shortcuts, input modes, and interactive features in Claude Code sessions.

## Keyboard shortcuts

> Keyboard shortcuts may vary by platform and terminal. Press `?` to see available shortcuts for your environment. For example, Option key combinations on macOS may require configuring your terminal to use Option as a meta/escape key.

### General controls

### Multiline input

> Configure your preferred line break behavior in terminal settings. Run `/terminal-setup` to install Shift+Enter binding for iTerm2 and VS Code terminals.

### Quick commands

## Vim editor mode

### Mode switching

### Navigation (NORMAL mode)

### Editing (NORMAL mode)

## Command history

- History is stored per working directory
- Cleared with `/clear` command
- Use Up/Down arrows to navigate (see keyboard shortcuts above)
- **Note**: History expansion (`!`) is disabled by default

### Reverse search with Ctrl+R

- **Start search**: Press `Ctrl+R` to activate reverse history search
- **Type query**: Enter text to search for in previous commands - the search term will be highlighted in matching results
- **Navigate matches**: Press `Ctrl+R` again to cycle through older matches
- **Accept match**:

Press `Tab` or `Esc` to accept the current match and continue editing
Press `Enter` to accept and execute the command immediately
- Press `Tab` or `Esc` to accept the current match and continue editing
- Press `Enter` to accept and execute the command immediately
- **Cancel search**:

Press `Ctrl+C` to cancel and restore your original input
Press `Backspace` on empty search to cancel
- Press `Ctrl+C` to cancel and restore your original input
- Press `Backspace` on empty search to cancel

## Background bash commands

### How backgrounding works

- Prompt Claude Code to run a command in the background
- Press Ctrl+B to move a regular Bash tool invocation to the background. (Tmux users must press Ctrl+B twice due to tmux’s prefix key.)
- Output is buffered and Claude can retrieve it using the BashOutput tool
- Background tasks have unique IDs for tracking and output retrieval
- Background tasks are automatically cleaned up when Claude Code exits
- Build tools (webpack, vite, make)
- Package managers (npm, yarn, pnpm)
- Test runners (jest, pytest)
- Development servers
- Long-running processes (docker, terraform)

### Bash mode with ! prefix

```
! npm test
! git status
! ls -la
```

- Adds the command and its output to the conversation context
- Shows real-time progress and output
- Supports the same `Ctrl+B` backgrounding for long-running commands
- Does not require Claude to interpret or approve the command

## See also

- [Slash commands](/docs/en/slash-commands) - Interactive session commands
- [Checkpointing](/docs/en/checkpointing) - Rewind Claude’s edits and restore previous states
- [CLI reference](/docs/en/cli-reference) - Command-line flags and options
- [Settings](/docs/en/settings) - Configuration options
- [Memory management](/docs/en/memory) - Managing CLAUDE.md files

Was this page helpful?
