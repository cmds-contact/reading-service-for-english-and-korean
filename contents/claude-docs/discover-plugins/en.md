# Discover and install prebuilt plugins through marketplaces

English

# Discover and install prebuilt plugins through marketplaces

Find and install plugins from marketplaces to extend Claude Code with new commands, agents, and capabilities.

## How marketplaces work

Add the marketplace

Install individual plugins

## Official Anthropic marketplace

```
/plugin install plugin-name@claude-plugins-official
```

> The official marketplace is maintained by Anthropic. To distribute your own plugins, [create your own marketplace](/docs/en/plugin-marketplaces) and share it with users.

### Code intelligence

> If you see `Executable not found in $PATH` in the `/plugin` Errors tab after installing a plugin, install the required binary from the table above.

### External integrations

- **Source control**: `github`, `gitlab`
- **Project management**: `atlassian` (Jira/Confluence), `asana`, `linear`, `notion`
- **Design**: `figma`
- **Infrastructure**: `vercel`, `firebase`, `supabase`
- **Communication**: `slack`
- **Monitoring**: `sentry`

### Development workflows

- **commit-commands**: Git commit workflows including commit, push, and PR creation
- **pr-review-toolkit**: Specialized agents for reviewing pull requests
- **agent-sdk-dev**: Tools for building with the Claude Agent SDK
- **plugin-dev**: Toolkit for creating your own plugins

### Output styles

- **explanatory-output-style**: Educational insights about implementation choices
- **learning-output-style**: Interactive learning mode for skill building

## Try it: add the demo marketplace

```
/plugin marketplace add anthropics/claude-code
```

Browse available plugins

- **Discover**: browse available plugins from all your marketplaces
- **Installed**: view and manage your installed plugins
- **Marketplaces**: add, remove, or update your added marketplaces
- **Errors**: view any plugin loading errors

Install a plugin

- **User scope**: install for yourself across all projects
- **Project scope**: install for all collaborators on this repository
- **Local scope**: install for yourself in this repository only

```
/plugin install commit-commands@anthropics-claude-code
```

Use your new plugin

```
/commit-commands:commit
```

## Add marketplaces

> **Shortcuts**: You can use `/plugin market` instead of `/plugin marketplace`, and `rm` instead of `remove`.

- **GitHub repositories**: `owner/repo` format (for example, `anthropics/claude-code`)
- **Git URLs**: any git repository URL (GitLab, Bitbucket, self-hosted)
- **Local paths**: directories or direct paths to `marketplace.json` files
- **Remote URLs**: direct URLs to hosted `marketplace.json` files

### Add from GitHub

### Add from other Git hosts

```
/plugin marketplace add https://gitlab.com/company/plugins.git
```

```
/plugin marketplace add git@gitlab.com:company/plugins.git
```

```
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

### Add from local paths

```
/plugin marketplace add ./my-marketplace
```

```
/plugin marketplace add ./path/to/marketplace.json
```

```
/plugin marketplace add https://example.com/marketplace.json
```

## Install plugins

```
/plugin install plugin-name@marketplace-name
```

- **User scope** (default): install for yourself across all projects
- **Project scope**: install for all collaborators on this repository (adds to `.claude/settings.json`)
- **Local scope**: install for yourself in this repository only (not shared with collaborators)

> Make sure you trust a plugin before installing it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they work as intended. Check each plugin’s homepage for more information.

## Manage installed plugins

```
/plugin disable plugin-name@marketplace-name
```

```
/plugin enable plugin-name@marketplace-name
```

```
/plugin uninstall plugin-name@marketplace-name
```

```
claude plugin install formatter@your-org --scope project
claude plugin uninstall formatter@your-org --scope project
```

## Manage marketplaces

### Use the interactive interface

- View all your added marketplaces with their sources and status
- Add new marketplaces
- Update marketplace listings to fetch the latest plugins
- Remove marketplaces you no longer need

### Use CLI commands

```
/plugin marketplace list
```

```
/plugin marketplace update marketplace-name
```

```
/plugin marketplace remove marketplace-name
```

> Removing a marketplace will uninstall any plugins you installed from it.

### Configure auto-updates

- Run `/plugin` to open the plugin manager
- Select **Marketplaces**
- Choose a marketplace from the list
- Select **Enable auto-update** or **Disable auto-update**

## Configure team marketplaces

## Troubleshooting

### /plugin command not recognized

- **Check your version**: Run `claude --version`. Plugins require version 1.0.33 or later.
- **Update Claude Code**:

**Homebrew**: `brew upgrade claude-code`
**npm**: `npm update -g @anthropic-ai/claude-code`
**Native installer**: Re-run the install command from [Setup](/docs/en/setup)
- **Homebrew**: `brew upgrade claude-code`
- **npm**: `npm update -g @anthropic-ai/claude-code`
- **Native installer**: Re-run the install command from [Setup](/docs/en/setup)
- **Restart Claude Code**: After updating, restart your terminal and run `claude` again.

### Common issues

- **Marketplace not loading**: Verify the URL is accessible and that `.claude-plugin/marketplace.json` exists at the path
- **Plugin installation failures**: Check that plugin source URLs are accessible and repositories are public (or you have access)
- **Files not found after installation**: Plugins are copied to a cache, so paths referencing files outside the plugin directory won’t work
- **Plugin Skills not appearing**: Clear the cache with `rm -rf ~/.claude/plugins/cache`, restart Claude Code, and reinstall the plugin. See [Plugin Skills not appearing](/docs/en/skills#plugin-skills-not-appearing-after-installation) for details.

## Next steps

- **Build your own plugins**: See [Plugins](/docs/en/plugins) to create custom commands, agents, and hooks
- **Create a marketplace**: See [Create a plugin marketplace](/docs/en/plugin-marketplaces) to distribute plugins to your team or community
- **Technical reference**: See [Plugins reference](/docs/en/plugins-reference) for complete specifications

Was this page helpful?
