# Claude Code settings

English

# Claude Code settings

Configure Claude Code with global and project-level settings, and environment variables.

## Configuration scopes

### Available scopes

### When to use each scope

- Security policies that must be enforced organization-wide
- Compliance requirements that can’t be overridden
- Standardized configurations deployed by IT/DevOps
- Personal preferences you want everywhere (themes, editor settings)
- Tools and plugins you use across all projects
- API keys and authentication (stored securely)
- Team-shared settings (permissions, hooks, MCP servers)
- Plugins the whole team should have
- Standardizing tooling across collaborators
- Personal overrides for a specific project
- Testing configurations before sharing with the team
- Machine-specific settings that won’t work for others

### How scopes interact

- **Enterprise** (highest) - can’t be overridden by anything
- **Command line arguments** - temporary session overrides
- **Local** - overrides project and user settings
- **Project** - overrides user settings
- **User** (lowest) - applies when nothing else specifies the setting

### What uses scopes

## Settings files

- **User settings** are defined in `~/.claude/settings.json` and apply to all
projects.
- **Project settings** are saved in your project directory:

`.claude/settings.json` for settings that are checked into source control and shared with your team
`.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore `.claude/settings.local.json` when it is created.
- `.claude/settings.json` for settings that are checked into source control and shared with your team
- `.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore `.claude/settings.local.json` when it is created.
- **Managed settings** (Enterprise): Enterprise administrators can configure and distribute Claude Code settings to their organization through the [Claude.ai admin console](https://claude.ai/admin-settings/claude-code). These settings are fetched automatically when users authenticate, take precedence over user and project settings, and cannot be overridden locally. This feature is available to Claude for Enterprise customers. If you don’t see this option in your admin console, contact your Anthropic account team to have the feature enabled.
For organizations that prefer file-based policy distribution, Claude Code also supports `managed-settings.json` and `managed-mcp.json` files that can be deployed to system directories:

macOS: `/Library/Application Support/ClaudeCode/`
Linux and WSL: `/etc/claude-code/`
Windows: `C:\Program Files\ClaudeCode\`

These are system-wide paths (not user home directories like `~/Library/...`) that require administrator privileges. They are designed to be deployed by IT administrators.
See [Enterprise managed settings](/docs/en/iam#enterprise-managed-settings) and [Enterprise MCP configuration](/docs/en/mcp#enterprise-mcp-configuration) for details.
Enterprise deployments can also restrict **plugin marketplace additions** using
`strictKnownMarketplaces`. For more information, see [Enterprise marketplace restrictions](/docs/en/plugin-marketplaces#enterprise-marketplace-restrictions).
- macOS: `/Library/Application Support/ClaudeCode/`
- Linux and WSL: `/etc/claude-code/`
- Windows: `C:\Program Files\ClaudeCode\`

> These are system-wide paths (not user home directories like `~/Library/...`) that require administrator privileges. They are designed to be deployed by IT administrators.

> Enterprise deployments can also restrict **plugin marketplace additions** using
> `strictKnownMarketplaces`. For more information, see [Enterprise marketplace restrictions](/docs/en/plugin-marketplaces#enterprise-marketplace-restrictions).

- **Other configuration** is stored in `~/.claude.json`. This file contains your preferences (theme, notification settings, editor mode), OAuth session, [MCP server](/docs/en/mcp) configurations for user and local scopes, per-project state (allowed tools, trust settings), and various caches. Project-scoped MCP servers are stored separately in `.mcp.json`.

```
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  },
  "companyAnnouncements": [
    "Welcome to Acme Corp! Review our code guidelines at docs.acme.com",
    "Reminder: Code reviews required for all PRs",
    "New security policy in effect"
  ]
}
```

### Available settings

### Permission settings

### Sandbox settings

```
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

- Use `Read` deny rules to block Claude from reading specific files or directories
- Use `Edit` allow rules to let Claude write to directories beyond the current working directory
- Use `Edit` deny rules to block writes to specific paths
- Use `WebFetch` allow/deny rules to control which network domains Claude can access

### Attribution settings

