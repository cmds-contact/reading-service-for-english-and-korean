# Manage Claude's memory

English

# Manage Claude's memory

Learn how to manage Claude Code’s memory across sessions with different memory locations and best practices.

## Determine memory type

> CLAUDE.local.md files are automatically added to .gitignore, making them ideal for private project-specific preferences that shouldn’t be checked into version control.

## CLAUDE.md imports

```
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

```
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

```
This code span will not be treated as an import: `@anthropic-ai/claude-code`
```

## How Claude looks up memories

## Directly edit memories with /memory

## Set up project memory

```
> /init
```

> Tips:
> Include frequently used commands (build, test, lint) to avoid repeated searches
> Document code style preferences and naming conventions
> Add important architectural patterns specific to your project
> CLAUDE.md memories can be used for both instructions shared with your team and for your individual preferences.

- Include frequently used commands (build, test, lint) to avoid repeated searches
- Document code style preferences and naming conventions
- Add important architectural patterns specific to your project
- CLAUDE.md memories can be used for both instructions shared with your team and for your individual preferences.

## Modular rules with .claude/rules/

### Basic structure

```
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project instructions
│   └── rules/
│       ├── code-style.md   # Code style guidelines
│       ├── testing.md      # Testing conventions
│       └── security.md     # Security requirements
```

### Path-specific rules

```
---
paths: src/api/**/*.ts
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

### Glob patterns

```
---
paths: src/**/*.{ts,tsx}
---

# TypeScript/React Rules
```

```
---
paths: {src,lib}/**/*.ts, tests/**/*.test.ts
---
```

### Subdirectories

```
.claude/rules/
├── frontend/
│   ├── react.md
│   └── styles.md
├── backend/
│   ├── api.md
│   └── database.md
└── general.md
```

### Symlinks

```
# Symlink a shared rules directory
ln -s ~/shared-claude-rules .claude/rules/shared

# Symlink individual rule files
ln -s ~/company-standards/security.md .claude/rules/security.md
```

### User-level rules

```
~/.claude/rules/
├── preferences.md    # Your personal coding preferences
└── workflows.md      # Your preferred workflows
```

> Best practices for `.claude/rules/`:
> **Keep rules focused**: Each file should cover one topic (e.g., `testing.md`, `api-design.md`)
> **Use descriptive filenames**: The filename should indicate what the rules cover
> **Use conditional rules sparingly**: Only add `paths` frontmatter when rules truly apply to specific file types
> **Organize with subdirectories**: Group related rules (e.g., `frontend/`, `backend/`)

- **Keep rules focused**: Each file should cover one topic (e.g., `testing.md`, `api-design.md`)
- **Use descriptive filenames**: The filename should indicate what the rules cover
- **Use conditional rules sparingly**: Only add `paths` frontmatter when rules truly apply to specific file types
- **Organize with subdirectories**: Group related rules (e.g., `frontend/`, `backend/`)

## Organization-level memory management

- Create the enterprise memory file at the **Enterprise policy** location shown in the [memory types table above](#determine-memory-type).
- Deploy via your configuration management system (MDM, Group Policy, Ansible, etc.) to ensure consistent distribution across all developer machines.

## Memory best practices

- **Be specific**: “Use 2-space indentation” is better than “Format code properly”.
- **Use structure to organize**: Format each individual memory as a bullet point and group related memories under descriptive markdown headings.
- **Review periodically**: Update memories as your project evolves to ensure Claude is always using the most up to date information and context.

Was this page helpful?
