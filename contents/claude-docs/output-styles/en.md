# Output styles

English

# Output styles

Adapt Claude Code for uses beyond software engineering

## Built-in output styles

- **Explanatory**: Provides educational “Insights” in between helping you
complete software engineering tasks. Helps you understand implementation
choices and codebase patterns.
- **Learning**: Collaborative, learn-by-doing mode where Claude will not only
share “Insights” while coding, but also ask you to contribute small, strategic
pieces of code yourself. Claude Code will add `TODO(human)` markers in your
code for you to implement.

## How output styles work

- All output styles exclude instructions for efficient output (such as
responding concisely).
- Custom output styles exclude instructions for coding (such as verifying code
with tests), unless `keep-coding-instructions` is true.
- All output styles have their own custom instructions added to the end of the
system prompt.
- All output styles trigger reminders for Claude to adhere to the output style
instructions during the conversation.

## Change your output style

- Run `/output-style` to access a menu and select your output style (this can
also be accessed from the `/config` menu)
- Run `/output-style [style]`, such as `/output-style explanatory`, to directly
switch to a style

## Create a custom output style

```
---
name: My Custom Style
description:
  A brief description of what this style does, to be displayed to the user
---

# Custom Style Instructions

You are an interactive CLI tool that helps users with software engineering
tasks. [Your custom instructions here...]

## Specific Behaviors

[Define how the assistant should behave in this style...]
```

### Frontmatter

## Comparisons to related features

### Output Styles vs. CLAUDE.md vs. —append-system-prompt

### Output Styles vs. Agents

### Output Styles vs. Custom Slash Commands

Was this page helpful?