- Commits use [git trailers](https://git-scm.com/docs/git-interpret-trailers) (like `Co-Authored-By`) by default,  which can be customized or disabled
- Pull request descriptions are plain text

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

```
{
  "attribution": {
    "commit": "Generated with AI\n\nCo-Authored-By: AI <ai@example.com>",
    "pr": ""
  }
}
```

> The `attribution` setting takes precedence over the deprecated `includeCoAuthoredBy` setting. To hide all attribution, set `commit` and `pr` to empty strings.

### File suggestion settings

```
{
  "fileSuggestion": {
    "type": "command",
    "command": "~/.claude/file-suggestion.sh"
  }
}
```

```
{"query": "src/comp"}
```

```
src/components/Button.tsx
src/components/Modal.tsx
src/components/Form.tsx
```

```
#!/bin/bash
query=$(cat | jq -r '.query')
your-repo-file-index --query "$query" | head -20
```

### Hook configuration

- Managed hooks and SDK hooks are loaded
- User hooks, project hooks, and plugin hooks are blocked

```
{
  "allowManagedHooksOnly": true
}
```

### Settings precedence

- **Managed settings** (Enterprise)

Remote settings configured via the [Claude.ai admin console](https://claude.ai/admin-settings/claude-code)
Fetched automatically when users authenticate
Cannot be overridden
- Remote settings configured via the [Claude.ai admin console](https://claude.ai/admin-settings/claude-code)
- Fetched automatically when users authenticate
- Cannot be overridden
- **File-based managed settings** (`managed-settings.json`)

Policies deployed by IT/DevOps to system directories
Cannot be overridden by user or project settings
Ignored when remote managed settings are configured
- Policies deployed by IT/DevOps to system directories
- Cannot be overridden by user or project settings
- Ignored when remote managed settings are configured
- **Command line arguments**

Temporary overrides for a specific session
- Temporary overrides for a specific session
- **Local project settings** (`.claude/settings.local.json`)

Personal project-specific settings
- Personal project-specific settings
- **Shared project settings** (`.claude/settings.json`)

Team-shared project settings in source control
- Team-shared project settings in source control
- **User settings** (`~/.claude/settings.json`)

Personal global settings
- Personal global settings

### Key points about the configuration system

- Memory files (`CLAUDE.md`): Contain instructions and context that Claude loads at startup
- **Settings files (JSON)**: Configure permissions, environment variables, and tool behavior
- **Slash commands**: Custom commands that can be invoked during a session with `/command-name`
- **MCP servers**: Extend Claude Code with additional tools and integrations
- **Precedence**: Higher-level configurations (Enterprise) override lower-level ones (User/Project)
- **Inheritance**: Settings are merged, with more specific settings adding to or overriding broader ones

### System prompt

### Excluding sensitive files

```
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

## Subagent configuration

- **User subagents**: `~/.claude/agents/` - Available across all your projects
- **Project subagents**: `.claude/agents/` - Specific to your project and can be shared with your team

## Plugin configuration

### Plugin settings

```
{
  "enabledPlugins": {
    "formatter@acme-tools": true,
    "deployer@acme-tools": true,
    "analyzer@security-plugins": false
  },
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": "github",
      "repo": "acme-corp/claude-plugins"
    }
  }
}
```

#### enabledPlugins

- **User settings** (`~/.claude/settings.json`): Personal plugin preferences
- **Project settings** (`.claude/settings.json`): Project-specific plugins shared with team
- **Local settings** (`.claude/settings.local.json`): Per-machine overrides (not committed)

```
{
  "enabledPlugins": {
    "code-formatter@team-tools": true,
    "deployment-tools@team-tools": true,
    "experimental-features@personal": false
  }
}
```

#### extraKnownMarketplaces

- Team members are prompted to install the marketplace when they trust the folder
- Team members are then prompted to install plugins from that marketplace
- Users can skip unwanted marketplaces or plugins (stored in user settings)
- Installation respects trust boundaries and requires explicit consent

```
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": {
        "source": "github",
        "repo": "acme-corp/claude-plugins"
      }
    },
    "security-plugins": {
      "source": {
        "source": "git",
        "url": "https://git.example.com/security/plugins.git"
      }
    }
  }
}
```

- `github`: GitHub repository (uses `repo`)
- `git`: Any git URL (uses `url`)
- `directory`: Local filesystem path (uses `path`, for development only)

#### strictKnownMarketplaces

- **macOS**: `/Library/Application Support/ClaudeCode/managed-settings.json`
- **Linux and WSL**: `/etc/claude-code/managed-settings.json`
- **Windows**: `C:\ProgramData\ClaudeCode\managed-settings.json`
- Only available in enterprise managed settings (`managed-settings.json`)
- Cannot be overridden by user or project settings (highest precedence)
- Enforced BEFORE network/filesystem operations (blocked sources never execute)
- Uses exact matching for source specifications (including `ref`, `path` for git sources)
- `undefined` (default): No restrictions - users can add any marketplace
- Empty array `[]`: Complete lockdown - users cannot add any new marketplaces
- List of sources: Users can only add marketplaces that match exactly
- **GitHub repositories**:

```
{ "source": "github", "repo": "acme-corp/approved-plugins" }
{ "source": "github", "repo": "acme-corp/security-tools", "ref": "v2.0" }
{ "source": "github", "repo": "acme-corp/plugins", "ref": "main", "path": "marketplace" }
```

- **Git repositories**:

```
{ "source": "git", "url": "https://gitlab.example.com/tools/plugins.git" }
{ "source": "git", "url": "https://bitbucket.org/acme-corp/plugins.git", "ref": "production" }
{ "source": "git", "url": "ssh://git@git.example.com/plugins.git", "ref": "v3.1", "path": "approved" }
```

- **URL-based marketplaces**:

```
{ "source": "url", "url": "https://plugins.example.com/marketplace.json" }
{ "source": "url", "url": "https://cdn.example.com/marketplace.json", "headers": { "Authorization": "Bearer ${TOKEN}" } }
```

- **NPM packages**:

```
{ "source": "npm", "package": "@acme-corp/claude-plugins" }
{ "source": "npm", "package": "@acme-corp/approved-marketplace" }
```

- **File paths**:

```
{ "source": "file", "path": "/usr/local/share/claude/acme-marketplace.json" }
{ "source": "file", "path": "/opt/acme-corp/plugins/marketplace.json" }
```

- **Directory paths**:

```
{ "source": "directory", "path": "/usr/local/share/claude/acme-plugins" }
{ "source": "directory", "path": "/opt/acme-corp/approved-marketplaces" }
```

```
{
  "strictKnownMarketplaces": [
    {
      "source": "github",
      "repo": "acme-corp/approved-plugins"
    },
    {
      "source": "github",
      "repo": "acme-corp/security-tools",
      "ref": "v2.0"
    },
    {
      "source": "url",
      "url": "https://plugins.example.com/marketplace.json"
    },
    {
      "source": "npm",
      "package": "@acme-corp/compliance-plugins"
    }
  ]
}
```

```
{
  "strictKnownMarketplaces": []
}
```

- The `repo` or `url` must match exactly
- The `ref` field must match exactly (or both be undefined)
- The `path` field must match exactly (or both be undefined)

```
// These are DIFFERENT sources:
{ "source": "github", "repo": "acme-corp/plugins" }
{ "source": "github", "repo": "acme-corp/plugins", "ref": "main" }

