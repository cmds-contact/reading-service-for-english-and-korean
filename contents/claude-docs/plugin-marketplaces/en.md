# Create and distribute a plugin marketplace

English

# Create and distribute a plugin marketplace

Build and host plugin marketplaces to distribute Claude Code extensions across teams and communities.

## Overview

- **Creating plugins**: build one or more plugins with commands, agents, hooks, MCP servers, or LSP servers. This guide assumes you already have plugins to distribute; see [Create plugins](/docs/en/plugins) for details on how to create them.
- **Creating a marketplace file**: define a `marketplace.json` that lists your plugins and where to find them (see [Create the marketplace file](#create-the-marketplace-file)).
- **Host the marketplace**: push to GitHub, GitLab, or another git host (see [Host and distribute marketplaces](#host-and-distribute-marketplaces)).
- **Share with users**: users add your marketplace with `/plugin marketplace add` and install individual plugins (see [Discover and install plugins](/docs/en/discover-plugins)).

## Walkthrough: create a local marketplace

Create the directory structure

```
mkdir -p my-marketplace/.claude-plugin
mkdir -p my-marketplace/plugins/review-plugin/.claude-plugin
mkdir -p my-marketplace/plugins/review-plugin/commands
```

Create the plugin command

```
Review the code I've selected or the recent changes for:
- Potential bugs or edge cases
- Security concerns
- Performance issues
- Readability improvements

Be concise and actionable.
```

Create the plugin manifest

```
{
  "name": "review-plugin",
  "description": "Adds a /review command for quick code reviews",
  "version": "1.0.0"
}
```

Create the marketplace file

```
{
  "name": "my-plugins",
  "owner": {
    "name": "Your Name"
  },
  "plugins": [
    {
      "name": "review-plugin",
      "source": "./plugins/review-plugin",
      "description": "Adds a /review command for quick code reviews"
    }
  ]
}
```

Add and install

```
/plugin marketplace add ./my-marketplace
/plugin install review-plugin@my-plugins
```

Try it out

```
/review
```

> **How plugins are installed**: When users install a plugin, Claude Code copies the plugin directory to a cache location. This means plugins can’t reference files outside their directory using paths like `../shared-utils`, because those files won’t be copied.If you need to share files across plugins, use symlinks (which are followed during copying) or restructure your marketplace so the shared directory is inside the plugin source path. See [Plugin caching and file resolution](/docs/en/plugins-reference#plugin-caching-and-file-resolution) for details.

```
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

## Marketplace schema

### Required fields

> **Reserved names**: The following marketplace names are reserved for official Anthropic use and cannot be used by third-party marketplaces: `claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `life-sciences`. Names that impersonate official marketplaces (like `official-claude-plugins` or `anthropic-tools-v2`) are also blocked.

### Owner fields

### Optional metadata

## Plugin entries

### Optional plugin fields

## Plugin sources

### Relative paths

```
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

### GitHub repositories

```
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

### Git repositories

```
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

### Advanced plugin entries

```
{
  "name": "enterprise-tools",
  "source": {
    "source": "github",
    "repo": "company/enterprise-plugin"
  },
  "description": "Enterprise workflow automation tools",
  "version": "2.1.0",
  "author": {
    "name": "Enterprise Team",
    "email": "enterprise@example.com"
  },
  "homepage": "https://docs.example.com/plugins/enterprise-tools",
  "repository": "https://github.com/company/enterprise-plugin",
  "license": "MIT",
  "keywords": ["enterprise", "workflow", "automation"],
  "category": "productivity",
  "commands": [
    "./commands/core/",
    "./commands/enterprise/",
    "./commands/experimental/preview.md"
  ],
  "agents": ["./agents/security-reviewer.md", "./agents/compliance-checker.md"],
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "enterprise-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"]
    }
  },
  "strict": false
}
```

- `commands` and `agents`: You can specify multiple directories or individual files. Paths are relative to the plugin root.
- `${CLAUDE_PLUGIN_ROOT}`: Use this variable in hooks and MCP server configs to reference files within the plugin’s installation directory. This is necessary because plugins are copied to a cache location when installed.
- `strict: false`: Since this is set to false, the plugin doesn’t need its own `plugin.json`. The marketplace entry defines everything.

## Host and distribute marketplaces

### Host on GitHub (recommended)

- **Create a repository**: Set up a new repository for your marketplace
- **Add marketplace file**: Create `.claude-plugin/marketplace.json` with your plugin definitions
- **Share with teams**: Users add your marketplace with `/plugin marketplace add owner/repo`

### Host on other git services

```
/plugin marketplace add https://gitlab.com/company/plugins.git
```

### Test locally before distribution

```
/plugin marketplace add ./my-local-marketplace
/plugin install test-plugin@my-local-marketplace
```

### Require marketplaces for your team

```
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "your-org/claude-plugins"
      }
    }
  }
}
```

```
{
  "enabledPlugins": {
    "code-formatter@company-tools": true,
    "deployment-tools@company-tools": true
  }
}
```

### Enterprise marketplace restrictions

#### Common configurations

```
{
  "strictKnownMarketplaces": []
}
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
    }
  ]
}
```

#### How restrictions work

- For GitHub sources: `repo` is required, and `ref` or `path` must also match if specified in the allowlist
- For URL sources: the full URL must match exactly

## Validation and testing

```
claude plugin validate .
```

```
/plugin validate .
```

```
/plugin marketplace add ./path/to/marketplace
```

```
/plugin install test-plugin@marketplace-name
```

## Troubleshooting

### Marketplace not loading

- Verify the marketplace URL is accessible
- Check that `.claude-plugin/marketplace.json` exists at the specified path
- Ensure JSON syntax is valid using `claude plugin validate` or `/plugin validate`
- For private repositories, confirm you have access permissions

### Marketplace validation errors

- `Marketplace has no plugins defined`: add at least one plugin to the `plugins` array
- `No marketplace description provided`: add `metadata.description` to help users understand your marketplace
- `Plugin "x" uses npm source which is not yet fully implemented`: use `github` or local path sources instead

### Plugin installation failures

- Verify plugin source URLs are accessible
- Check that plugin directories contain required files
- For GitHub sources, ensure repositories are public or you have access
- Test plugin sources manually by cloning/downloading

### Files not found after installation

## See also

- [Discover and install prebuilt plugins](/docs/en/discover-plugins) - Installing plugins from existing marketplaces
- [Plugins](/docs/en/plugins) - Creating your own plugins
- [Plugins reference](/docs/en/plugins-reference) - Complete technical specifications and schemas
- [Plugin settings](/docs/en/settings#plugin-settings) - Plugin configuration options
- [strictKnownMarketplaces reference](/docs/en/settings#strictknownmarketplaces) - Enterprise marketplace restrictions

Was this page helpful?
