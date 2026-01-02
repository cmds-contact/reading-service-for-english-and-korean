# Create plugins

English

# Create plugins

Create custom plugins to extend Claude Code with slash commands, agents, hooks, Skills, and MCP servers.

## When to use plugins vs standalone configuration

- You’re customizing Claude Code for a single project
- The configuration is personal and doesn’t need to be shared
- You’re experimenting with slash commands or hooks before packaging them
- You want short slash command names like `/hello` or `/review`
- You want to share functionality with your team or community
- You need the same slash commands/agents across multiple projects
- You want version control and easy updates for your extensions
- You’re distributing through a marketplace
- You’re okay with namespaced slash commands like `/my-plugin:hello` (namespacing prevents conflicts between plugins)

> Start with standalone configuration in `.claude/` for quick iteration, then [convert to a plugin](#convert-existing-configurations-to-plugins) when you’re ready to share.

## Quickstart

### Prerequisites

- Claude Code [installed and authenticated](/docs/en/quickstart#step-1-install-claude-code)
- Claude Code version 1.0.33 or later (run `claude --version` to check)

> If you don’t see the `/plugin` command, update Claude Code to the latest version. See [Troubleshooting](/docs/en/troubleshooting) for upgrade instructions.

### Create your first plugin

Create the plugin directory

```
mkdir my-first-plugin
```

Create the plugin manifest

```
mkdir my-first-plugin/.claude-plugin
```

```
{
"name": "my-first-plugin",
"description": "A greeting plugin to learn the basics",
"version": "1.0.0",
"author": {
"name": "Your Name"
}
}
```

Add a slash command

```
mkdir my-first-plugin/commands
```

```
---
description: Greet the user with a friendly message
---

# Hello Command

Greet the user warmly and ask how you can help them today.
```

Test your plugin

```
claude --plugin-dir ./my-first-plugin
```

```
/my-first-plugin:hello
```

> **Why namespacing?** Plugin slash commands are always namespaced (like `/greet:hello`) to prevent conflicts when multiple plugins have commands with the same name.To change the namespace prefix, update the `name` field in `plugin.json`.

Add slash command arguments

```
---
description: Greet the user with a personalized message
---

# Hello Command

Greet the user named "$ARGUMENTS" warmly and ask how you can help them today. Make the greeting personal and encouraging.
```

```
/my-first-plugin:hello Alex
```

- **Plugin manifest** (`.claude-plugin/plugin.json`): describes your plugin’s metadata
- **Commands directory** (`commands/`): contains your custom slash commands
- **Command arguments** (`$ARGUMENTS`): captures user input for dynamic behavior

> The `--plugin-dir` flag is useful for development and testing. When you’re ready to share your plugin with others, see [Create and distribute a plugin marketplace](/docs/en/plugin-marketplaces).

## Plugin structure overview

> **Common mistake**: Don’t put `commands/`, `agents/`, `skills/`, or `hooks/` inside the `.claude-plugin/` directory. Only `plugin.json` goes inside `.claude-plugin/`. All other directories must be at the plugin root level.

> **Next steps**: Ready to add more features? Jump to [Develop more complex plugins](#develop-more-complex-plugins) to add agents, hooks, MCP servers, and LSP servers. For complete technical specifications of all plugin components, see [Plugins reference](/docs/en/plugins-reference).

## Develop more complex plugins

### Add Skills to your plugin

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── code-review/
        └── SKILL.md
```

```
---
name: code-review
description: Reviews code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
---

When reviewing code, check for:
1. Code organization and structure
2. Error handling
3. Security concerns
4. Test coverage
```

### Add LSP servers to your plugin

> For common languages like TypeScript, Python, and Rust, install the pre-built LSP plugins from the official marketplace. Create custom LSP plugins only when you need support for languages not already covered.

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

### Organize complex plugins

### Test your plugins locally

```
claude --plugin-dir ./my-plugin
```

- Try your commands with `/command-name`
- Check that agents appear in `/agents`
- Verify hooks work as expected

> You can load multiple plugins at once by specifying the flag multiple times:CopyAsk AIclaude --plugin-dir ./plugin-one --plugin-dir ./plugin-two

```
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

### Debug plugin issues

- **Check the structure**: Ensure your directories are at the plugin root, not inside `.claude-plugin/`
- **Test components individually**: Check each command, agent, and hook separately
- **Use validation and debugging tools**: See [Debugging and development tools](/docs/en/plugins-reference#debugging-and-development-tools) for CLI commands and troubleshooting techniques

### Share your plugins

- **Add documentation**: Include a `README.md` with installation and usage instructions
- **Version your plugin**: Use [semantic versioning](/docs/en/plugins-reference#version-management) in your `plugin.json`
- **Create or use a marketplace**: Distribute through [plugin marketplaces](/docs/en/plugin-marketplaces) for installation
- **Test with others**: Have team members test the plugin before wider distribution

> For complete technical specifications, debugging techniques, and distribution strategies, see [Plugins reference](/docs/en/plugins-reference).

## Convert existing configurations to plugins

### Migration steps

Create the plugin structure

```
mkdir -p my-plugin/.claude-plugin
```

```
{
  "name": "my-plugin",
  "description": "Migrated from standalone configuration",
  "version": "1.0.0"
}
```

Copy your existing files

```
# Copy commands
cp -r .claude/commands my-plugin/

# Copy agents (if any)
cp -r .claude/agents my-plugin/

# Copy skills (if any)
cp -r .claude/skills my-plugin/
```

Migrate hooks

```
mkdir my-plugin/hooks
```

```
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "npm run lint:fix $FILE" }]
      }
    ]
  }
}
```

Test your migrated plugin

### What changes when migrating

> After migrating, you can remove the original files from `.claude/` to avoid duplicates. The plugin version will take precedence when loaded.

## Next steps

### For plugin users

- [Discover and install plugins](/docs/en/discover-plugins): browse marketplaces and install plugins
- [Configure team marketplaces](/docs/en/discover-plugins#configure-team-marketplaces): set up repository-level plugins for your team

### For plugin developers

- [Create and distribute a marketplace](/docs/en/plugin-marketplaces): package and share your plugins
- [Plugins reference](/docs/en/plugins-reference): complete technical specifications
- Dive deeper into specific plugin components:

[Slash commands](/docs/en/slash-commands): command development details
[Subagents](/docs/en/sub-agents): agent configuration and capabilities
[Agent Skills](/docs/en/skills): extend Claude’s capabilities
[Hooks](/docs/en/hooks): event handling and automation
[MCP](/docs/en/mcp): external tool integration
- [Slash commands](/docs/en/slash-commands): command development details
- [Subagents](/docs/en/sub-agents): agent configuration and capabilities
- [Agent Skills](/docs/en/skills): extend Claude’s capabilities
- [Hooks](/docs/en/hooks): event handling and automation
- [MCP](/docs/en/mcp): external tool integration

Was this page helpful?
