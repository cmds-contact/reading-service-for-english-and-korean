# Plugins reference

English

# Plugins reference

Complete technical reference for Claude Code plugin system, including schemas, CLI commands, and component specifications.

> Looking to install plugins? See [Discover and install plugins](/docs/en/discover-plugins). For creating plugins, see [Plugins](/docs/en/plugins). For distributing plugins, see [Plugin marketplaces](/docs/en/plugin-marketplaces).

## Plugin components reference

### Commands

### Agents

```
---
description: What this agent specializes in
capabilities: ["task1", "task2", "task3"]
---

# Agent Name

Detailed description of the agent's role, expertise, and when Claude should invoke it.

## Capabilities
- Specific task the agent excels at
- Another specialized capability
- When to use this agent vs others

## Context and examples
Provide examples of when this agent should be used and what kinds of problems it solves.
```

- Agents appear in the `/agents` interface
- Claude can invoke agents automatically based on task context
- Agents can be invoked manually by users
- Plugin agents work alongside built-in Claude agents

### Skills

```
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (optional)
│   └── scripts/ (optional)
└── code-reviewer/
    └── SKILL.md
```

- Plugin Skills are automatically discovered when the plugin is installed
- Claude autonomously invokes Skills based on matching task context
- Skills can include supporting files alongside SKILL.md
- [Use Skills in Claude Code](/docs/en/skills)
- [Agent Skills overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview#skill-structure)

### Hooks

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

- `PreToolUse`: Before Claude uses any tool
- `PostToolUse`: After Claude successfully uses any tool
- `PostToolUseFailure`: After Claude tool execution fails
- `PermissionRequest`: When a permission dialog is shown
- `UserPromptSubmit`: When user submits a prompt
- `Notification`: When Claude Code sends notifications
- `Stop`: When Claude attempts to stop
- `SubagentStart`: When a subagent is started
- `SubagentStop`: When a subagent attempts to stop
- `SessionStart`: At the beginning of sessions
- `SessionEnd`: At the end of sessions
- `PreCompact`: Before conversation history is compacted
- `command`: Execute shell commands or scripts
- `prompt`: Evaluate a prompt with an LLM (uses `$ARGUMENTS` placeholder for context)
- `agent`: Run an agentic verifier with tools for complex verification tasks

### MCP servers

```
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

- Plugin MCP servers start automatically when the plugin is enabled
- Servers appear as standard MCP tools in Claude’s toolkit
- Server capabilities integrate seamlessly with Claude’s existing tools
- Plugin servers can be configured independently of user MCP servers

### LSP servers

> Looking to use LSP plugins? Install them from the official marketplace—search for “lsp” in the `/plugin` Discover tab. This section documents how to create LSP plugins for languages not covered by the official marketplace.

- **Instant diagnostics**: Claude sees errors and warnings immediately after each edit
- **Code navigation**: go to definition, find references, and hover information
- **Language awareness**: type information and documentation for code symbols

```
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

```
{
  "name": "my-plugin",
  "lspServers": {
    "go": {
      "command": "gopls",
      "args": ["serve"],
      "extensionToLanguage": {
        ".go": "go"
      }
    }
  }
}
```

```
"loggingConfig": {
  "args": ["--log-level", "4"],
  "env": {
    "TSS_LOG": "-level verbose -file ${CLAUDE_PLUGIN_LSP_LOG_FILE}"
  }
}
```

> **You must install the language server binary separately.** LSP plugins configure how Claude Code connects to a language server, but they don’t include the server itself. If you see `Executable not found in $PATH` in the `/plugin` Errors tab, install the required binary for your language.

## Plugin installation scopes

## Plugin manifest schema

### Complete schema

```
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "Brief plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "skills": "./custom/skills/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json",
  "outputStyles": "./styles/",
  "lspServers": "./.lsp.json"
}
```

### Required fields

### Metadata fields

### Component path fields

### Path behavior rules

- If `commands/` exists, it’s loaded in addition to custom command paths
- All paths must be relative to plugin root and start with `./`
- Commands from custom paths use the same naming and namespacing rules
- Multiple paths can be specified as arrays for flexibility

```
{
  "commands": [
    "./specialized/deploy.md",
    "./utilities/batch-process.md"
  ],
  "agents": [
    "./custom-agents/reviewer.md",
    "./custom-agents/tester.md"
  ]
}
```

### Environment variables

```
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/process.sh"
          }
        ]
      }
    ]
  }
}
```

## Plugin caching and file resolution

### How plugin caching works

- **For marketplace plugins with relative paths**: The path specified in the `source` field is copied recursively. For example, if your marketplace entry specifies `"source": "./plugins/my-plugin"`, the entire `./plugins` directory is copied.
- For plugins with `.claude-plugin/plugin.json`: The implicit root directory (the directory containing `.claude-plugin/plugin.json`) is copied recursively.

### Path traversal limitations

### Working with external dependencies

```
# Inside your plugin directory
ln -s /path/to/shared-utils ./shared-utils
```

```
{
  "name": "my-plugin",
  "source": "./",
  "description": "Plugin that needs root-level access",
  "commands": ["./plugins/my-plugin/commands/"],
  "agents": ["./plugins/my-plugin/agents/"],
  "strict": false
}
```

> Symlinks that point to locations outside the plugin’s logical root are followed during copying. This provides flexibility while maintaining the security benefits of the caching system.

## Plugin directory structure

### Standard plugin layout

```
enterprise-plugin/
├── .claude-plugin/           # Metadata directory
│   └── plugin.json          # Required: plugin manifest
├── commands/                 # Default command location
│   ├── status.md
│   └── logs.md
├── agents/                   # Default agent location
│   ├── security-reviewer.md
│   ├── performance-tester.md
│   └── compliance-checker.md
├── skills/                   # Agent Skills
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── hooks/                    # Hook configurations
│   ├── hooks.json           # Main hook config
│   └── security-hooks.json  # Additional hooks
├── .mcp.json                # MCP server definitions
├── .lsp.json                # LSP server configurations
├── scripts/                 # Hook and utility scripts
│   ├── security-scan.sh
│   ├── format-code.py
│   └── deploy.js
├── LICENSE                  # License file
└── CHANGELOG.md             # Version history
```

> The `.claude-plugin/` directory contains the `plugin.json` file. All other directories (commands/, agents/, skills/, hooks/) must be at the plugin root, not inside `.claude-plugin/`.

### File locations reference

## CLI commands reference

### plugin install

```
claude plugin install <plugin> [options]
```

- `<plugin>`: Plugin name or `plugin-name@marketplace-name` for a specific marketplace

```
# Install to user scope (default)
claude plugin install formatter@my-marketplace

# Install to project scope (shared with team)
claude plugin install formatter@my-marketplace --scope project

# Install to local scope (gitignored)
claude plugin install formatter@my-marketplace --scope local
```

### plugin uninstall

```
claude plugin uninstall <plugin> [options]
```

- `<plugin>`: Plugin name or `plugin-name@marketplace-name`

### plugin enable

```
claude plugin enable <plugin> [options]
```

### plugin disable

```
claude plugin disable <plugin> [options]
```

### plugin update

```
claude plugin update <plugin> [options]
```

## Debugging and development tools

### Debugging commands

```
claude --debug
```

- Which plugins are being loaded
- Any errors in plugin manifests
- Command, agent, and hook registration
- MCP server initialization

### Common issues

### Example error messages

- `Invalid JSON syntax: Unexpected token } in JSON at position 142`: check for missing commas, extra commas, or unquoted strings
- `Plugin has an invalid manifest file at .claude-plugin/plugin.json. Validation errors: name: Required`: a required field is missing
- `Plugin has a corrupt manifest file at .claude-plugin/plugin.json. JSON parse error: ...`: JSON syntax error
- `Warning: No commands found in plugin my-plugin custom directory: ./cmds. Expected .md files or SKILL.md in subdirectories.`: command path exists but contains no valid command files
- `Plugin directory not found at path: ./plugins/my-plugin. Check that the marketplace entry has the correct path.`: the `source` path in marketplace.json points to a non-existent directory
- `Plugin my-plugin has conflicting manifests: both plugin.json and marketplace entry specify components.`: remove duplicate component definitions or set `strict: true` in marketplace entry

### Hook troubleshooting

- Check the script is executable: `chmod +x ./scripts/your-script.sh`
- Verify the shebang line: First line should be `#!/bin/bash` or `#!/usr/bin/env bash`
- Check the path uses `${CLAUDE_PLUGIN_ROOT}`: `"command": "${CLAUDE_PLUGIN_ROOT}/scripts/your-script.sh"`
- Test the script manually: `./scripts/your-script.sh`
- Verify the event name is correct (case-sensitive): `PostToolUse`, not `postToolUse`
- Check the matcher pattern matches your tools: `"matcher": "Write|Edit"` for file operations
- Confirm the hook type is valid: `command`, `prompt`, or `agent`

### MCP server troubleshooting

- Check the command exists and is executable
- Verify all paths use `${CLAUDE_PLUGIN_ROOT}` variable
- Check the MCP server logs: `claude --debug` shows initialization errors
- Test the server manually outside of Claude Code
- Ensure the server is properly configured in `.mcp.json` or `plugin.json`
- Verify the server implements the MCP protocol correctly
- Check for connection timeouts in debug output

### Directory structure mistakes

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json      ← Only manifest here
├── commands/            ← At root level
├── agents/              ← At root level
└── hooks/               ← At root level
```

- Run `claude --debug` and look for “loading plugin” messages
- Check that each component directory is listed in the debug output
- Verify file permissions allow reading the plugin files

## Distribution and versioning reference

### Version management

```
{
  "name": "my-plugin",
  "version": "2.1.0"
}
```

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward-compatible additions)
- **PATCH**: Bug fixes (backward-compatible fixes)
- Start at `1.0.0` for your first stable release
- Update the version in `plugin.json` before distributing changes
- Document changes in a `CHANGELOG.md` file
- Use pre-release versions like `2.0.0-beta.1` for testing

## See also

- [Plugins](/docs/en/plugins) - Tutorials and practical usage
- [Plugin marketplaces](/docs/en/plugin-marketplaces) - Creating and managing marketplaces
- [Slash commands](/docs/en/slash-commands) - Command development details
- [Subagents](/docs/en/sub-agents) - Agent configuration and capabilities
- [Agent Skills](/docs/en/skills) - Extend Claude’s capabilities
- [Hooks](/docs/en/hooks) - Event handling and automation
- [MCP](/docs/en/mcp) - External tool integration
- [Settings](/docs/en/settings) - Configuration options for plugins

Was this page helpful?
