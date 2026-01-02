# Claude Code overview

English

# Claude Code overview

Learn about Claude Code, Anthropic’s agentic coding tool that lives in your terminal and helps you turn ideas into code faster than ever before.

## Get started in 30 seconds

- A [Claude.ai](https://claude.ai) (recommended) or [Claude Console](https://console.anthropic.com/) account
- Native Install (Recommended)
- Homebrew
- NPM

```
curl -fsSL https://claude.ai/install.sh | bash
```

```
irm https://claude.ai/install.ps1 | iex
```

```
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

```
brew install --cask claude-code
```

```
npm install -g @anthropic-ai/claude-code
```

```
cd your-project
claude
```

> Claude Code automatically keeps itself up to date. See [advanced setup](/docs/en/setup) for installation options, manual updates, or uninstallation instructions. Visit [troubleshooting](/docs/en/troubleshooting) if you hit issues.

## What Claude Code does for you

- **Build features from descriptions**: Tell Claude what you want to build in plain English. It will make a plan, write the code, and ensure it works.
- **Debug and fix issues**: Describe a bug or paste an error message. Claude Code will analyze your codebase, identify the problem, and implement a fix.
- **Navigate any codebase**: Ask anything about your team’s codebase, and get a thoughtful answer back. Claude Code maintains awareness of your entire project structure, can find up-to-date information from the web, and with [MCP](/docs/en/mcp) can pull from external data sources like Google Drive, Figma, and Slack.
- **Automate tedious tasks**: Fix fiddly lint issues, resolve merge conflicts, and write release notes. Do all this in a single command from your developer machines, or automatically in CI.

## Why developers love Claude Code

- **Works in your terminal**: Not another chat window. Not another IDE. Claude Code meets you where you already work, with the tools you already love.
- **Takes action**: Claude Code can directly edit files, run commands, and create commits. Need more? [MCP](/docs/en/mcp) lets Claude read your design docs in Google Drive, update your tickets in Jira, or use *your* custom developer tooling.
- **Unix philosophy**: Claude Code is composable and scriptable. `tail -f app.log | claude -p "Slack me if you see any anomalies appear in this log stream"` *works*. Your CI can run `claude -p "If there are new text strings, translate them into French and raise a PR for @lang-fr-team to review"`.
- **Enterprise-ready**: Use the Claude API, or host on AWS or GCP. Enterprise-grade [security](/docs/en/security), [privacy](/docs/en/data-usage), and [compliance](https://trust.anthropic.com/) is built-in.

## Next steps

## Quickstart

## Common workflows

## Troubleshooting

## IDE setup

## Additional resources

## About Claude Code

## Build with the Agent SDK

## Host on AWS or GCP

## Settings

## Commands

## Reference implementation

## Security

## Privacy and data usage

Was this page helpful?
