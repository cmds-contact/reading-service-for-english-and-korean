# Slash commands

English

# Slash commands

Control Claude’s behavior during an interactive session with slash commands.

## Built-in slash commands

## Custom slash commands

### Syntax

```
/<command-name> [arguments]
```

#### Parameters

### Command types

#### Project commands

```
# Create a project command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### Personal commands

```
# Create a personal command
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

### Features

#### Namespacing

- `.claude/commands/frontend/component.md` creates `/component` with description “(project:frontend)”
- `~/.claude/commands/component.md` creates `/component` with description “(user)”

#### Arguments

##### All arguments with $ARGUMENTS

```
# Command definition
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# Usage
> /fix-issue 123 high-priority
# $ARGUMENTS becomes: "123 high-priority"
```

##### Individual arguments with $1, $2, etc.

```
# Command definition  
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# Usage
> /review-pr 456 high alice
# $1 becomes "456", $2 becomes "high", $3 becomes "alice"
```

- Access arguments individually in different parts of your command
- Provide defaults for missing arguments
- Build more structured commands with specific parameter roles

#### Bash command execution

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

#### File references

```
# Reference a specific file

Review the implementation in @src/utils/helpers.js

# Reference multiple files

Compare @src/old-version.js with @src/new-version.js
```

#### Thinking mode

### Frontmatter

```
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

```
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

## Plugin commands

### How plugin commands work

- **Namespaced**: Commands can use the format `/plugin-name:command-name` to avoid conflicts (plugin prefix is optional unless there are name collisions)
- **Automatically available**: Once a plugin is installed and enabled, its commands appear in `/help`
- **Fully integrated**: Support all command features (arguments, frontmatter, bash execution, file references)

### Plugin command structure

```
---
description: Brief description of what the command does
---

# Command Name

Detailed instructions for Claude on how to execute this command.
Include specific guidance on parameters, expected outcomes, and any special considerations.
```

- **Arguments**: Use placeholders like `{arg1}` in command descriptions
- **Subdirectories**: Organize commands in subdirectories for namespacing
- **Bash integration**: Commands can execute shell scripts and programs
- **File references**: Commands can reference and modify project files

### Invocation patterns

```
/command-name
```

```
/plugin-name:command-name
```

```
/command-name arg1 arg2
```

## MCP slash commands

### Command format

```
/mcp__<server-name>__<prompt-name> [arguments]
```

#### Dynamic discovery

- An MCP server is connected and active
- The server exposes prompts through the MCP protocol
- The prompts are successfully retrieved during connection

```
# Without arguments
> /mcp__github__list_prs

# With arguments
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

#### Naming conventions

- Spaces and special characters become underscores
- Names are lowercase for consistency

### Managing MCP connections

- View all configured MCP servers
- Check connection status
- Authenticate with OAuth-enabled servers
- Clear authentication tokens
- View available tools and prompts from each server

### MCP permissions and wildcards

- `mcp__github` (approves all GitHub tools)
- `mcp__github__*` (wildcard syntax, also approves all GitHub tools)
- `mcp__github__get_issue`
- `mcp__github__list_issues`

## SlashCommand tool

```
> Run /write-unit-test when you are about to start writing tests.
```

### SlashCommand tool supported commands

- Are user-defined. Built-in commands like `/compact` and `/init` are *not* supported.
- Have the `description` frontmatter field populated. The description is used in the context.

### Disable SlashCommand tool

```
/permissions
# Add to deny rules: SlashCommand
```

### Disable specific commands only

### SlashCommand permission rules

- **Exact match**: `SlashCommand:/commit` (allows only `/commit` with no arguments)
- **Prefix match**: `SlashCommand:/review-pr:*` (allows `/review-pr` with any arguments)

### Character budget limit

- **Default limit**: 15,000 characters
- **Custom limit**: Set via `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable

## Skills vs slash commands

### Use slash commands for

- Simple prompt snippets you use often
- Quick reminders or templates
- Frequently used instructions that fit in one file
- `/review` → “Review this code for bugs and suggest improvements”
- `/explain` → “Explain this code in simple terms”
- `/optimize` → “Analyze this code for performance issues”

### Use Skills for

- Complex workflows with multiple steps
- Capabilities requiring scripts or utilities
- Knowledge organized across multiple files
- Team workflows you want to standardize
- PDF processing Skill with form-filling scripts and validation
- Data analysis Skill with reference docs for different data types
- Documentation Skill with style guides and templates

### Key differences

### Example comparison

```
# .claude/commands/review.md
Review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
```

```
.claude/skills/code-review/
├── SKILL.md (overview and workflows)
├── SECURITY.md (security checklist)
├── PERFORMANCE.md (performance patterns)
├── STYLE.md (style guide reference)
└── scripts/
    └── run-linters.sh
```

### When to use each

- You invoke the same prompt repeatedly
- The prompt fits in a single file
- You want explicit control over when it runs
- Claude should discover the capability automatically
- Multiple files or scripts are needed
- Complex workflows with validation steps
- Team needs standardized, detailed guidance

## See also

- [Plugins](/docs/en/plugins) - Extend Claude Code with custom commands through plugins
- [Identity and Access Management](/docs/en/iam) - Complete guide to permissions, including MCP tool permissions
- [Interactive mode](/docs/en/interactive-mode) - Shortcuts, input modes, and interactive features
- [CLI reference](/docs/en/cli-reference) - Command-line flags and options
- [Settings](/docs/en/settings) - Configuration options
- [Memory management](/docs/en/memory) - Managing Claude’s memory across sessions

Was this page helpful?
