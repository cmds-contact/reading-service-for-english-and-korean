# Claude Code on desktop

English

# Claude Code on desktop

Run Claude Code tasks locally or on secure cloud infrastructure with the Claude desktop app

## Claude Code on desktop (Preview)

## Features

- Parallel local sessions with `git` worktrees: Run multiple Claude Code sessions simultaneously in the same repository, each with its own isolated `git` worktree
- Include files listed in your `.gitignore` in your worktrees: Automatically copy files in your `.gitignore`, like `.env`, to new worktrees using `.worktreeinclude`
- **Launch Claude Code on the web**: Kick off secure cloud sessions directly from the desktop app

## Installation

> Local sessions are not available on Windows arm64 architectures.

## Using Git worktrees

> If you start a local session in a folder that does not have Git initialized, the desktop app will not create a new worktree.

### Copying files ignored with .gitignore

```
.env
.env.local
.env.*
**/.claude/settings.local.json
```

> Only files that are both matched by `.worktreeinclude` AND listed in `.gitignore` are copied. This prevents accidentally duplicating tracked files.

### Launch Claude Code on the web

## Bundled Claude Code version

> The bundled Claude Code version in Desktop may differ from the latest CLI version. Desktop prioritizes stability while the CLI may have newer features.

## Environment configuration

### Custom environment variables

> Environment variables must be specified as key-value pairs, in `.env` format. For example:CopyAsk AIAPI_KEY=your_api_key
> DEBUG=true
> 
> # Multiline values - wrap in quotes
> CERT="-----BEGIN CERT-----
> MIIE...
> -----END CERT-----"

```
API_KEY=your_api_key
DEBUG=true

# Multiline values - wrap in quotes
CERT="-----BEGIN CERT-----
MIIE...
-----END CERT-----"
```

## Enterprise configuration

## Related resources

- [Claude Code on the web](/docs/en/claude-code-on-the-web)
- [Claude Desktop support articles](https://support.claude.com/en/collections/16163169-claude-desktop)
- [Enterprise Configuration](https://support.claude.com/en/articles/12622667-enterprise-configuration)
- [Common workflows](/docs/en/common-workflows)
- [Settings reference](/docs/en/settings)

Was this page helpful?
