# CLI reference

English

# CLI reference

Complete reference for Claude Code command-line interface, including commands and flags.

## CLI commands

## CLI flags

> The `--output-format json` flag is particularly useful for scripting and
> automation, allowing you to parse Claude’s responses programmatically.

### Agents flag format

```
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  },
  "debugger": {
    "description": "Debugging specialist for errors and test failures.",
    "prompt": "You are an expert debugger. Analyze errors, identify root causes, and provide fixes."
  }
}'
```

### System prompt flags

- `--system-prompt`: Use when you need complete control over Claude’s system prompt. This removes all default Claude Code instructions, giving you a blank slate.
CopyAsk AIclaude --system-prompt "You are a Python expert who only writes type-annotated code"

```
claude --system-prompt "You are a Python expert who only writes type-annotated code"
```

- `--system-prompt-file`: Use when you want to load a custom prompt from a file, useful for team consistency or version-controlled prompt templates.
CopyAsk AIclaude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"

```
claude -p --system-prompt-file ./prompts/code-review.txt "Review this PR"
```

- `--append-system-prompt`: Use when you want to add specific instructions while keeping Claude Code’s default capabilities intact. This is the safest option for most use cases.
CopyAsk AIclaude --append-system-prompt "Always use TypeScript and include JSDoc comments"

```
claude --append-system-prompt "Always use TypeScript and include JSDoc comments"
```

> `--system-prompt` and `--system-prompt-file` are mutually exclusive. You cannot use both flags simultaneously.

> For most use cases, `--append-system-prompt` is recommended as it preserves Claude Code’s built-in capabilities while adding your custom requirements. Use `--system-prompt` or `--system-prompt-file` only when you need complete control over the system prompt.

## See also

- [Chrome extension](/docs/en/chrome) - Browser automation and web testing
- [Interactive mode](/docs/en/interactive-mode) - Shortcuts, input modes, and interactive features
- [Slash commands](/docs/en/slash-commands) - Interactive session commands
- [Quickstart guide](/docs/en/quickstart) - Getting started with Claude Code
- [Common workflows](/docs/en/common-workflows) - Advanced workflows and patterns
- [Settings](/docs/en/settings) - Configuration options
- [SDK documentation](https://docs.claude.com/en/docs/agent-sdk) - Programmatic usage and integrations

Was this page helpful?