// These are also DIFFERENT:
{ "source": "github", "repo": "acme-corp/plugins", "path": "marketplace" }
{ "source": "github", "repo": "acme-corp/plugins" }
```

```
{
  "strictKnownMarketplaces": [
    { "source": "github", "repo": "acme-corp/plugins" }
  ]
}
```

```
{
  "extraKnownMarketplaces": {
    "acme-tools": {
      "source": { "source": "github", "repo": "acme-corp/plugins" }
    }
  }
}
```

- Restrictions are checked BEFORE any network requests or filesystem operations
- When blocked, users see clear error messages indicating the source is blocked by enterprise policy
- The restriction applies only to adding NEW marketplaces; previously installed marketplaces remain accessible
- Enterprise managed settings have the highest precedence and cannot be overridden

### Managing plugins

- Browse available plugins from marketplaces
- Install/uninstall plugins
- Enable/disable plugins
- View plugin details (commands, agents, hooks provided)
- Add/remove marketplaces

## Environment variables

> All environment variables can also be configured in `settings.json`. This is useful as a way to automatically set environment variables for each session, or to roll out a set of environment variables for your whole team or organization.

## Tools available to Claude

### Bash tool behavior

- **Working directory persists**: When Claude changes the working directory (for example, `cd /path/to/dir`), subsequent Bash commands will execute in that directory. You can use `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR=1` to reset to the project directory after each command.
- **Environment variables do NOT persist**: Environment variables set in one Bash command (for example, `export MY_VAR=value`) are **not** available in subsequent Bash commands. Each Bash command runs in a fresh shell environment.

```
conda activate myenv
# or: source /path/to/venv/bin/activate
claude
```

```
export CLAUDE_ENV_FILE=/path/to/env-setup.sh
claude
```

```
conda activate myenv
# or: source /path/to/venv/bin/activate
# or: export MY_VAR=value
```

```
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "echo 'conda activate myenv' >> \"$CLAUDE_ENV_FILE\""
      }]
    }]
  }
}
```

### Extending tools with hooks

## See also

- [Identity and Access Management](/docs/en/iam#configuring-permissions) - Learn about Claude Code’s permission system
- [IAM and access control](/docs/en/iam#enterprise-managed-settings) - Enterprise policy management
- [Troubleshooting](/docs/en/troubleshooting#auto-updater-issues) - Solutions for common configuration issues

Was this page helpful?
