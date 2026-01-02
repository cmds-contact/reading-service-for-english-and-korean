# Optimize your terminal setup

English

# Optimize your terminal setup

Claude Code works best when your terminal is properly configured. Follow these guidelines to optimize your experience.

### Themes and appearance

### Line breaks

- **Quick escape**: Type `\` followed by Enter to create a newline
- **Keyboard shortcut**: Set up a keybinding to insert a newline

#### Set up Shift+Enter (VS Code or iTerm2):

#### Set up Option+Enter (VS Code, iTerm2 or macOS Terminal.app):

- Open Settings → Profiles → Keyboard
- Check “Use Option as Meta Key”
- Open Settings → Profiles → Keys
- Under General, set Left/Right Option key to “Esc+“

### Notification setup

#### iTerm 2 system notifications

- Open iTerm 2 Preferences
- Navigate to Profiles → Terminal
- Enable “Silence bell” and Filter Alerts → “Send escape sequence-generated alerts”
- Set your preferred notification delay

#### Custom notification hooks

### Handling large inputs

- **Avoid direct pasting**: Claude Code may struggle with very long pasted content
- **Use file-based workflows**: Write content to a file and ask Claude to read it
- **Be aware of VS Code limitations**: The VS Code terminal is particularly prone to truncating long pastes

### Vim Mode

- Mode switching: `Esc` (to NORMAL), `i`/`I`, `a`/`A`, `o`/`O` (to INSERT)
- Navigation: `h`/`j`/`k`/`l`, `w`/`e`/`b`, `0`/`$`/`^`, `gg`/`G`
- Editing: `x`, `dw`/`de`/`db`/`dd`/`D`, `cw`/`ce`/`cb`/`cc`/`C`, `.` (repeat)

Was this page helpful?
